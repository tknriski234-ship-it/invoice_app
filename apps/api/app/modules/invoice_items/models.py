from app.db.base import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped , mapped_column ,relationship
from sqlalchemy import String, DateTime, ForeignKey , Numeric
import uuid
from datetime import datetime , timezone
from typing import TYPE_CHECKING
from decimal import Decimal

if TYPE_CHECKING:
    from app.modules.invoice.models import Invoice

class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    public_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        unique=True,
        nullable=False,
        index=True,
        default=uuid.uuid4
    )

    invoice_id: Mapped[int] = mapped_column(
        ForeignKey("invoices.id", ondelete="CASCADE"),
        nullable=False
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)

    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    quantity: Mapped[int] = mapped_column(nullable=False, default=1)

    unit_price: Mapped[Decimal] = mapped_column(Numeric(22, 2), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    invoice: Mapped["Invoice"] = relationship(back_populates="items")

    @property
    def subtotal(self) -> Decimal:
        return self.quantity * self.unit_price
