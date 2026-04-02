from jose import jwt ,JWTError
from datetime import datetime , timedelta , timezone
from app.core.config import settings
SECRET_KEY = settings.secret_token
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data : dict) -> str:
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode , SECRET_KEY ,algorithm=ALGORITHM)

def decode_access_token(token : str) -> dict | None:
    try:
        payload = jwt.decode(token, SECRET_KEY , algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
