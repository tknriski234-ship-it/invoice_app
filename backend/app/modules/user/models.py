from sqlalchemy import String , DateTime ,Boolean
from sqlalchemy.orm import Mapped , mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base
from datetime import datetime ,timezone
import uuid

class User(Base):
    __tablename__ = "users"

    id : Mapped[int] = mapped_column(primary_key=True, index=True)

    public_id : Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), unique=True, nullable=False , index=True, default=uuid.uuid4)

    full_name : Mapped[str] = mapped_column(String(50), nullable=False)

    email : Mapped[str] = mapped_column(String(254), unique=True , nullable=False , index=True)

    password_hash : Mapped[str] = mapped_column(String(255), nullable=False)

    created_at : Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda : datetime.now(timezone.utc))

    updated_at : Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda : datetime.now(timezone.utc),onupdate=lambda : datetime.now(timezone.utc))

    last_login : Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    
    is_verified : Mapped[bool] = mapped_column(Boolean,default=False)

    is_active : Mapped[bool] = mapped_column(Boolean, default=True)

