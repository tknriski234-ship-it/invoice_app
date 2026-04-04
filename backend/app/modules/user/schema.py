from pydantic import BaseModel , ConfigDict ,EmailStr
import uuid
from datetime import datetime

class UserOut(BaseModel):
    id : int
    public_id : uuid.UUID
    full_name : str
    email : EmailStr
    is_verified : bool
    is_active : bool
    created_at : datetime
    last_login : datetime | None

    model_config = ConfigDict(
        from_attributes=True
        )

class UserCreate(BaseModel):
    full_name : str
    email : EmailStr
    password : str

class UserLogin(BaseModel):
    email : EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token : str
    token_type: str
    user : UserOut

class UserUpdate(BaseModel):
    full_name : str

class UserDelete(BaseModel):
    password : str