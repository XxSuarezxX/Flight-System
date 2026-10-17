from app.modules.reservation.models.reservation import Reservation
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

class ReservationRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_reservation(self, reservation: Reservation) -> Reservation:
        self.db.add(reservation)
        await self.db.flush()
        return reservation
    
    async def get_reservation_by_id(self, reservation_id: UUID) -> Reservation | None:
        query = select(Reservation).where(Reservation.id == reservation_id)
        result = await self.db.scalar(query)
        return result
    
    async def get_reservation_by_user(self, user_id: UUID) -> list[Reservation]:
        query = select(Reservation).where(Reservation.user_id == user_id)
        result = await self.db.scalars(query)
        return result.all()
    
    async def update_reservation(self, reservation: Reservation) -> Reservation | None:
        await self.db.commit()
        await self.db.refresh(reservation)
        return reservation
                
    async def commit(self):
        await self.db.commit()

    async def rollback(self):
        await self.db.rollback()