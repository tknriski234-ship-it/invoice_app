from pydantic import BaseModel, ConfigDict

class UserRegister(BaseModel):
    name : str

class UserUpdate(BaseModel):
    name : str

class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id : int
    name : str
