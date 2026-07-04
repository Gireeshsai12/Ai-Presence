import json
from pathlib import Path
from typing import Dict

from models.session_models import SessionState

STORE_PATH = Path("session_store.json")


class SessionStore:
    def __init__(self):
        self.sessions: Dict[str, SessionState] = {}
        self.load()

    def load(self):
        if not STORE_PATH.exists():
            self.sessions = {}
            return

        try:
            raw = json.loads(STORE_PATH.read_text(encoding="utf-8"))
            self.sessions = {
                session_id: SessionState(**payload)
                for session_id, payload in raw.items()
            }
        except Exception:
            self.sessions = {}

    def save(self):
        payload = {
            session_id: session.model_dump()
            for session_id, session in self.sessions.items()
        }
        STORE_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    def get(self, session_id: str) -> SessionState:
        if session_id not in self.sessions:
            self.sessions[session_id] = SessionState(session_id=session_id)
            self.save()
        return self.sessions[session_id]

    def update(self, session: SessionState):
        self.sessions[session.session_id] = session
        self.save()

    def clear_messages(self, session_id: str) -> SessionState:
        session = self.get(session_id)
        session.messages = []
        self.update(session)
        return session

    def reset(self, session_id: str) -> SessionState:
        self.sessions[session_id] = SessionState(session_id=session_id)
        self.save()
        return self.sessions[session_id]


store = SessionStore()
