from sqlalchemy import create_engine
from sqlalchemy.orm import Session , sessionmaker
from app.core.config import settings
from collections.abc import Generator

engine = create_engine(
    settings.database_url,
    echo=False,
    pool_size=5,
    pool_pre_ping=False,
    max_overflow=20
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False
)

def get_db() -> Generator[Session,None,None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    pass

