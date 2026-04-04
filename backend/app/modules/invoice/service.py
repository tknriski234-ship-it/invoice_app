import uuid
from sqlalchemy import select
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.exception import InvoiceAlreadyExists , InvoiceNotFound
from app.modules.invoice.models import Invoice
from app.modules.invoice.schema import InvoiceCreate, InvoiceStatus ,InvoiceUpdate
from app.modules.user.models import User


class InvoiceService:
    def __init__(self, db : Session) -> None:
        self.db = db

    def _get_invoice_by_number(self, invoice_number: str) -> Invoice | None:
        stmt = select(Invoice).where(Invoice.invoice_number == invoice_number)
        return self.db.execute(stmt).scalar_one_or_none()
    
    def _generate_invoice_number(self) -> str:
        year = datetime.now().year

        stmt = (select(Invoice).where(Invoice.invoice_number.like(f"INV-{year}-%")).order_by(Invoice.id.desc()))
        
        last_invoice = self.db.execute(stmt).scalar_one_or_none()

        if not last_invoice:
            sequence = 1
        else:
            last_number = last_invoice.invoice_number.split("-")[-1]
            sequence = int(last_number) + 1

        return f"INV-{year}-{sequence:03d}"

    def create_invoice(self, current_user: User, data: InvoiceCreate) -> Invoice:
        invoice_number = self._generate_invoice_number()
        existing_invoice = self._get_invoice_by_number(invoice_number)

        if existing_invoice:
            raise InvoiceAlreadyExists("Nomor invoice sudah digunakan")

        invoice = Invoice(
            user_id=current_user.id,
            invoice_number=invoice_number,
            title=data.title,
            amount=data.amount,
            status=InvoiceStatus.draft.value,
            issued_date=data.issued_date,
            due_date=data.due_date,
        )

        try:
            self.db.add(invoice)
            self.db.commit()
            self.db.refresh(invoice)
            return invoice
        except Exception:
            self.db.rollback()
            raise
    def get_my_invoices(self, current_user: User) -> list[Invoice]:
        stmt = (
            select(Invoice)
            .where(Invoice.user_id == current_user.id)
            .order_by(Invoice.created_at.desc())
        )
        return list(self.db.execute(stmt).scalars().all())
    def get_invoice_detail(self, current_user : User, public_id : uuid.UUID) -> Invoice:
        stmt = select(Invoice).where(Invoice.public_id == public_id,Invoice.user_id == current_user.id)

        invoice = self.db.execute(stmt).scalar_one_or_none()

        if not invoice:
            raise InvoiceNotFound("invoice tidak ditemukan")

        return invoice
    
    def update_invoice(self,current_user : User, public_id : uuid.UUID, data : InvoiceUpdate) -> Invoice:
        stmt = select(Invoice).where(Invoice.public_id == public_id,Invoice.user_id == current_user.id)
        invoice = self.db.execute(stmt).scalar_one_or_none()

        if not invoice :
            raise InvoiceNotFound("Invoice tidak ditemukan")

        invoice.title = data.title
        invoice.amount = data.amount
        invoice.due_date = data.due_date
        invoice.status = data.status.value

        try:
            self.db.commit()
            self.db.refresh(invoice)
            return invoice
        except Exception:
            self.db.rollback()
            raise

    def delete_invoice(self,current_user: User , public_id : uuid.UUID ,) -> None:
        stmt = select(Invoice).where(Invoice.public_id == public_id, Invoice.user_id == current_user.id)
        invoice = self.db.execute(stmt).scalar_one_or_none()

        if not invoice:
            raise InvoiceNotFound("Invoice tidak ditemukan")
        
        try:
            self.db.delete(invoice)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise