from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
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
    password : str = Field(min_length=8)

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls,value : str):
        value = value.strip()

        if not value:
            raise ValueError("nama tidak boleh kosong")
        return value
    
    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str):
        return value.strip().lower()


class UserLogin(BaseModel):
    email : EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token : str
    token_type: str
    user : UserOut

class UserUpdate(BaseModel):
    full_name : str

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls,value : str):
        value = value.strip()

        if not value:
            raise ValueError("nama tidak boleh kosong")
        return value

class UserDelete(BaseModel):
    password : str

class UserChangePassword(BaseModel):
    old_password : str
    new_password : str = Field(min_length=8)

