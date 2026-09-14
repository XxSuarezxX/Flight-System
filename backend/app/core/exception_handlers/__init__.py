from .location_handlers import (
    country_already_exist_handler,
    iso_code_already_exist_handler,
    country_not_found_handler,
    city_already_exist_handler,
    city_not_found_handler,
    airport_not_found_handler,
    iata_code_already_exist_handler,
    icao_code_already_exist_handler,
)

from .flight_handlers import (
    origin_airport_not_found_handler,
    flight_not_found_handler,
    destination_airport_not_found_handler,
    same_airport_handler,
    invalid_time_handler,
)

from app.modules.location.exceptions.location_exceptions import (
    CountryAlreadyExistException,
    IsoCodeAlreadyExistException,
    CountryNotFoundException,
    CityAlreadyExistException,
    CityNotFoundException,
    AirportNotFoundException,
    IataCodeAlreadyExistException,
    IcaoCodeAlreadyExistException,
)

from app.modules.flight.exceptions.flight_exception import (
    OriginAirportNotFoundException,
    FlightNotFoundException,
    DestinationAirportNotFoundException,
    SameAirportException,
    InvalidFlightTimeException,
)


def register_exception_handlers(app):

    app.add_exception_handler(
        CountryAlreadyExistException,
        country_already_exist_handler
    )

    app.add_exception_handler(
        IsoCodeAlreadyExistException,
        iso_code_already_exist_handler
    )

    app.add_exception_handler(
        CountryNotFoundException,
        country_not_found_handler
    )

    app.add_exception_handler(
        CityAlreadyExistException,
        city_already_exist_handler
    )

    app.add_exception_handler(
        CityNotFoundException,
        city_not_found_handler
    )

    app.add_exception_handler(
        AirportNotFoundException,
        airport_not_found_handler
    )

    app.add_exception_handler(
        IataCodeAlreadyExistException,
        iata_code_already_exist_handler
    )

    app.add_exception_handler(
        IcaoCodeAlreadyExistException,
        icao_code_already_exist_handler
    )

    app.add_exception_handler(
        OriginAirportNotFoundException,
        origin_airport_not_found_handler
    )

    app.add_exception_handler(
        FlightNotFoundException,
        flight_not_found_handler
    )

    app.add_exception_handler(
        DestinationAirportNotFoundException,
        destination_airport_not_found_handler
    )

    app.add_exception_handler(
        SameAirportException,
        same_airport_handler
    )

    app.add_exception_handler(
        InvalidFlightTimeException,
        invalid_time_handler
    )