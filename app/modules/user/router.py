from fastapi import APIRouter, Depends , HTTPException
from app.db.session import get_db
from ..user import schema
from ..user.service import UserService
from sqlalchemy.orm import Session
from typing import List

router = APIRouter()

@router.post("/users", response_model=schema.UserRead)
def create_user(data: schema.UserRegister, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.create_user(data.name)

@router.get("/users" , response_model=List[schema.UserRead])
def get_user(db : Session = Depends(get_db)) :
    service = UserService(db)
    return service.get_user()

@router.put("/users/{user_id}" , response_model=schema.UserRead)
def update_user(user_id: int ,data : schema.UserUpdate,db : Session = Depends(get_db)):
    service = UserService(db)
    try:
        return service.update_user(user_id ,data.name)
    except ValueError as e:
        raise HTTPException(status_code=404,detail=str(e))
    
@router.delete("/users/{user_id}")
def delete_user(user_id : int , db : Session = Depends(get_db)):
    service = UserService(db) 
    try:
        return service.delete_user(user_id)
    except ValueError as e :
        raise HTTPException(status_code=404,detail=str(e))