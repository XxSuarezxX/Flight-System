from app.modules.flight.models.flight import Flight
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

class FlightRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_flight(self, flight: Flight) -> Flight:
        self.db.add(flight)
        await self.db.commit()
        await self.db.refresh(flight)
        return flight
    
    async def get_flight_by_id(self, flight_id: UUID) -> Flight | None:
        query = select(Flight).where(Flight.id == flight_id)
        result = await self.db.scalar(query)
        return result
    
    async def read_flights(self):
        result = await self.db.execute(select(Flight))
        flights = result.scalars().all()
        return flights
    
    async def update_flight(self, flight: Flight) -> Flight:
        await self.db.commit()
        await self.db.refresh(flight)
        return flight
    
    async def delete_flight(self, flight: Flight) -> Flight:
        await self.db.delete(flight)
        await self.db.commit()

    async def search_flight_by_origin(self, origin_airport_id: UUID) -> Flight | None:
        query = select(Flight).where(Flight.origin_airport_id == origin_airport_id)
        result = await self.db.scalar(query)
        return result