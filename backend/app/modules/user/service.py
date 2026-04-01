from sqlalchemy.orm import Session
from sqlalchemy import select
from app.modules.user.models import User
from app.modules.user.schema import UserCreate , UserLogin
from app.core.security import hash_password , verify_password
from app.core.exception import UserAlreadyExists , InvalidCredentials , UserNotActive
from  datetime import datetime , timezone

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
    
    def authenticate_user(self, data : UserLogin)-> User:
        stmt = select(User).where(User.email == data.email)
        user = self.db.execute(stmt).scalar_one_or_none()

        if not user:
            raise InvalidCredentials("Email atau password salah")
        
        if not verify_password(data.password , user.password_hash):
            raise InvalidCredentials("Email atau password salah")
        if not user.is_active:
            raise UserNotActive("User tidak aktif")
        
        try:
            user.last_login = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(user)
            return user
        except:
            self.db.rollback()
            raise
