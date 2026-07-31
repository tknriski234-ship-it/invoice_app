from fastapi import APIRouter , Depends , HTTPException ,Response 
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.user.schema import UserOut , UserCreate , UserLogin, LoginResponse , UserUpdate ,UserDelete , UserChangePassword
from app.modules.user.service import UserService
from app.core.exception import UserAlreadyExists , InvalidCredentials , UserNotActive
from app.core.dependencies import get_current_user
from app.modules.user.models import User
from app.core.config import settings
from app.core.rate_limiter import rate_limit_login
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(prefix="/users",tags=["User"])

ACCESS_TOKEN_COOKIE_NAME = "access_token"

def raise_login_error(error: InvalidCredentials | UserNotActive) -> None:
    if isinstance(error, InvalidCredentials):
        raise HTTPException(status_code=401, detail=error.message)

    raise HTTPException(status_code=403, detail=error.message)

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
        raise HTTPException(status_code=409 , detail=e.message)


@router.post("/login" , response_model=LoginResponse)
def login(
    data : UserLogin,
    response : Response,
    _ : None = Depends(rate_limit_login),
    db : Session = Depends(get_db)
):
    service = UserService(db)
    access_token_max_age = settings.access_token_expire_minute * 60

    try:
        login_data = service.authenticate_user(data)
        
        response.set_cookie(
            key=ACCESS_TOKEN_COOKIE_NAME,
            value=login_data.access_token,
            httponly=True,
            secure=False, # ganti True jika pake https
            samesite="lax",
            max_age=access_token_max_age
        )

        return login_data
    except (InvalidCredentials, UserNotActive) as e:
        raise_login_error(e)


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

    try:
        service.delete_me(current_user , data)
    except InvalidCredentials as e:
        raise HTTPException(status_code=400, detail=e.message)

    return {"message" : "User berhasil di hapus"}


@router.patch("/me/password")
def change_password(
    data : UserChangePassword,
    current_user : User = Depends(get_current_user),
    db : Session = Depends(get_db)
):
    service = UserService(db)

    try:
        service.change_password(current_user , data)
    except InvalidCredentials as e:
        raise HTTPException(status_code=400, detail=e.message)

    return {"message" : "Password berhasil di ubah"}

@router.post("/logout")
def logout(response : Response):
    response.delete_cookie(ACCESS_TOKEN_COOKIE_NAME)
    return {"message" : "Logout berhasil"}

@router.post("/token", response_model=LoginResponse)
def login_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    _: None = Depends(rate_limit_login),
    db: Session = Depends(get_db),
):
    service = UserService(db)

    data = UserLogin(
        email=form_data.username,
        password=form_data.password,
    )

    try:
        return service.authenticate_user(data)
    except (InvalidCredentials, UserNotActive) as e:
        raise_login_error(e)
