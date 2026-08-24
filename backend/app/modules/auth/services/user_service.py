from app.modules.auth.repositories.user_repository import UserRepository
from app.modules.auth.schemas.user import UserCreate
from app.modules.auth.models.user import User
from app.modules.auth.exceptions.auth_exceptions import UserAlreadyExistException, InvalidCredentialsException
from app.core.security import hash_password, verify_password, create_token
from app.modules.auth.schemas.login import UserLogin, LoginResponse

class UserService:

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository                                                                                          

    async def create_user(self, user: UserCreate):
        user_exist = await self.user_repository.get_user_by_email(user.email)

        if user_exist:
            raise UserAlreadyExistException()
        password_hash = hash_password(user.password)

        new_user = User(
            first_name = user.first_name,
            last_name = user.last_name,
            email = user.email,
            password_hash = password_hash,
            phone_number = user.phone_number,) 
        
        return await self.user_repository.create_user(new_user)

    async def user_login(self, user_data: UserLogin):
        user = await self.user_repository.get_user_by_email(user_data.email)

        if not user:
            raise InvalidCredentialsException
        user_password = verify_password(user_data.password, user.password_hash)
        
        if not user_password:
            raise InvalidCredentialsException
        token = create_token(user)

        return LoginResponse(
            access_token=token,
            token_type="Bearer")


