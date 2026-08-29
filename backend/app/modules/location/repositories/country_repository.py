from app.modules.location.models.country import Country
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

class CountryRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_country(self, country: Country) -> Country:
        self.db.add(country)
        await self.db.commit()
        await self.db.refresh(country)
        return country
    
    async def read_country(self):
        result = await self.db.execute(select(Country))
        countries = result.scalars().all()
        return countries
    
    async def update_country(self, country: Country) -> Country:
        await self.db.commit()
        await self.db.refresh(country)
        return country
    
    async def delete_country(self, country: Country):
        await self.db.delete(country)
        await self.db.commit()

    async def get_country_by_id(self, country_id) -> Country | None:
        query = select(Country).where(Country.id == country_id)
        result = await self.db.scalar(query)
        return result

    async def get_country_by_name(self, country_name: str) -> Country | None:
        query = select(Country).where(Country.name == country_name)
        result = await self.db.scalar(query)
        return result
    
    async def get_country_by_iso_code(self, country_iso_code: str) -> Country | None:
        query = select(Country).where(Country.iso_code == country_iso_code)
        result = await self.db.scalar(query)
        return result