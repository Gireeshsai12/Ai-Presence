from fastapi import APIRouter
from config.settings import get_settings

router = APIRouter()


@router.get("/health")
def health():
    s = get_settings()
    return {"status": "ok", "app": s.app_name, "environment": s.environment}
