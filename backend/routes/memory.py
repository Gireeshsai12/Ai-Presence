from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.session import get_db
from services.memory_service import add_memory, get_memory

router = APIRouter()


class MemoryCreate(BaseModel):
    category: str
    value: str
    source: str | None = None


@router.get("/")
def read_memory(db: Session = Depends(get_db)):
    return get_memory(db)


@router.post("/")
def create_memory(payload: MemoryCreate, db: Session = Depends(get_db)):
    item = add_memory(db, payload.category, payload.value, source=payload.source)
    return {"id": item.id, "category": item.category, "value": item.value}
