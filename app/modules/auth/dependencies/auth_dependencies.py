from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import decode_token
from app.database.database import get_db
from app.modules.auth.repositories.user_repository import UserRepository
from app.modules.auth.schemas.token import TokenData

security = HTTPBearer()

async def get_current_user(credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],db: AsyncSession = Depends(get_db),):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},)

    try:
        token = credentials.credentials
        payload = decode_token(token)

        sub = payload.get("sub")
        name = payload.get("name")
        role = payload.get("role")

        if sub is None:
            raise credentials_exception

        token_data = TokenData(
            sub=sub,
            name=name,
            role=role,)
    except JWTError:
        raise credentials_exception

    repository = UserRepository(db)
    user = await repository.get_user_by_id(token_data.sub)

    if user is None:
        raise credentials_exception
    return user