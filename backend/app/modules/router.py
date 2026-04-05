from app.modules.user.router import router as user_router
from app.modules.invoice.router import router as invoice_router
from app.modules.invoice_items.router import router as invoice_items_router
from fastapi import APIRouter

router = APIRouter()

router.include_router(user_router)
router.include_router(invoice_router)
router.include_router(invoice_items_router)