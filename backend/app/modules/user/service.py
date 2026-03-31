from sqlalchemy.orm import Session
from sqlalchemy import select
from app.modules.user.models import User
from app.modules.user.schema import UserCreate
from app.core.security import hash_password , verify_password
from app.core.exception import UserAlreadyExists

class UserService:
    def __init__(self, db : Session) -> None:
        self.db = db
    
    def create_user(self , data : UserCreate):
        stmt = select(User).where(User.email == data.email)
        existing_user = self.db.execute(stmt).scalar_one_or_none()

        if existing_user :
            raise UserAlreadyExists("Email sudah di gunakan")

        user = User(
            full_name = data.full_name,
            email = data.email,
            password_hash= hash_password(data.password)
        )
        try:
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            return user
        except Exception:
            self.db.rollback()
            raise



