from sqlalchemy import String , Integer , Column
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer , primary_key=True , index=True)
    name = Column(String , nullable=False)
    password = Column(String ,nullable=False)