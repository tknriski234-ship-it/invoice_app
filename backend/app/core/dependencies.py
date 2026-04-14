from fastapi import Depends , HTTPException
from fastapi.security import OAuth2PasswordBearer 
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.modules.user.models import User
from app.db.session import get_db
from app.core.token import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def get_current_user(
        token : str = Depends(oauth2_scheme),
        db : Session = Depends(get_db)
) -> User:
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401 , detail="Token tidak valid")
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401 , detail="Token tidak valid")
    
    stmt = select(User).where(User.public_id == user_id)
    user = db.execute(stmt).scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=401 , detail="User tidak di temukan")
    
    return user


