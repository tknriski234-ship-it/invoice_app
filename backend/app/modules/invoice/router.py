import uuid
from fastapi import APIRouter , Depends , HTTPException
from app.modules.invoice.schema import InvoiceCreate , InvoiceOut , InvoiceUpdate
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.modules.invoice.service import InvoiceService
from app.core.exception import InvoiceAlreadyExists ,InvoiceNotFound
from app.modules.user.models import User
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/invoice",tags=["Invoice"])

@router.post("/create" , response_model=InvoiceOut)
def create_invoice(
    data : InvoiceCreate, 
    db : Session = Depends(get_db), 
    current_user : User = Depends(get_current_user)
):
    service = InvoiceService(db)
    try:
        invoice = service.create_invoice(current_user, data)
        return invoice
    except InvoiceAlreadyExists as e:
        raise HTTPException(status_code=400,detail=e.message)
    
@router.get("/me", response_model=list[InvoiceOut])
def get_my_invoices(
    db : Session = Depends(get_db), 
    current_user : User = Depends(get_current_user)
):
    service = InvoiceService(db)
    return service.get_my_invoices(current_user)

@router.get("/{public_id}" , response_model=InvoiceOut)
def get_invoice_detail(public_id : uuid.UUID, db : Session = Depends(get_db) , current_user : User = Depends(get_current_user)):
    service = InvoiceService(db)
    try:
        return service.get_invoice_detail(current_user,public_id)
    except InvoiceNotFound as e :
        raise HTTPException(status_code=404,detail=e.message)
    
@router.patch("/{public_id}" , response_model=InvoiceOut)
def update_invoice(
    public_id : uuid.UUID,
    data : InvoiceUpdate, 
    db : Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    service = InvoiceService(db)

    try:
        return service.update_invoice(current_user , public_id , data)
    except InvoiceNotFound as e:
        raise HTTPException(status_code=404, detail=e.message)
    
@router.delete("/{public_id}")
def delete_invoice(
    public_id : uuid.UUID, 
    db : Session = Depends(get_db), 
    current_user : User = Depends(get_current_user)
):
    service = InvoiceService(db)

    try:
        service.delete_invoice(current_user , public_id)
        return {"message" : "Invoice berhasil dihapus"}
    except InvoiceNotFound as e:
        raise HTTPException(status_code=404, detail=e.message)