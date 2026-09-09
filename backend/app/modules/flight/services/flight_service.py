from app.modules.flight.repositories.flight_repository import FlightRepository
from app.modules.location.repositories.airport_repository import AirportRepository
from app.modules.flight.schemas.flight import FlightRequest
from app.modules.flight.models.flight import Flight
from uuid import UUID

class FlightService:

    def __init__(self, flight_repository: FlightRepository, airport_repository: AirportRepository):
        self.flight_repository = flight_repository
        self.airport_repository = airport_repository

    async def create_flight(self, flight: FlightRequest):
        if flight.origin_airport_id == flight.destination_airport_id:
            raise #Excepcion personalizada
        
        if flight.arrival_at <= flight.departure_at:
            raise #Excepcion personalizada

        origin_airport = await self.airport_repository.get_airport_by_id(flight.origin_airport_id)
        if not origin_airport:
            raise #Excepcion personalizada

        destination_airport = await self.airport_repository.get_airport_by_id(flight.destination_airport_id)
        if not destination_airport:
            raise #Excepcion personalizada
        
        new_flight = Flight(
            flight_number=flight.flight_number, origin_airport_id=flight.origin_airport_id,
            destination_airport_id=flight.destination_airport_id, departure_at=flight.departure_at,
            arrival_at=flight.arrival_at, price=flight.price)
        return await self.flight_repository.create_flight(new_flight)
    
    async def read_flights(self):
        return await self.flight_repository.read_flights()
    
    async def update_flight(self, flight_id: UUID, flight: FlightRequest):
        existing_flight = await self.flight_repository.get_flight_by_id(flight_id)
        if not existing_flight:
            raise #Excepcion personalizada

        origin_airport = await self.airport_repository.get_airport_by_id(flight.origin_airport_id)
        if not origin_airport:
            raise #Excepcion personalizada

        destination_airport = await self.airport_repository.get_airport_by_id(flight.destination_airport_id)
        if not destination_airport:
            raise #Excepcion personalizada 

        if flight.origin_airport_id == flight.destination_airport_id:
            raise

        if flight.arrival_at <= flight.departure_at:
            raise #Excepcion personalizada

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
            raise #Excepcion personalizada
        return await self.flight_repository.delete_flight(existing_flight)