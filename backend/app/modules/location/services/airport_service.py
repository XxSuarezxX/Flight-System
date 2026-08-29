from app.modules.location.repositories.airport_repository import AirportRepository
from app.modules.location.schemas.airport import AirportRequest
from app.modules.location.repositories.city_repository import CityRepository
from app.modules.location.models.airport import Airport
from app.modules.location.exceptions.location_exceptions import (AirportNotFoundException, CityNotFoundException, 
                                                                 IataCodeAlreadyExistException,IcaoCodeAlreadyExistException,)
from uuid import UUID

class AirportService:

    def __init__(self,airport_repository: AirportRepository,city_repository: CityRepository):
        self.airport_repository = airport_repository
        self.city_repository = city_repository

    async def create_airport(self, airport: AirportRequest):
        existing_city = await self.city_repository.get_city_by_id(airport.city_id)
        if not existing_city:
            raise CityNotFoundException()

        existing_iata_code = await self.airport_repository.get_airport_by_iata_code(airport.iata_code)
        if existing_iata_code:
            raise IataCodeAlreadyExistException()

        existing_icao_code = await self.airport_repository.get_airport_by_icao_code(airport.icao_code)
        if existing_icao_code:
            raise IcaoCodeAlreadyExistException()

        new_airport = Airport(
            name=airport.name, iata_code=airport.iata_code,
            icao_code=airport.icao_code,city_id=airport.city_id)
        return await self.airport_repository.create_airport(new_airport)

    async def read_airports(self):
        return await self.airport_repository.read_airports()

    async def update_airport(self, airport_id: UUID,airport: AirportRequest):
        existing_airport = await self.airport_repository.get_airport_by_id(airport_id)
        if not existing_airport:
            raise AirportNotFoundException()

        existing_city = await self.city_repository.get_city_by_id(airport.city_id)
        if not existing_city:
            raise CityNotFoundException()

        existing_iata_code = await self.airport_repository.get_airport_by_iata_code(airport.iata_code)
        if existing_iata_code and existing_iata_code.id != existing_airport.id:
            raise IataCodeAlreadyExistException()

        existing_icao_code = await self.airport_repository.get_airport_by_icao_code(airport.icao_code)
        if existing_icao_code and existing_icao_code.id != existing_airport.id:
            raise IcaoCodeAlreadyExistException()

        existing_airport.name = airport.name
        existing_airport.iata_code = airport.iata_code
        existing_airport.icao_code = airport.icao_code
        existing_airport.city_id = airport.city_id

        return await self.airport_repository.update_airport(existing_airport)

    async def delete_airport(self, airport_id: UUID):
        existing_airport = await self.airport_repository.get_airport_by_id(airport_id)
        if not existing_airport:
            raise AirportNotFoundException()
        return await self.airport_repository.delete_airport(existing_airport)