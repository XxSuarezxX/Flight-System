from app.modules.flight.repositories.flight_repository import FlightRepository
from app.modules.location.repositories.airport_repository import AirportRepository
from app.modules.flight.schemas.flight import FlightRequest, SearchFlights
from app.modules.flight.models.flight import Flight
from app.modules.flight.enums.flight_status import FlightStatus
from datetime import date
from app.modules.flight.exceptions.flight_exception import (FlightNotFoundException,
                                                            OriginAirportNotFoundException,
                                                            DestinationAirportNotFoundException,
                                                            SameAirportException,
                                                            InvalidFlightTimeException,
                                                            NotAvailableFlightsException)
from uuid import UUID

class FlightService:

    def __init__(self, flight_repository: FlightRepository, airport_repository: AirportRepository):
        self.flight_repository = flight_repository
        self.airport_repository = airport_repository

    async def create_flight(self, flight: FlightRequest):
        if flight.origin_airport_id == flight.destination_airport_id:
            raise SameAirportException()
        
        if flight.arrival_at <= flight.departure_at:
            raise InvalidFlightTimeException()

        origin_airport = await self.airport_repository.get_airport_by_id(flight.origin_airport_id)
        if not origin_airport:
            raise OriginAirportNotFoundException()

        destination_airport = await self.airport_repository.get_airport_by_id(flight.destination_airport_id)
        if not destination_airport:
            raise DestinationAirportNotFoundException()
        
        new_flight = Flight(
            flight_number=flight.flight_number, origin_airport_id=flight.origin_airport_id,
            destination_airport_id=flight.destination_airport_id, departure_at=flight.departure_at,
            arrival_at=flight.arrival_at, price=flight.price,
            status = FlightStatus.SCHEDULED)
        
        return await self.flight_repository.create_flight(new_flight)
    
    async def read_flights(self):
        return await self.flight_repository.read_flights()
    
    async def update_flight(self, flight_id: UUID, flight: FlightRequest):
        existing_flight = await self.flight_repository.get_flight_by_id(flight_id)
        if not existing_flight:
            raise FlightNotFoundException()

        origin_airport = await self.airport_repository.get_airport_by_id(flight.origin_airport_id)
        if not origin_airport:
            raise OriginAirportNotFoundException()

        destination_airport = await self.airport_repository.get_airport_by_id(flight.destination_airport_id)
        if not destination_airport:
            raise DestinationAirportNotFoundException()

        if flight.origin_airport_id == flight.destination_airport_id:
            raise SameAirportException()

        if flight.arrival_at <= flight.departure_at:
            raise InvalidFlightTimeException()

        existing_flight.flight_number = flight.flight_number
        existing_flight.origin_airport_id = flight.origin_airport_id
        existing_flight.destination_airport_id = flight.destination_airport_id
        existing_flight.departure_at = flight.departure_at
        existing_flight.arrival_at = flight.arrival_at
        existing_flight.price = flight.price

        return await self.flight_repository.update_flight(existing_flight)
    
    async def delete_flight(self, flight_id: UUID):
        existing_flight = await self.flight_repository.get_flight_by_id(flight_id)
        if not existing_flight:
            raise FlightNotFoundException()
        return await self.flight_repository.delete_flight(existing_flight)
    
    async def search_available_flights(self, flight: SearchFlights):
        existing_flights = await self.flight_repository.search_available_flights(flight)
        if not existing_flights:
            raise NotAvailableFlightsException()
        return existing_flights