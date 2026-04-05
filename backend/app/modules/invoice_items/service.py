import uuid
from decimal import Decimal
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.exception import InvoiceNotFound, InvoiceItemNotFound
from app.modules.invoice.models import Invoice
from app.modules.invoice_items.models import InvoiceItem
from app.modules.invoice_items.schema import InvoiceItemCreate, InvoiceItemUpdate
from app.modules.user.models import User

class InvoiceItemsService:
    def __init__(self,db :Session) -> None:
        self.db = db   

    def _recalculate_invoice_amount(self, invoice: Invoice) -> None:
        stmt = select(InvoiceItem).where(InvoiceItem.invoice_id == invoice.id)
        items = self.db.execute(stmt).scalars().all()
        invoice.amount = sum(
            (item.quantity * item.unit_price for item in items),
            start=Decimal("0.00")
        )

    def _get_owned_invoice(self, current_user: User, public_id: uuid.UUID) -> Invoice:
        stmt = select(Invoice).where(
            Invoice.public_id == public_id,
            Invoice.user_id == current_user.id
        )
        invoice = self.db.execute(stmt).scalar_one_or_none()

        if not invoice:
            raise InvoiceNotFound("Invoice tidak ditemukan")

        return invoice

    def _get_owned_invoice_item(self, current_user: User, item_public_id: uuid.UUID) -> InvoiceItem:
        stmt = (
            select(InvoiceItem)
            .join(Invoice, InvoiceItem.invoice_id == Invoice.id)
            .where(
                InvoiceItem.public_id == item_public_id,
                Invoice.user_id == current_user.id
            )
        )
        item = self.db.execute(stmt).scalar_one_or_none()

        if not item:
            raise InvoiceItemNotFound("Invoice item tidak ditemukan")

        return item
    def create_invoice_item(
        self,
        current_user: User,
        invoice_public_id: uuid.UUID,
        data: InvoiceItemCreate
    ) -> InvoiceItem:
        invoice = self._get_owned_invoice(current_user, invoice_public_id)

        item = InvoiceItem(
            invoice_id=invoice.id,
            title=data.title,
            description=data.description,
            quantity=data.quantity,
            unit_price=data.unit_price,
        )

        try:
            self.db.add(item)
            self.db.flush()
            self._recalculate_invoice_amount(invoice)
            self.db.commit()
            self.db.refresh(item)
            return item
        except Exception:
            self.db.rollback()
            raise

    def get_invoice_items(
        self,
        current_user: User,
        invoice_public_id: uuid.UUID
    ) -> list[InvoiceItem]:
        invoice = self._get_owned_invoice(current_user, invoice_public_id)
        stmt = (
            select(InvoiceItem)
            .where(InvoiceItem.invoice_id == invoice.id)
            .order_by(InvoiceItem.created_at.asc())
        )
        return list(self.db.execute(stmt).scalars().all())

    def get_invoice_item_detail(
        self,
        current_user: User,
        item_public_id: uuid.UUID
    ) -> InvoiceItem:
        return self._get_owned_invoice_item(current_user, item_public_id)

    def update_invoice_item(
        self,
        current_user: User,
        item_public_id: uuid.UUID,
        data: InvoiceItemUpdate
    ) -> InvoiceItem:
        item = self._get_owned_invoice_item(current_user, item_public_id)

        item.title = data.title
        item.description = data.description
        item.quantity = data.quantity
        item.unit_price = data.unit_price

        try:
            invoice = item.invoice
            self._recalculate_invoice_amount(invoice)
            self.db.commit()
            self.db.refresh(item)
            return item
        except Exception:
            self.db.rollback()
            raise

    def delete_invoice_item(self, current_user: User, item_public_id: uuid.UUID) -> None:
        item = self._get_owned_invoice_item(current_user, item_public_id)
        invoice = item.invoice

        try:
            self.db.delete(item)
            self.db.flush()
            self._recalculate_invoice_amount(invoice)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise
