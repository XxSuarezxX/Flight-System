from app.modules.reservation.models.passenger import Passenger
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from sqlalchemy import select

class PassengerRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_passenger(self, passenger: Passenger) -> Passenger:
        self.db.add(passenger)
        return passenger
    
    async def get_passenger_by_reservation_id(self, reservation_id: UUID) -> list[Passenger]:
        query = select(Passenger).where(Passenger.reservation_id == reservation_id)
        result = await self.db.scalars(query)
        return result.all()