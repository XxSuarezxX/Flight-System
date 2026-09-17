from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.modules.location.schemas.city import CityRequest, CityResponse
from app.modules.location.repositories.city_repository import CityRepository
from app.modules.location.repositories.country_repository import CountryRepository
from app.modules.location.repositories.airport_repository import AirportRepository
from app.modules.location.services.city_service import CityService
from app.modules.auth.dependencies.auth_dependencies import get_current_admin
from uuid import UUID

router = APIRouter(prefix="/cities", tags=["cities"])

def get_city_service(db: AsyncSession = Depends(get_db)) -> CityService:
    city_repository = CityRepository(db)
    country_repository = CountryRepository(db)
    airport_repository = AirportRepository(db)

    return CityService(city_repository, country_repository,airport_repository)

@router.post("/create_city", response_model=CityResponse, dependencies=[Depends(get_current_admin)])
async def create_city(city: CityRequest, service: CityService = Depends(get_city_service)):
    return await service.create_city(city)

@router.get("/read_city")
async def read_cities(service: CityService = Depends(get_city_service)):
    return await service.read_city()

@router.put("/update_city/{city_id}", response_model=CityResponse, dependencies=[Depends(get_current_admin)])
async def update_city(city_id: UUID, city: CityRequest, service: CityService = Depends(get_city_service)):
    return await service.update_city(city_id, city)

@router.delete("/delete_city/{city_id}", dependencies=[Depends(get_current_admin)])
async def delete_city(city_id: UUID, service: CityService = Depends(get_city_service)):
    return await service.delete_city(city_id)