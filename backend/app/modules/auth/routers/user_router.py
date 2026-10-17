from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.auth.schemas.user import UserRequest, UserResponse, UserRegisterRequest
from app.modules.auth.schemas.login import UserLogin, LoginResponse
from app.database.database import get_db
from app.modules.auth.services.user_service import UserService
from app.modules.auth.repositories.user_repository import UserRepository
from app.modules.auth.dependencies.auth_dependencies import get_current_user, get_current_admin
from app.modules.auth.models.user import User
from uuid import UUID

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_users_service(db: AsyncSession = Depends(get_db)) -> UserService:
    user_repository = UserRepository(db)
    return UserService(user_repository)

@router.post("/register", response_model=UserResponse, status_code=201)
async def register_user(
    user: UserRegisterRequest,
    service: UserService = Depends(get_users_service),
):
    return await service.register_user(user)

@router.post("/create_user", response_model=UserResponse)
async def create_user(user: UserRequest, service: UserService = Depends(get_users_service)):
    return await service.create_user(user)

@router.get("/read_users", response_model=list[UserResponse])
async def read_users(service: UserService = Depends(get_users_service)):
    return await service.read_users()

@router.put("/update_user/{user_id}", response_model=UserResponse, dependencies=[Depends(get_current_admin)])
async def update_user(user_id: UUID, user: UserRequest, service: UserService = Depends(get_users_service)):
    return await service.update_users(user_id, user)

@router.delete("/delete_user/{user_id}", dependencies=[Depends(get_current_admin)])
async def delete_user(user_id: UUID, service: UserService = Depends(get_users_service)):
    return await service.delete_user(user_id)
                      
@router.post("/login", response_model=LoginResponse)
async def user_login(user: UserLogin, service: UserService = Depends(get_users_service)):
    return await service.user_login(user)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user