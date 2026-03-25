from sqlalchemy import create_engine
from sqlalchemy.orm import Session , sessionmaker
from collections.abc import Generator
from app.core.config import setting

engine = create_engine(
    setting.database_url,
    pool_pre_ping=True,
    echo=False,pool_size=5,
    max_overflow=20
    )

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False)

def get_db() -> Generator[Session,None,None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()