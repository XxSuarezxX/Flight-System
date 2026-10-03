from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.customer.schemas.user import CustomerProfile, CustomerProfileUpdate
from app.database.database import get_db
from app.modules.customer.services.customer_service import CustomerService
from app.modules.auth.repositories.user_repository import UserRepository
from app.modules.auth.dependencies.auth_dependencies import get_current_user
from app.modules.auth.models.user import User

router = APIRouter(prefix="/customer", tags=["customer"])

def get_customer_service(db: AsyncSession = Depends(get_db)) -> CustomerService:
    user_repository = UserRepository(db)
    return CustomerService(user_repository)

@router.get("/profile", response_model=CustomerProfile)
async def get_customer_profile(service: CustomerService = Depends(get_customer_service),
                               current_user: User = Depends(get_current_user)):
    return await service.get_customer_profile(current_user.id)

@router.put("/profile", response_model=CustomerProfile)
async def update_customer_profile(customer: CustomerProfileUpdate, service: CustomerService = Depends(get_customer_service),
                                  current_user: User = Depends(get_current_user)):
    return await service.update_customer_profile(current_user.id, customer)

