from datetime import datetime
from typing import Any
from pydantic import BaseModel

class MessageCreate(BaseModel):
    sender: str
    text: str
    input_mode: str = "text"
    behavior: dict[str, Any] = {}

class MessageOut(BaseModel):
    sender: str
    text: str
    input_mode: str = "text"
    created_at: datetime | None = None

class SessionOut(BaseModel):
    client_session_id: str
    title: str
    mode: str
    favorite: bool
    created_at: datetime
    updated_at: datetime
    messages: list[MessageOut] = []
