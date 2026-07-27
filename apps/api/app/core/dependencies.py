from fastapi import Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.user.models import User
from app.db.session import get_db
from app.core.token import decode_access_token


def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Belum login"
        )

    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Token tidak valid"
        )

    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Token tidak valid"
        )

    stmt = select(User).where(User.public_id == user_id)
    user = db.execute(stmt).scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User tidak ditemukan"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,detail="User tidak aktif"
        )

    return user