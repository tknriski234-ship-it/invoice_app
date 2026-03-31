from .user.router import router as user_router
from .auth.router import router as auth_router
from fastapi import APIRouter

router = APIRouter()

router.include_router(user_router)
router.include_router(auth_router)