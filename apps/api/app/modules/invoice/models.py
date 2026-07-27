from app.db.base import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped , mapped_column ,relationship
from sqlalchemy import CheckConstraint, String, DateTime, ForeignKey , Numeric , Date, UniqueConstraint
import uuid
from datetime import datetime , timezone ,date
from typing import TYPE_CHECKING
from decimal import Decimal

if TYPE_CHECKING:
    from app.modules.user.models import User    
    from app.modules.invoice_items.models import InvoiceItem

class Invoice(Base):
    __tablename__ = "invoices"
    __table_args__ = (
        CheckConstraint("amount >= 0", name="ck_invoices_amount_non_negative"),
        CheckConstraint("due_date >= issued_date", name="ck_invoices_due_date_after_issued_date"),
        CheckConstraint(
            "status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')",
            name="ck_invoices_status_valid",
        ),
        UniqueConstraint("user_id", "invoice_number", name="uq_invoices_user_invoice_number"),
    )

    id : Mapped[int] = mapped_column(primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
    ForeignKey("users.id", ondelete="CASCADE"),
    nullable=False
    )

    public_id : Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), unique=True , nullable=False , index=True , default=uuid.uuid4)

    invoice_number : Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    title : Mapped[str] = mapped_column(String(1000),nullable=False, unique=False)

    amount : Mapped[Decimal] = mapped_column(Numeric(22,2),nullable=False,)

    status : Mapped[str] = mapped_column(String(20), nullable=False , default="draft")

    issued_date : Mapped[date] = mapped_column(Date, nullable=False)

    due_date : Mapped[date] = mapped_column(Date,nullable=False)

    created_at : Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda : datetime.now(timezone.utc))

    updated_at : Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda : datetime.now(timezone.utc),onupdate=lambda : datetime.now(timezone.utc))

    user: Mapped["User"] = relationship(back_populates="invoices")

    items: Mapped[list["InvoiceItem"]] = relationship(
        back_populates="invoice",
        cascade="all, delete-orphan"
    )
