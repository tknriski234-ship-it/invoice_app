from datetime import date, datetime
from decimal import Decimal
import uuid
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field, field_validator


class InvoiceCreate(BaseModel):
    title: str
    issued_date: date
    due_date: date

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("title tidak boleh kosong")
        return value

    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, value: date, info):
        issued_date = info.data.get("issued_date")
        if issued_date and value < issued_date:
            raise ValueError("due_date tidak boleh sebelum issued_date")
        return value

class InvoiceStatus(str, Enum):
    draft = "draft"
    sent = "sent"
    paid = "paid"
    overdue = "overdue"
    cancelled = "cancelled"

class InvoiceOut(BaseModel):
    id: int
    public_id: uuid.UUID
    user_id: int
    invoice_number: str
    title: str
    amount: Decimal
    status: InvoiceStatus
    issued_date: date
    due_date: date
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class InvoiceUpdate(BaseModel):
    title: str
    due_date: date
    status: InvoiceStatus

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("title tidak boleh kosong")
        return value

