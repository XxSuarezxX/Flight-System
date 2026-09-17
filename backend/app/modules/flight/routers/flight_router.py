from fastapi import Depends, APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.modules.flight.schemas.flight import FlightRequest, FlightResponse
from app.modules.flight.repositories.flight_repository import FlightRepository
from app.modules.location.repositories.airport_repository import AirportRepository
from app.modules.flight.services.flight_service import FlightService
from app.modules.auth.dependencies.auth_dependencies import get_current_admin
from uuid import UUID

router = APIRouter(prefix="/flights", tags=["flights"])

def get_flight_service(db:AsyncSession = Depends(get_db)) -> FlightService:
    flight_repository = FlightRepository(db)
    airport_repository = AirportRepository(db)

    return FlightService(flight_repository, airport_repository)

@router.post("/create_flight", response_model=FlightResponse, dependencies=[Depends(get_current_admin)])
async def create_flight(flight: FlightRequest, service: FlightService = Depends(get_flight_service)):
    return await service.create_flight(flight)

@router.get("/read_flights")
async def read_flight(service: FlightService = Depends(get_flight_service)):
    return await service.read_flights()

@router.put("/update_flight/{flight_id}", response_model=FlightResponse, dependencies=[Depends(get_current_admin)])
async def update_flight(flight_id: UUID, flight: FlightRequest, service: FlightService = Depends(get_flight_service)):
    return await service.update_flight(flight_id, flight)

@router.delete("/delete_flight/{flight_id}", dependencies=[Depends(get_current_admin)])
async def delete_flight(flight_id: UUID, service: FlightService = Depends(get_flight_service)):
    return await service.delete_flight(flight_id)