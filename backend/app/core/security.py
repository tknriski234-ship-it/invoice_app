from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError ,VerificationError

ph = PasswordHasher()

def hash_password(password : str) -> str:
    return ph.hash(password)

def verify_password(password: str, hashed: str) -> tuple[bool , bool]:
    try:
        valid = ph.verify(hashed, password)
        needs_rehash = ph.check_needs_rehash(hashed)
        return valid , needs_rehash
    except (VerifyMismatchError, VerificationError):
        return False , False