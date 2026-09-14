from fastapi import Request
from fastapi.responses import JSONResponse

from app.modules.flight.exceptions.flight_exception import (
    OriginAirportNotFoundException,
    FlightNotFoundException,
    DestinationAirportNotFoundException,
    SameAirportException,
    InvalidFlightTimeException)

async def origin_airport_not_found_handler(request: Request, exc: OriginAirportNotFoundException):
    return JSONResponse(
        status_code=404,
        content={"detail": "Origin airport not found"})

async def flight_not_found_handler(request: Request, exc: FlightNotFoundException):
    return JSONResponse(
        status_code=404,
        content={"detail": "Flight not found"})

async def destination_airport_not_found_handler(request: Request, exc: DestinationAirportNotFoundException):
    return JSONResponse(
        status_code=404,
        content={"detail": "Destination airport not found"})

async def same_airport_handler(request: Request, exc: SameAirportException):
    return JSONResponse(
        status_code=400,
        content={"detail": "Origin and destination airports cannot be the same"})

async def invalid_time_handler(request: Request, exc: InvalidFlightTimeException):
    return JSONResponse(
        status_code=400,
        content={"detail": "Arrival time must be after departure time"})