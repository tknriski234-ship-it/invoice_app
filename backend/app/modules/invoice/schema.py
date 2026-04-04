from pydantic import BaseModel

class Status(BaseModel):
    draft : str
    