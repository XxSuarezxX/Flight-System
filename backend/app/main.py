from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.modules.auth.routers import user_router
from app.modules.location.routers import country_router
from app.modules.location.routers import city_router
from app.modules.location.routers import airport_router
from app.modules.location.models import country
from app.modules.location.models import city
from app.modules.location.models import airport

from app.core.exception_handlers import (
    country_already_exist_handler,
    iso_code_already_exist_handler,
    country_not_found_handler,
    city_already_exist_handler,
    city_not_found_handler,
    airport_not_found_handler,
    iata_code_already_exist_handler,
    icao_code_already_exist_handler,)

from app.modules.location.exceptions.location_exceptions import (
    CountryAlreadyExistException,
    IsoCodeAlreadyExistException,
    CountryNotFoundException,
    CityAlreadyExistException,
    CityNotFoundException,
    AirportNotFoundException,
    IataCodeAlreadyExistException,
    IcaoCodeAlreadyExistException,)

app = FastAPI(title="Flight System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)

app.add_exception_handler(CountryAlreadyExistException, country_already_exist_handler)
app.add_exception_handler(IsoCodeAlreadyExistException, iso_code_already_exist_handler)
app.add_exception_handler(CountryNotFoundException, country_not_found_handler)
app.add_exception_handler(CityAlreadyExistException, city_already_exist_handler)
app.add_exception_handler(CityNotFoundException, city_not_found_handler)
app.add_exception_handler(AirportNotFoundException, airport_not_found_handler)
app.add_exception_handler(IataCodeAlreadyExistException, iata_code_already_exist_handler)
app.add_exception_handler(IcaoCodeAlreadyExistException, icao_code_already_exist_handler)

app.include_router(user_router.router)
app.include_router(country_router.router)
app.include_router(city_router.router)
app.include_router(airport_router.router)