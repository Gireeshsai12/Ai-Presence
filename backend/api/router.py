from fastapi import APIRouter
from routes.analytics import router as analytics_router
from routes.auth import router as auth_router
from routes.career import router as career_router
from routes.health import router as health_router
from routes.interview import router as interview_router
from routes.memory import router as memory_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["health"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(career_router, prefix="/career", tags=["career"])
api_router.include_router(memory_router, prefix="/memory", tags=["memory"])
api_router.include_router(interview_router, prefix="/interview", tags=["interview"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])
