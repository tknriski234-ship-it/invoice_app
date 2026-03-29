from fastapi import APIRouter
from sqlalchemy.orm import Session
from app.modules.user.models import User
from pydantic import BaseModel
router = APIRouter(prefix="/users", tags=["users"])

class UserService:
    def __init__(self,db : Session) -> None:
        self.db = db
    
    def get_user(self,user_id : int):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("user tidak di temukan")
        return user
    def create_user(self,name : str,password : str):
        user = User(name=name,password=password)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

class UserCreate(BaseModel):
    name : str
    password : str


@router.get("/users/{user_id}")
def get_user(user_id : int, db : Session):
    service = UserService(db)
    return service.get_user(user_id)

@router.post("/create")
def create_user(user : UserCreate, db : Session):
    service = UserService(db)
    return service.create_user(name=user.name, password=user.password)