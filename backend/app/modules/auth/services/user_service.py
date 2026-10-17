from app.modules.auth.repositories.user_repository import UserRepository
from app.modules.auth.schemas.user import UserRequest
from app.modules.auth.models.user import User
from app.modules.auth.exceptions.auth_exceptions import (UserAlreadyExistException, InvalidCredentialsException, 
                                                         UserNotFoundException, EmailAlreadyExistException)
from app.core.security import hash_password, verify_password, create_token
from app.modules.auth.schemas.login import UserLogin, LoginResponse
from uuid import UUID

from app.modules.auth.schemas.user import UserRegisterRequest
from app.modules.auth.enums.role import Roles

class UserService:

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository 

    async def register_user(self, user: UserRegisterRequest):
        user_data = UserRequest(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            password=user.password,
            phone_number=user.phone_number,
            role=Roles.CUSTOMER,
        )
        return await self.create_user(user_data)                                                                                         

    async def create_user(self, user: UserRequest):
        user_exist = await self.user_repository.get_user_by_email(user.email)

        if user_exist:
            raise UserAlreadyExistException()
        password_hash = hash_password(user.password)

        new_user = User(
            first_name = user.first_name,
            last_name = user.last_name,
            email = user.email,
            password_hash = password_hash,
            phone_number = user.phone_number,
            role = user.role,) 
        
        return await self.user_repository.create_user(new_user)
    
    async def read_users(self):
        return await self.user_repository.read_users()
    
    async def update_users(self, user_id: UUID, user: UserRequest):
        existing_user = await self.user_repository.get_user_by_id(user_id)
        if not existing_user:
            raise UserNotFoundException()
        
        existing_email = await self.user_repository.get_user_by_email(user.email)
        if existing_email and existing_email.id != existing_user.id:
            raise EmailAlreadyExistException()

        existing_user.first_name = user.first_name
        existing_user.last_name = user.last_name
        existing_user.email = user.email
        existing_user.password_hash = hash_password(user.password)
        existing_user.phone_number = user.phone_number
        existing_user.role = user.role

        return await self.user_repository.update_users(existing_user)
    
    async def delete_user(self, user_id: UUID):
        existing_user = await self.user_repository.get_user_by_id(user_id)
        if not existing_user:
            raise UserNotFoundException()
        return await self.user_repository.delete_user(existing_user)
    

    async def user_login(self, user_data: UserLogin):
        user = await self.user_repository.get_user_by_email(user_data.email)
        if not user:
            raise InvalidCredentialsException()
        
        user_password = verify_password(user_data.password, user.password_hash)
        if not user_password:
            raise InvalidCredentialsException()
        
        token = create_token(user)
        return LoginResponse(
            access_token=token,
            token_type="Bearer")