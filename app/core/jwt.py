from jose import jwt
from datetime import datetime, timedelta, timezone

SECRET_KEY = "bc2bfae2a29e6c530388f92d62763bdc7c75f2450b1be4de502351d1accbf931"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
