from fastapi import APIRouter, Depends , HTTPException
from app.db.session import get_db
from ..user import schema
from ..user.service import UserService
from sqlalchemy.orm import Session

router = APIRouter(prefix="/user" , tags=["user"])

@router.post("/create", response_model=schema.UserRead)
def create_user(
    data: schema.UserRegister ,
    db: Session = Depends(get_db)
):
    service = UserService(db)
    user = service.create_user(data.name , data.password)
    return user

@router.get("/get/{user_id}")
def get_user(
    user_id: int,
    db : Session = Depends(get_db)
):
    service = UserService(db)
    try:
        return service.get_user(user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{user_id}" , response_model=schema.UserRead)
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
    
@router.delete("/{user_id}")
def delete_user(
    user_id : int,
    db : Session = Depends(get_db)
):
    service = UserService(db) 
    try:
        return service.delete_user(user_id)
    except ValueError as e :
        raise HTTPException(status_code=404,detail=str(e))
