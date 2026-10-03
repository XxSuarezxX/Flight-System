from app.modules.flight.models.flight import Flight
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from uuid import UUID
from datetime import datetime, time, timedelta, date
from app.modules.flight.enums.flight_status import FlightStatus
from app.modules.flight.schemas.flight import SearchFlights

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
    
    async def search_flight_by_destination(self, destination_airport_id:UUID) -> Flight | None:
        query = select(Flight).where(Flight.destination_airport_id == destination_airport_id)
        result = await self.db.scalar(query)
        return result
    
    async def search_available_flights(self, flight: SearchFlights):  
        start_of_day = datetime.combine(flight.departure_at, time.min)
        start_of_next_day = start_of_day + timedelta(days=1)

        query = select(Flight).where(and_(
            Flight.origin_airport_id == flight.origin_airport_id,
            Flight.destination_airport_id == flight.destination_airport_id,
            Flight.departure_at >= start_of_day,
            Flight.departure_at < start_of_next_day,
            Flight.status == FlightStatus.SCHEDULED))
        result =  await self.db.scalars(query)
        return result.all()