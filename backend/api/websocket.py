from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from database.models import ConversationSession, Message
from database.session import SessionLocal
from services.ai_service import generate_ai_reply
from services.memory_service import get_memory, remember_from_message

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    db = SessionLocal()
    session_id = None
    mode = "interview_coach"
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("command") == "load_session":
                session_id = data.get("session_id")
                if session_id and not db.query(ConversationSession).filter(ConversationSession.id == session_id).first():
                    db.add(ConversationSession(id=session_id, title="New Session", mode=mode))
                    db.commit()
                rows = db.query(Message).filter(Message.session_id == session_id).order_by(Message.created_at.asc()).all() if session_id else []
                await websocket.send_json({"event": "session_loaded", "messages": [{"sender": m.sender, "text": m.text} for m in rows], "memory": get_memory(db)})
                continue
            if data.get("command") == "set_mode":
                mode = data.get("mode", mode)
                await websocket.send_json({"event": "mode_changed", "selected_mode": mode})
                continue
            text = data.get("text", "").strip()
            if not text:
                continue
            if not session_id:
                session_id = data.get("session_id") or f"session_{int(datetime.utcnow().timestamp())}"
                db.add(ConversationSession(id=session_id, title="New Session", mode=mode))
                db.commit()
            db.add(Message(session_id=session_id, sender="You", text=text, input_mode=data.get("input_mode", "text")))
            remember_from_message(db, text)
            db.commit()
            await websocket.send_json({"event": "thinking", "ai_state": "thinking"})
            memory = get_memory(db)
            reply = await generate_ai_reply(text, mode, memory)
            db.add(Message(session_id=session_id, sender="AI", text=reply, input_mode="ai"))
            db.commit()
            rows = db.query(Message).filter(Message.session_id == session_id).order_by(Message.created_at.asc()).all()
            await websocket.send_json({"event": "assistant_reply", "reply": reply, "messages": [{"sender": m.sender, "text": m.text} for m in rows], "selected_mode": mode, "memory": memory, "stats": {"total_user_messages": len([m for m in rows if m.sender == "You"]), "voice_messages": len([m for m in rows if m.input_mode == "voice"]), "text_messages": len([m for m in rows if m.input_mode == "text"]), "interruptions": 0}})
    except WebSocketDisconnect:
        pass
    finally:
        db.close()
