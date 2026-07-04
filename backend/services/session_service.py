from sqlalchemy.orm import Session
from models import ChatMessage, ChatSession
from utils.json_tools import dumps, loads

class SessionService:
    def __init__(self, db: Session):
        self.db = db

    def get_or_create(self, client_session_id: str, mode: str = "interview_coach") -> ChatSession:
        session = (
            self.db.query(ChatSession)
            .filter(ChatSession.client_session_id == client_session_id)
            .first()
        )
        if session:
            return session
        session = ChatSession(client_session_id=client_session_id, mode=mode)
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def set_mode(self, client_session_id: str, mode: str) -> ChatSession:
        session = self.get_or_create(client_session_id, mode)
        session.mode = mode
        self.db.commit()
        self.db.refresh(session)
        return session

    def add_message(self, client_session_id: str, sender: str, text: str, input_mode: str = "text", behavior: dict | None = None) -> ChatMessage:
        session = self.get_or_create(client_session_id)
        message = ChatMessage(
            session_id=session.id,
            sender=sender,
            text=text,
            input_mode=input_mode,
            behavior_json=dumps(behavior or {}),
        )
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message

    def get_messages(self, client_session_id: str) -> list[dict]:
        session = self.get_or_create(client_session_id)
        rows = (
            self.db.query(ChatMessage)
            .filter(ChatMessage.session_id == session.id)
            .order_by(ChatMessage.created_at.asc())
            .all()
        )
        return [{"sender": row.sender, "text": row.text} for row in rows]

    def clear_messages(self, client_session_id: str) -> None:
        session = self.get_or_create(client_session_id)
        self.db.query(ChatMessage).filter(ChatMessage.session_id == session.id).delete()
        self.db.commit()

    def update_memory(self, client_session_id: str, memory: dict) -> dict:
        session = self.get_or_create(client_session_id)
        current = loads(session.memory_json, {})
        current.update(memory)
        session.memory_json = dumps(current)
        self.db.commit()
        return current

    def get_memory(self, client_session_id: str) -> dict:
        session = self.get_or_create(client_session_id)
        return loads(session.memory_json, {})
