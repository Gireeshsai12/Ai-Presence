from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Presence"
    environment: str = "development"
    frontend_url: str = "http://localhost:3000"
    frontend_origin: str = "http://localhost:3000"
    database_url: str = "sqlite:///./ai_presence.db"
    secret_key: str = "change-this-secret-key-before-deployment"
    access_token_expire_minutes: int = 1440
    openai_api_key: str | None = None
    gemini_api_key: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
