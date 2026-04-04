from app.modules.user.router import router as user_router
from app.modules.invoice.router import router as invoice_router
from fastapi import APIRouter

router = APIRouter()

router.include_router(user_router)
router.include_router(invoice_router)