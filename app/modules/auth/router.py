from fastapi import APIRouter, Depends, HTTPException
from app.modules.auth import schema
from sqlalchemy.orm import Session

from app.core.jwt import create_access_token
from app.db.session import get_db
from app.modules.auth.service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=schema.Token)
def login(
    data: schema.UserLogin,
    db: Session = Depends(get_db)
):
    service = AuthService(db)
    try:
        user = service.login(data.name, data.password)
        token = create_access_token({"sub": user.name})
        return {"access_token": token, "token_type": "bearer"}
    except ValueError as e :
        raise HTTPException(status_code=400 , detail=str(e))