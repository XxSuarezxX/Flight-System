class FlightNotFoundException(Exception):
    pass

class OriginAirportNotFoundException(Exception):
    pass

class DestinationAirportNotFoundException(Exception):
    pass

class SameAirportException(Exception):
    pass

class InvalidFlightTimeException(Exception):
    pass

class NotAvailableFlightsException(Exception):
    pass