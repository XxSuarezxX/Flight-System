import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Search,
  Plane,
  Clock3,
} from "lucide-react";

import { getAirports } from "../api/airports";
import type { Airport } from "../api/airports";

import { getCities } from "../api/cities";
import type { City } from "../api/cities";

import { searchFlights } from "../api/flights";
import type { Flight } from "../api/flights";

function FlightSearch() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");

  const [originAirport, setOriginAirport] = useState("");
  const [destinationAirport, setDestinationAirport] = useState("");

  const [departureDate, setDepartureDate] = useState("");

  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [airportData, cityData] = await Promise.all([
          getAirports(),
          getCities(),
        ]);

        setAirports(airportData);
        setCities(cityData);
      } catch (error) {
        console.error("Error loading search data:", error);
      }
    };

    loadData();
  }, []);

  const getCityName = (cityId: string) => {
    const city = cities.find((city) => city.id === cityId);
    return city?.name ?? "";
  };

  const getAirportLabel = (airport: Airport) => {
    const cityName = getCityName(airport.city_id);

    return `${airport.iata_code} - ${airport.name}${
      cityName ? ` (${cityName})` : ""
    }`;
  };

  const filterAirports = (search: string) => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return airports;
    }

    return airports.filter((airport) => {
      const cityName = getCityName(airport.city_id).toLowerCase();

      return (
        airport.iata_code.toLowerCase().includes(value) ||
        airport.name.toLowerCase().includes(value) ||
        cityName.includes(value)
      );
    });
  };

  const handleOriginChange = (value: string) => {
    setOriginSearch(value);
    setOriginAirport("");
    setShowOriginSuggestions(true);
  };

  const handleDestinationChange = (value: string) => {
    setDestinationSearch(value);
    setDestinationAirport("");
    setShowDestinationSuggestions(true);
  };

  const selectOrigin = (airport: Airport) => {
    setOriginAirport(airport.id);
    setOriginSearch(getAirportLabel(airport));
    setShowOriginSuggestions(false);
  };

  const selectDestination = (airport: Airport) => {
    setDestinationAirport(airport.id);
    setDestinationSearch(getAirportLabel(airport));
    setShowDestinationSuggestions(false);
  };

  const handleSearch = async () => {
    setError("");
    setFlights([]);

    if (!originAirport || !destinationAirport || !departureDate) {
      setError("Selecciona origen, destino y fecha de salida.");
      return;
    }

    if (originAirport === destinationAirport) {
      setError("El origen y el destino deben ser diferentes.");
      return;
    }

    try {
      setLoading(true);

      const results = await searchFlights({
        origin_airport_id: originAirport,
        destination_airport_id: destinationAirport,
        departure_at: departureDate,
      });

      setFlights(results);
    } catch (error) {
      console.error("Error searching flights:", error);
      setError("No se encontraron vuelos disponibles para esta búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  const getAirportById = (id: string) => {
    return airports.find((airport) => airport.id === id);
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const originSuggestions = filterAirports(originSearch);
  const destinationSuggestions = filterAirports(destinationSearch);

  return (
    <div className="w-full">
      {/* BUSCADOR */}
      <div className="rounded-2xl border border-white/30 bg-white/80 p-6 shadow-2xl backdrop-blur-md">
        <h2 className="mb-6 text-left text-2xl font-bold text-gray-900">
          Buscar vuelos
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {/* ORIGEN */}
          <div className="relative">
            <label className="mb-2 block text-left text-sm font-medium text-gray-700">
              Origen
            </label>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={originSearch}
                onChange={(e) => handleOriginChange(e.target.value)}
                onFocus={() => setShowOriginSuggestions(true)}
                placeholder="Ciudad o aeropuerto"
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {showOriginSuggestions && originSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                {originSuggestions.map((airport) => (
                  <button
                    key={airport.id}
                    type="button"
                    onClick={() => selectOrigin(airport)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-blue-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {airport.iata_code} - {airport.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {getCityName(airport.city_id)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DESTINO */}
          <div className="relative">
            <label className="mb-2 block text-left text-sm font-medium text-gray-700">
              Destino
            </label>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={destinationSearch}
                onChange={(e) => handleDestinationChange(e.target.value)}
                onFocus={() => setShowDestinationSuggestions(true)}
                placeholder="Ciudad o aeropuerto"
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {showDestinationSuggestions &&
              destinationSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                  {destinationSuggestions.map((airport) => (
                    <button
                      key={airport.id}
                      type="button"
                      onClick={() => selectDestination(airport)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-blue-50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {airport.iata_code} - {airport.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {getCityName(airport.city_id)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
          </div>

          {/* FECHA */}
          <div>
            <label className="mb-2 block text-left text-sm font-medium text-gray-700">
              Fecha de salida
            </label>

            <div className="relative">
              <CalendarDays className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-left text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Search className="h-5 w-5" />

          {loading ? "Buscando..." : "Buscar vuelos"}
        </button>
      </div>

      {/* RESULTADOS */}
      {flights.length > 0 && (
        <div className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-white">
              Vuelos disponibles
            </h2>

            <p className="mt-1 text-white/80">
              {flights.length} vuelo{flights.length !== 1 ? "s" : ""} encontrado
              {flights.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="space-y-4">
            {flights.map((flight) => {
              const origin = getAirportById(flight.origin_airport_id);
              const destination = getAirportById(
                flight.destination_airport_id
              );

              return (
                <div
                  key={flight.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xl"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    {/* VUELO */}
                    <div className="flex-1">
                      <div className="mb-4 flex items-center gap-2">
                        <Plane className="h-5 w-5 text-blue-600" />

                        <span className="font-semibold text-gray-900">
                          Vuelo {flight.flight_number}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatTime(flight.departure_at)}
                          </p>

                          <p className="text-sm font-medium text-gray-600">
                            {origin?.iata_code}
                          </p>

                          <p className="text-xs text-gray-500">
                            {origin
                              ? getCityName(origin.city_id)
                              : "Origen"}
                          </p>
                        </div>

                        <div className="flex flex-1 items-center gap-2">
                          <div className="h-px flex-1 bg-gray-300"></div>

                          <Clock3 className="h-4 w-4 text-gray-400" />

                          <div className="h-px flex-1 bg-gray-300"></div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {formatTime(flight.arrival_at)}
                          </p>

                          <p className="text-sm font-medium text-gray-600">
                            {destination?.iata_code}
                          </p>

                          <p className="text-xs text-gray-500">
                            {destination
                              ? getCityName(destination.city_id)
                              : "Destino"}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-gray-500">
                        {formatDate(flight.departure_at)}
                      </p>
                    </div>

                    {/* PRECIO */}
                    <div className="border-t border-gray-100 pt-4 text-left md:border-l md:border-t-0 md:pl-6 md:pt-0 md:text-right">
                      <p className="text-sm text-gray-500">Precio</p>

                      <p className="mt-1 text-2xl font-bold text-blue-600">
                        ${flight.price.toLocaleString("es-CO")}
                      </p>

                      <button
                        type="button"
                        className="mt-3 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
                      >
                        Seleccionar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SIN RESULTADOS */}
      {!loading && !error && flights.length === 0 && departureDate && (
        <div className="mt-8 rounded-2xl bg-white/90 p-8 text-center shadow-xl">
          <Plane className="mx-auto h-10 w-10 text-gray-400" />

          <h3 className="mt-3 text-xl font-semibold text-gray-900">
            No hay vuelos disponibles
          </h3>

          <p className="mt-2 text-gray-500">
            Intenta buscar otra fecha, origen o destino.
          </p>
        </div>
      )}
    </div>
  );
}

export default FlightSearch;
