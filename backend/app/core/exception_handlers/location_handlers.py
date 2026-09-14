from fastapi import Request
from fastapi.responses import JSONResponse

from app.modules.location.exceptions.location_exceptions import (
    CountryAlreadyExistException,
    IsoCodeAlreadyExistException,
    CountryNotFoundException,
    CityAlreadyExistException,
    CityNotFoundException,
    AirportNotFoundException,
    IataCodeAlreadyExistException,
    IcaoCodeAlreadyExistException,)


async def country_already_exist_handler(request: Request, exc: CountryAlreadyExistException):
    return JSONResponse(
        status_code=409,
        content={"detail": "Country already exists"})

async def iso_code_already_exist_handler(request: Request, exc: IsoCodeAlreadyExistException):
    return JSONResponse(
        status_code=409,
        content={"detail": "ISO code already exists"})

async def country_not_found_handler(request: Request, exc: CountryNotFoundException):
    return JSONResponse(
        status_code=404,
        content={"detail": "Country not found"})

async def city_already_exist_handler(request: Request, exc: CityAlreadyExistException):
    return JSONResponse(
        status_code=409,
        content={"detail": "City already exists in this country"})

async def city_not_found_handler(request: Request, exc: CityNotFoundException):
    return JSONResponse(
        status_code=404,
        content={"detail": "City not found"})

async def airport_not_found_handler(request: Request, exc: AirportNotFoundException):
    return JSONResponse(
        status_code=404,
        content={"detail": "Airport not found"})

async def iata_code_already_exist_handler(request: Request, exc: IataCodeAlreadyExistException):
    return JSONResponse(
        status_code=409,
        content={"detail": "IATA code already exists"})

async def icao_code_already_exist_handler(request: Request, exc: IcaoCodeAlreadyExistException):
    return JSONResponse(
        status_code=409,
        content={"detail": "ICAO code already exists"})