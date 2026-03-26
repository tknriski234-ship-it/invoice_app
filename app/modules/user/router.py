from fastapi import APIRouter, Depends , HTTPException
from app.db.session import get_db
from ..user import schema
from ..user.service import UserService
from sqlalchemy.orm import Session
from typing import List
from app.core.jwt import create_access_token

router = APIRouter()

@router.post("/create", response_model=schema.UserRead)
def create_user(
    data: schema.UserRegister,
    db: Session = Depends(get_db)
):
    service = UserService(db)
    user = service.create_user(data.name , data.password)
    return user

@router.post("/login", response_model=schema.Token)
def login(
    data: schema.UserLogin,
    db: Session = Depends(get_db)
):
    service = UserService(db)
    try:
        user = service.login(data.name, data.password)
        token = create_access_token({"sub": user.name})
        return {"access_token": token, "token_type": "bearer"}
    except ValueError as e :
        raise HTTPException(status_code=400 , detail=str(e))
    
@router.get("/users" , response_model=List[schema.UserRead])
def get_user(
    db : Session = Depends(get_db)
):
    service = UserService(db)
    return service.get_user()

@router.put("/users/{user_id}" , response_model=schema.UserRead)
def update_user(
    user_id: int ,
    data : schema.UserUpdate,
    db : Session = Depends(get_db)
):
    service = UserService(db)
    try:
        return service.update_user(user_id ,data.name)
    except ValueError as e:
        raise HTTPException(status_code=404,detail=str(e))
    
@router.delete("/users/{user_id}")
def delete_user(
    user_id : int,
    db : Session = Depends(get_db)
):
    service = UserService(db) 
    try:
        return service.delete_user(user_id)
    except ValueError as e :
        raise HTTPException(status_code=404,detail=str(e))
