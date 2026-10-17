from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.modules.reservation.repositories.passenger_repository import PassengerRepository
from app.modules.reservation.repositories.reservation_repository import ReservationRepository
from app.modules.flight.repositories.flight_repository import FlightRepository
from app.modules.reservation.services.reservation_service import ReservationService
from app.modules.auth.dependencies.auth_dependencies import get_current_user
from app.modules.reservation.schemas.reservation import ReservationRequest
from uuid import UUID

router = APIRouter(prefix="/reservations", tags=["reservations"])

def get_reservation_service(db: AsyncSession = Depends(get_db)) -> ReservationService:
    reservation_repository = ReservationRepository(db)
    flight_repository = FlightRepository(db)
    passenger_repository = PassengerRepository(db)
    
    return ReservationService(reservation_repository, flight_repository, passenger_repository)

@router.post("/create_reservation")
async def create_reservation(reservation: ReservationRequest, current_user = Depends(get_current_user), service: ReservationService = Depends(get_reservation_service)):
    return await service.create_reservation(reservation, current_user.id)

@router.get("/get_user_reservations")
async def get_user_reservations(current_user = Depends(get_current_user), service: ReservationService = Depends(get_reservation_service)):
    return await service.get_user_reservations(current_user.id)

@router.get("/get_reservation_details")
async def get_reservation_details(reservation_id: UUID, current_user = Depends(get_current_user), service: ReservationService = Depends(get_reservation_service)):
    return await service.get_reservation_details(reservation_id, current_user.id)

@router.post("/cancel_reservation")
async def cancel_reservation(reservation_id: UUID, current_user = Depends(get_current_user), service: ReservationService = Depends(get_reservation_service)):
    return await service.cancel_reservation(reservation_id, current_user.id)