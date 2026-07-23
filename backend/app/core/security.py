from passlib.context import CryptContext
from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime, timedelta

from app.core.config import settings
from app.modules.auth.models.user import User
from app.modules.auth.exceptions.auth_exceptions import UnauthorizedException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_token(user: User) -> str:
    payload =  {
        "sub": str(user.id),
        "name": user.first_name,
        "role": str(user.role),
        "exp": datetime.utcnow() + timedelta(seconds=settings.SESSION_TIMEOUT)}
    token_jwt = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return token_jwt

def decode_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise UnauthorizedException
    except JWTError:
        raise UnauthorizedException
