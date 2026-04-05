from pydantic import BaseModel,Field,field_validator , ConfigDict
from decimal import Decimal
import uuid
from datetime import datetime

class InvoiceItemCreate(BaseModel):
    title: str
    description: str | None = None
    quantity: int = Field(gt=0)
    unit_price: Decimal = Field(gt=0)

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("title tidak boleh kosong")
        return value


class InvoiceItemOut(BaseModel):
    id: int
    public_id: uuid.UUID
    invoice_id: int
    title: str
    description: str | None
    quantity: int
    unit_price: Decimal
    subtotal: Decimal
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InvoiceItemUpdate(BaseModel):
    title: str
    description: str | None = None
    quantity: int = Field(gt=0)
    unit_price: Decimal = Field(gt=0)

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("title tidak boleh kosong")
        return value
