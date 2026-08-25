from app.modules.location.models.airport import Airport
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

class AirportRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_airport(self, airport: Airport) -> Airport:
        self.db.add(airport)
        await self.db.commit()
        await self.db.refresh(airport)
        return airport
    
    async def read_airports(self):
        result = await self.db.execute(select(Airport))
        airports = result.scalars().all()
        return airports
    
    async def update_airport(self, airport: Airport) -> Airport:
        await self.db.commit()
        await self.db.refresh(airport)
        return airport
    
    async def delete_airport(self, airport: Airport) -> Airport:
        await self.db.delete(airport)
        await self.db.commit()

    async def get_airport_by_id(self, airport: UUID) -> Airport | None:
        query = select(Airport).where(Airport.id == airport)
        result = await self.db.scalar(query)
        return result

    async def get_airport_by_iata_code(self, airport: str) -> Airport | None:
        query = select(Airport).where(Airport.iata_code == airport)
        result = await self.db.scalar(query)
        return result
    
    async def get_airport_by_icao_code(self, airport: str) -> Airport | None:
        query = select(Airport).where(Airport.icao_code == airport)
        result = await self.db.scalar(query)
        return result  

