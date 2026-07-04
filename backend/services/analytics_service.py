from collections import Counter
from sqlalchemy.orm import Session
from database.models import CareerProfile, ConversationSession, Message, UserMemory


def get_dashboard_stats(db: Session, user_key: str = "default") -> dict:
    sessions = db.query(ConversationSession).all()
    messages = db.query(Message).all()
    memories = db.query(UserMemory).filter(UserMemory.user_key == user_key).all()
    profile = db.query(CareerProfile).filter(CareerProfile.user_key == user_key).first()
    mode_counts = Counter([s.mode for s in sessions])
    recent_sessions = [{"id": s.id, "title": s.title, "mode": s.mode, "favorite": s.favorite, "updated_at": s.updated_at.isoformat() if s.updated_at else None} for s in sorted(sessions, key=lambda x: x.updated_at, reverse=True)[:10]]
    return {"total_sessions": len(sessions), "total_messages": len(messages), "user_messages": len([m for m in messages if m.sender == "You"]), "ai_messages": len([m for m in messages if m.sender != "You"]), "favorite_sessions": len([s for s in sessions if s.favorite]), "mode_usage": dict(mode_counts), "memory_items": len(memories), "has_resume_profile": bool(profile and profile.resume_text), "resume_skill_count": len(profile.skills.split(", ")) if profile and profile.skills else 0, "recent_sessions": recent_sessions, "recommended_next_steps": ["Upload your latest resume.", "Analyze one job description.", "Complete one STAR answer.", "Run one mock interview."]}
