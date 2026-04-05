import uuid
from fastapi import APIRouter , Depends , HTTPException
from app.modules.invoice_items.schema import InvoiceItemCreate, InvoiceItemOut, InvoiceItemUpdate
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.modules.invoice_items.service import InvoiceItemsService
from app.core.exception import InvoiceItemNotFound, InvoiceNotFound
from app.modules.user.models import User
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/invoice")

@router.post("/{public_id}/items", response_model=InvoiceItemOut)
def create_invoice_item(
    public_id: uuid.UUID,
    data: InvoiceItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = InvoiceItemsService(db)

    try:
        return service.create_invoice_item(current_user, public_id, data)
    except InvoiceNotFound as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.get("/{public_id}/items", response_model=list[InvoiceItemOut])
def get_invoice_items(
    public_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = InvoiceItemsService(db)

    try:
        return service.get_invoice_items(current_user, public_id)
    except InvoiceNotFound as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.get("/items/{item_public_id}", response_model=InvoiceItemOut)
def get_invoice_item_detail(
    item_public_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = InvoiceItemsService(db)

    try:
        return service.get_invoice_item_detail(current_user, item_public_id)
    except InvoiceItemNotFound as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.patch("/items/{item_public_id}", response_model=InvoiceItemOut)
def update_invoice_item(
    item_public_id: uuid.UUID,
    data: InvoiceItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = InvoiceItemsService(db)

    try:
        return service.update_invoice_item(current_user, item_public_id, data)
    except InvoiceItemNotFound as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.delete("/items/{item_public_id}")
def delete_invoice_item(
    item_public_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = InvoiceItemsService(db)

    try:
        service.delete_invoice_item(current_user, item_public_id)
        return {"message": "Invoice item berhasil dihapus"}
    except InvoiceItemNotFound as e:
        raise HTTPException(status_code=404, detail=e.message)
