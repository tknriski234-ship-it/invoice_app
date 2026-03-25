from pydantic import BaseModel, ConfigDict

class UserRegister(BaseModel):
    name : str
    password : str

class UserUpdate(BaseModel):
    name : str
    password : str
class UserLogin(BaseModel):
    name : str
    password : str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id : int
    name : str
