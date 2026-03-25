from app.modules.user.models import User
from sqlalchemy.orm import Session
from app.core.security import hash_password, verify_password

class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_user(self, name: str, password: str):
        user = User(name=name, password=hash_password(password))
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def get_user(self):
        return self.db.query(User).all()
    
    def update_user(self, user_id: int, name: str):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("user tidak di temukan")
        user.name = name
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete_user(self, user_id: int):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("user tidak di temukan")
        self.db.delete(user)
        self.db.commit()
        return user
    
    def login(self, name: str, password: str):
        user = self.db.query(User).filter(User.name == name).first()
        
        if not user:
            raise ValueError("nama tidak di temukan")
        
        if not verify_password(password, user.password):
            raise ValueError("password salah")
        
        return user
