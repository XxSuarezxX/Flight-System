from app.modules.location.repositories.city_repository import CityRepository
from app.modules.location.repositories.country_repository import CountryRepository
from app.modules.location.schemas.city import CityRequest
from app.modules.location.models.city import City
from app.modules.location.exceptions.location_exceptions import (CityAlreadyExistException, CountryNotFoundException, CityNotFoundException,)
from uuid import UUID

class CityService:

    def __init__(self,city_repository: CityRepository, country_repository: CountryRepository):
        self.city_repository = city_repository
        self.country_repository = country_repository

    async def create_city(self, city: CityRequest):
        existing_city = await self.city_repository.get_city_by_name_and_country(city.name,city.country_id)
        if existing_city:
            raise CityAlreadyExistException()

        existing_country = await self.country_repository.get_country_by_id(city.country_id)
        if not existing_country:
            raise CountryNotFoundException()
        
        new_city = City(name=city.name, country_id=city.country_id)
        return await self.city_repository.create_city(new_city)

    async def read_city(self):
        return await self.city_repository.read_city()

    async def update_city(self, city_id: UUID, city: CityRequest):
        existing_city = await self.city_repository.get_city_by_id(city_id)
        if not existing_city:
            raise CityNotFoundException()

        existing_name = await self.city_repository.get_city_by_name_and_country(city.name, existing_city.country_id)
        if existing_name and existing_name.id != existing_city.id:
            raise CityAlreadyExistException()
        existing_city.name = city.name

        return await self.city_repository.update_city(existing_city)

    async def delete_city(self, city_id: UUID):
        existing_city = await self.city_repository.get_city_by_id(city_id)
        if not existing_city:
            raise CityNotFoundException()

        return await self.city_repository.delete_city(existing_city)