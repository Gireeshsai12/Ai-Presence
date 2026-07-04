from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from database.session import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    sessions = relationship("ConversationSession", back_populates="user")


class ConversationSession(Base):
    __tablename__ = "conversation_sessions"
    id = Column(String(128), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), default="New Session")
    mode = Column(String(80), default="interview_coach")
    favorite = Column(Boolean, default=False)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="sessions")
    messages = relationship("Message", back_populates="session", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(128), ForeignKey("conversation_sessions.id"), index=True)
    sender = Column(String(40), nullable=False)
    text = Column(Text, nullable=False)
    input_mode = Column(String(40), default="text")
    created_at = Column(DateTime, default=datetime.utcnow)
    session = relationship("ConversationSession", back_populates="messages")


class UserMemory(Base):
    __tablename__ = "user_memory"
    id = Column(Integer, primary_key=True, index=True)
    user_key = Column(String(128), default="default", index=True)
    category = Column(String(80), index=True)
    value = Column(Text, nullable=False)
    source = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class CareerProfile(Base):
    __tablename__ = "career_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_key = Column(String(128), default="default", index=True)
    resume_text = Column(Text, nullable=True)
    target_roles = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow)
