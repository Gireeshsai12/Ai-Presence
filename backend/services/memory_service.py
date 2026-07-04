from sqlalchemy.orm import Session
from database.models import CareerProfile, UserMemory
from services.text_utils import TECH_KEYWORDS, keyword_hits


def add_memory(db: Session, category: str, value: str, user_key: str = "default", source: str | None = None):
    memory = UserMemory(user_key=user_key, category=category, value=value, source=source)
    db.add(memory)
    db.commit()
    db.refresh(memory)
    return memory


def get_memory(db: Session, user_key: str = "default") -> dict:
    rows = db.query(UserMemory).filter(UserMemory.user_key == user_key).order_by(UserMemory.created_at.desc()).limit(100).all()
    result = {"name": "", "likes": [], "goals": [], "skills": [], "weaknesses": [], "notes": []}
    for row in rows:
        if row.category in result and isinstance(result[row.category], list):
            result[row.category].append(row.value)
        elif row.category == "name":
            result["name"] = row.value
        else:
            result["notes"].append(row.value)
    profile = db.query(CareerProfile).filter(CareerProfile.user_key == user_key).first()
    if profile:
        result["resume_skills"] = profile.skills.split(", ") if profile.skills else []
        result["target_roles"] = profile.target_roles or ""
        result["has_resume"] = bool(profile.resume_text)
    return result


def remember_from_message(db: Session, text: str, user_key: str = "default"):
    low = text.lower()
    created = []
    if "my name is " in low:
        name = text[low.find("my name is ") + len("my name is "):].split(".")[0].strip()
        if name:
            created.append(add_memory(db, "name", name[:80], user_key, "chat"))
    for skill in keyword_hits(text, TECH_KEYWORDS)[:5]:
        created.append(add_memory(db, "skills", skill, user_key, "chat"))
    return created


def upsert_career_profile(db: Session, resume_text: str | None = None, skills: str | None = None, target_roles: str | None = None, user_key: str = "default"):
    profile = db.query(CareerProfile).filter(CareerProfile.user_key == user_key).first()
    if not profile:
        profile = CareerProfile(user_key=user_key)
        db.add(profile)
    if resume_text is not None:
        profile.resume_text = resume_text
        profile.skills = ", ".join(keyword_hits(resume_text, TECH_KEYWORDS))
    if skills is not None:
        profile.skills = skills
    if target_roles is not None:
        profile.target_roles = target_roles
    db.commit()
    db.refresh(profile)
    return profile
