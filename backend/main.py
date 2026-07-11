from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.router import api_router
from api.websocket import router as websocket_router
from config.settings import get_settings
from database.session import init_db

settings = get_settings()

app = FastAPI(title=settings.app_name, version="10.0.0", description="AI Presence final full-stack backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        settings.frontend_origin,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://ai-presence-ll6z.vercel.app",
    ],
    allow_origin_regex=r"https://ai-presence-[a-zA-Z0-9-]+-gireeshsai12s-projects\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


app.include_router(api_router, prefix="/api")
app.include_router(websocket_router)


@app.get("/")
def root():
    return {"app": settings.app_name, "status": "running", "version": "10.0.0"}
