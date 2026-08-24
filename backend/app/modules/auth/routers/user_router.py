from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.auth.schemas.user import UserCreate, UserResponse
from app.modules.auth.schemas.login import UserLogin, LoginResponse
from app.database.database import get_db
from app.modules.auth.services.user_service import UserService
from app.modules.auth.repositories.user_repository import UserRepository
from app.modules.auth.dependencies.auth_dependencies import get_current_user
from app.modules.auth.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    repository = UserRepository(db)
    service = UserService(repository)

    new_user = await service.create_user(user)
    return new_user

@router.post("/login", response_model=LoginResponse)
async def user_login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    repository = UserRepository(db)
    service = UserService(repository)

    login = await service.user_login(user)
    return login

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user