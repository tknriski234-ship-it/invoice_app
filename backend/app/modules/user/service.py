from sqlalchemy.orm import Session
from sqlalchemy import select
from app.modules.user.models import User
from app.modules.user.schema import UserCreate , UserLogin, TokenResponse, UserOut , UserUpdate
from app.core.security import hash_password , verify_password
from app.core.exception import UserAlreadyExists , InvalidCredentials , UserNotActive
from datetime import datetime , timezone
from app.core.token import create_access_token

class UserService:
    def __init__(self, db : Session) -> None:
        self.db = db

    def _get_user_by_email(self ,email : str) -> User | None:
        stmt = select(User).where(User.email == email)
        return self.db.execute(stmt).scalar_one_or_none()

    def create_user(self , data : UserCreate):
        existing_user = self._get_user_by_email(data.email)
        
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

    def authenticate_user(self, data : UserLogin) -> TokenResponse:
        user = self._get_user_by_email(data.email)
        if not user:
            raise InvalidCredentials("Email atau password salah")

        valid, needs_rehash = verify_password(data.password, user.password_hash)
        
        if not valid:
            raise InvalidCredentials("Email atau password salah")
        
        if not user.is_active:
            raise UserNotActive("User tidak aktif")

        try:
            if needs_rehash:
                user.password_hash = hash_password(data.password)
            user.last_login = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(user)
            
            token = create_access_token({
            "sub": str(user.public_id)
            })

            return TokenResponse(
                access_token=token,
                token_type="bearer",
                user=UserOut.model_validate(user)
            )
        except Exception:
            self.db.rollback()
            raise
    def update_name(self,current_user : User ,data : UserUpdate)-> User:
        current_user.full_name = data.full_name

        try:
            self.db.commit()
            self.db.refresh(current_user)
            return current_user
        except:
            self.db.rollback()
            raise

