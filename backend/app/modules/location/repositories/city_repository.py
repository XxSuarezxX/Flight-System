from app.modules.location.models.city import City
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

class CityRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_city(self, city: City)-> City:
        self.db.add(city)
        await self.db.commit()
        await self.db.refresh(city)
        return city
    
    async def read_city(self):
        result = await self.db.execute(select(City))
        cities = result.scalars().all()
        return cities
    
    async def update_city(self, city:City) -> City:
        await self.db.commit()
        await self.db.refresh(city)
        return city
    
    async def delete_city(self, city:City)-> City:
        await self.db.delete(city)
        await self.db.commit()

    async def get_city_by_id(self, city_id: City) -> City | None:
        query = select(City).where(City.id == city_id)
        result = await self.db.scalar(query)
        return result
    
    async def get_city_by_name_and_country(self, name: str, country_id) -> City | None:
        query = select( City).where(City.name == name, City.country_id == country_id)
        result = await self.db.scalar(query)
        return result