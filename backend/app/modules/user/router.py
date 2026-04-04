from fastapi import APIRouter , Depends , HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.user.schema import UserOut , UserCreate , UserLogin, LoginResponse , UserUpdate ,UserDelete , UserChangePassword
from app.modules.user.service import UserService
from app.core.exception import UserAlreadyExists , InvalidCredentials , UserNotActive
from app.core.dependencies import get_current_user
from app.modules.user.models import User

router = APIRouter(prefix="/user",tags=["User"])

@router.post("/create" ,response_model= UserOut)
def create_user(
    data : UserCreate,
    db : Session = Depends(get_db)
):
    service = UserService(db)

    try:
        user = service.create_user(data)
        return user
    except UserAlreadyExists as e:
        raise HTTPException(status_code=400 , detail=e.message)


@router.post("/login" , response_model=LoginResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db : Session = Depends(get_db)
):
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


@router.get("/me", response_model=UserOut)
def get_me(
    current_user : User = Depends(get_current_user)
):
    return current_user


@router.patch("/me", response_model=UserOut)
def update_name(
    data: UserUpdate,
    db : Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    service = UserService(db)
    return service.update_profile(current_user , data)


@router.delete("/me")
def delete_me(
    data : UserDelete,
    db : Session =Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    service = UserService(db)
    service.delete_me(current_user , data)

    return {"message" : "User berhasil di hapus"}


@router.patch("/me/password")
def change_password(
    data : UserChangePassword,
    current_user : User = Depends(get_current_user),
    db : Session = Depends(get_db)
):
    service = UserService(db)
    service.change_password(current_user , data)

    return {"message" : "Password berhasil di ubah"}