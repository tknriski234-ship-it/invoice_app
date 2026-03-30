from pydantic_settings  import BaseSettings ,SettingsConfigDict
from functools import lru_cache
from pathlib import Path

BASEDIR = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    database_url : str = ""
    secret_token : str = ""


    model_config = SettingsConfigDict(
        env_file= BASEDIR / ".env",
        env_prefix="APP_",
        case_sensitive=False,
        env_file_encoding="utf-8",
        extra="ignore"
    )

@lru_cache
def get_settings():
    return Settings()

settings = get_settings()
