from fastapi import FastAPI , Depends , HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db
from app.modules.user.schema import UserOut , UserCreate , UserLogin, TokenResponse
from app.modules.user.service import UserService
from app.core.exception import UserAlreadyExists , InvalidCredentials , UserNotActive
from app.core.dependencies import get_current_user
from app.modules.user.models import User

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
    
@app.post("/login" , response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db : Session = Depends(get_db)):
    service = UserService(db)

    try:
        data = UserLogin(
            email=form_data.username,
            password=form_data.password
)
        return service.authenticate_user(data)
    except InvalidCredentials as e:
        raise HTTPException(status_code=401 , detail= e.message)
    except UserNotActive as e:
        raise HTTPException(status_code=403 , detail= e.message)

@app.get("/me" , response_model=UserOut)
def  get_me(current_user : User = Depends(get_current_user)):
    return current_user


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # nanti ganti domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)