from pathlib import Path
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    APP_NAME: str = "AI Drug Discovery Simulator"
    DEBUG: bool = True
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    MODEL_DIR: Path = Path("data/models")
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama3-70b-8192"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
