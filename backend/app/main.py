from fastapi import FastAPI , Depends , HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db
from app.modules.user.schema import UserOut , UserCreate , UserLogin
from app.modules.user.service import UserService
from app.core.exception import UserAlreadyExists , InvalidCredentials , UserNotActive
app = FastAPI()

@app.get("/get_db")
def get_cek_db(db : Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok"}
    except:
        return {"status" : "failed"}
    
@app.post("/create/user" ,response_model= UserOut)
def create_user(data : UserCreate, db : Session = Depends(get_db)):
    service = UserService(db)

    try:
        user = service.create_user(data)
        return user
    except UserAlreadyExists as e:
        raise HTTPException(status_code=400 , detail=e.message)
    
@app.post("/login" , response_model=UserOut)
def login(data : UserLogin , db : Session = Depends(get_db)):
    service = UserService(db)

    try:
        user = service.authenticate_user(data)
        return user
    except InvalidCredentials as e:
        raise HTTPException(status_code=401 , detail= e.message)
    except UserNotActive as e:
        raise HTTPException(status_code=403 , detail= e.message)

