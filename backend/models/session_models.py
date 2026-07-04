from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional


class ChatMessage(BaseModel):
    sender: str
    text: str


class SessionMemory(BaseModel):
    name: str = ""
    likes: List[str] = Field(default_factory=list)
    goals: List[str] = Field(default_factory=list)
    personal_notes: List[str] = Field(default_factory=list)
    resume_summary: str = ""
    target_roles: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    weak_areas: List[str] = Field(default_factory=list)


class SessionState(BaseModel):
    session_id: str
    selected_mode: str = "interview_coach"
    messages: List[ChatMessage] = Field(default_factory=list)
    memory: SessionMemory = Field(default_factory=SessionMemory)
    emotion_state: Dict[str, Any] = Field(
        default_factory=lambda: {
            "user_emotion": "neutral",
            "ai_mode": "balanced",
            "emotion_reason": "No strong emotional signal detected yet.",
        }
    )
    stats: Dict[str, int] = Field(
        default_factory=lambda: {
            "total_user_messages": 0,
            "voice_messages": 0,
            "text_messages": 0,
            "interruptions": 0,
        }
    )
    behavior_context: str = "No behavior analysis yet."
