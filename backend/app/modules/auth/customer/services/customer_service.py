from app.modules.auth.repositories.user_repository import UserRepository
from app.modules.auth.customer.schemas.user import CustomerProfileUpdate
from app.modules.auth.exceptions.auth_exceptions import UserNotFoundException
from uuid import UUID

class CustomerService:

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def get_customer_profile(self, customer_id: UUID):
        customer_exist = await self.user_repository.get_user_by_id(customer_id)

        if not customer_exist:
            raise UserNotFoundException()
        return customer_exist
    
    async def update_customer_profile(self, customer_id: UUID, customer: CustomerProfileUpdate):
        customer_exist = await self.user_repository.get_user_by_id(customer_id)

        if not customer_exist:
            raise UserNotFoundException()

        customer_exist.first_name = customer.first_name
        customer_exist.last_name = customer.last_name
        customer_exist.phone_number = customer.phone_number
        return await self.user_repository.update_users(customer_exist)