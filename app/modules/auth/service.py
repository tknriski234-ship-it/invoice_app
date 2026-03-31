import sqlalchemy.orm
from app.core.security import verify_password
from app.modules.user.models import User

class AuthService:
    def __init__(self, db : sqlalchemy.orm.Session) -> None:
        self.db = db
    def login(self , name : str , password:str):
        user = self.db.query(User).filter(User.name == name).first()

        if not user:
            raise ValueError("name tidak ditemukkan")
        if not verify_password(password , user.password):
            raise ValueError("password salah")
        
        return user