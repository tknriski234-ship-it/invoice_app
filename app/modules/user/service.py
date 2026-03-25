from app.modules.user.models import User
from sqlalchemy.orm import Session

class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_user(self, name: str):
        user = User(name=name)
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
