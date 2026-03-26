from pydantic_settings import BaseSettings , SettingsConfigDict
from pathlib import Path
from functools import lru_cache

BASE_DIR = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    database_url : str
    secret_token : str
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="APP_",
        extra="ignore",
        env_file_encoding="utf-8",
        case_sensitive=False
        
    )

@lru_cache
def get_settigs():
    return Settings()

setting = get_settigs()