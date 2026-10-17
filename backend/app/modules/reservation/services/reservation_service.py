from app.modules.reservation.schemas.reservation import ReservationRequest, PassengerRequest, ReservationDetailsResponse
from app.modules.reservation.repositories.reservation_repository import ReservationRepository
from app.modules.reservation.repositories.passenger_repository import PassengerRepository
from app.modules.flight.repositories.flight_repository import FlightRepository
from app.modules.reservation.models.reservation import Reservation
from app.modules.reservation.models.passenger import Passenger
from app.modules.reservation.enums.reservation_status import ReservationStatus
from uuid import UUID
from app.modules.flight.exceptions.flight_exception import FlightNotFoundException
from app.modules.reservation.exceptions.reservation_exception import (ReservationNotFoundException, ReservationOwnershipException,
                                                                      ReservationCancellationNotAllowedException)

from app.modules.auth.exceptions.auth_exceptions import UnauthorizedException

class ReservationService:

    def __init__(self, reservation_repository: ReservationRepository, flight_repository: FlightRepository, 
                 passenger_repository: PassengerRepository):
        self.reservation_repository = reservation_repository
        self.flight_repository = flight_repository
        self.passenger_repository = passenger_repository

    async def create_reservation(self, reservation: ReservationRequest, user_id: UUID):
        try:
            existing_flight = await self.flight_repository.get_flight_by_id(reservation.flight_id)
            if not existing_flight:
                raise FlightNotFoundException()

            total_price = existing_flight.price * len(reservation.passengers)
            new_reservation = Reservation(user_id=user_id,flight_id=reservation.flight_id,
                                          price=total_price, status=ReservationStatus.PENDING)
            saved_reservation = await self.reservation_repository.create_reservation(new_reservation)

            for passenger in reservation.passengers:
                new_passenger = Passenger(
                    reservation_id=saved_reservation.id,
                    first_name=passenger.first_name, last_name=passenger.last_name,
                    identification=passenger.identification)
                await self.passenger_repository.create_passenger(new_passenger)

            await self.reservation_repository.commit()
            return saved_reservation

        except Exception:
            await self.reservation_repository.rollback()
            raise

    async def get_user_reservations(self, user_id: UUID):
        return await self.reservation_repository.get_reservation_by_user(user_id)
    
    async def get_reservation_details(self, reservation_id: UUID, user_id: UUID):
        existing_reservation = await self.reservation_repository.get_reservation_by_id(reservation_id)

        if not existing_reservation:
            raise  ReservationNotFoundException()
        if existing_reservation.user_id != user_id:
            raise  UnauthorizedException()
        reservation_passengers = (await self.passenger_repository.get_passenger_by_reservation_id(existing_reservation.id))
        reservation_flight = await self.flight_repository.get_flight_by_id(existing_reservation.flight_id)

        return ReservationDetailsResponse(id=existing_reservation.id, user_id=existing_reservation.user_id,
            flight_id=existing_reservation.flight_id, price=existing_reservation.price,
            status=existing_reservation.status, created_at=existing_reservation.created_at,
            updated_at=existing_reservation.updated_at, passengers=reservation_passengers,flight=reservation_flight)

    
    async def cancel_reservation(self, reservation_id: UUID, user_id: UUID):
        existing_reservation = await self.reservation_repository.get_reservation_by_id(reservation_id)

        if not existing_reservation:
            raise  ReservationNotFoundException()

        if existing_reservation.user_id != user_id:
            raise  ReservationOwnershipException()

        if existing_reservation.status != ReservationStatus.PENDING:
            raise ReservationCancellationNotAllowedException()
        existing_reservation.status = ReservationStatus.CANCELLED
        return await self.reservation_repository.update_reservation(existing_reservation)