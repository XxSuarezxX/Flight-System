from app.modules.location.repositories.country_repository import CountryRepository
from app.modules.location.schemas.country import CountryRequest
from app.modules.location.models.country import Country
from app.modules.location.exceptions.location_exceptions import CountryAlreadyExistException, IsoCodeAlreadyExistException, CountryNotFoundException
from uuid import UUID

class CountryService:

    def __init__(self, country_repository: CountryRepository):
        self.country_repository = country_repository

    async def create_country(self, country: CountryRequest):
        existing_country = await self.country_repository.get_country_by_name(country.name)

        if existing_country:
            raise  CountryAlreadyExistException
        existing_iso_country = await self.country_repository.get_country_by_iso_code(country.iso_code)

        if existing_iso_country:
            raise  IsoCodeAlreadyExistException

        new_country = Country(
            name=country.name,
            iso_code=country.iso_code,) 
        return await self.country_repository.create_country(new_country)

    async def read_country(self):
        return await self.country_repository.read_country()
    
    async def update_country(self, country_id: UUID, country: CountryRequest):
        existing_country = await self.country_repository.get_country_by_id(country_id)

        if not existing_country:
            raise CountryNotFoundException
        
        existing_name_country = await self.country_repository.get_country_by_name(country.name)
        if (existing_name_country and existing_name_country.id != existing_country.id):
            raise CountryAlreadyExistException
        
        existing_iso_country = await self.country_repository.get_country_by_iso_code(country.iso_code)
        if (existing_iso_country and existing_iso_country.id != existing_country.id):
            raise IsoCodeAlreadyExistException

        existing_country.name = country.name
        existing_country.iso_code = country.iso_code
        return await self.country_repository.update_country(existing_country)
    
    async def delete_country(self, country_id):
        existing_country = await self.country_repository.get_country_by_id(country_id)

        if not existing_country:
            raise CountryNotFoundException
        return await self.country_repository.delete_country(existing_country)