from pydantic import BaseModel, ConfigDict

class UserRegister(BaseModel):
    name : str
    password : str

class UserUpdate(BaseModel):
    name : str
    password : str

class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id : int
    name : str
