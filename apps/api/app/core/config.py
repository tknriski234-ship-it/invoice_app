from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASEDIR = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    database_url: str = Field(..., min_length=1)
    secret_token: str = Field(..., min_length=32)
    algorithm: str = "HS256"
    access_token_expire_minute: int = 30


    model_config = SettingsConfigDict(
        env_file= BASEDIR / ".env",
        env_prefix="APP_",
        case_sensitive=False,
        env_file_encoding="utf-8",
        extra="ignore"
    )

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
