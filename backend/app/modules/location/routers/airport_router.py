from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.modules.location.schemas.airport import AirportRequest, AirportResponse
from app.modules.location.repositories.airport_repository import AirportRepository
from app.modules.location.repositories.city_repository import CityRepository
from app.modules.location.services.airport_service import AirportService
from uuid import UUID

router = APIRouter(prefix="/airports", tags=["airports"])

def get_airport_service(db: AsyncSession = Depends(get_db)) -> AirportService:
    airport_repository = AirportRepository(db)
    city_repository = CityRepository(db)

    return AirportService(airport_repository, city_repository)

@router.post("/create_airport", response_model=AirportResponse)
async def create_airport(airport: AirportRequest, service: AirportService = Depends(get_airport_service)):
    return await service.create_airport(airport)

@router.get("/read_airport")
async def read_airport(service: AirportService = Depends(get_airport_service)):
    return await service.read_airports()

@router.put("/update_airport/({airport_id})" , response_model=AirportResponse)
async def update_airport(airport_id: UUID, airport: AirportRequest, service: AirportService = Depends(get_airport_service)):
    return await service.update_airport(airport_id, airport)

@router.delete("/delete_city")
async def delete_airport(airport_id: UUID, service: AirportService = Depends(get_airport_service)):
    return await service.delete_airport(airport_id)