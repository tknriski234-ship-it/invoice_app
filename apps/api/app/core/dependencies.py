from fastapi import Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

from app.modules.user.models import User
from app.db.session import get_db
from app.core.token import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/users/token",
    auto_error=False,
)

AUTHENTICATE_HEADER = {"WWW-Authenticate": "Bearer"}

def get_current_user(
    request: Request,
    bearer_token : str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    token = request.cookies.get("access_token") or bearer_token

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Belum login",
            headers=AUTHENTICATE_HEADER,
        )

    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Token tidak valid",
            headers=AUTHENTICATE_HEADER,
        )

    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Token tidak valid",
            headers=AUTHENTICATE_HEADER,
        )

    stmt = select(User).where(User.public_id == user_id)
    user = db.execute(stmt).scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User tidak ditemukan",
            headers=AUTHENTICATE_HEADER,
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,detail="User tidak aktif"
        )

    return user
