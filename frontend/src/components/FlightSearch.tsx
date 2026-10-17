import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Search,
  Plane,
  Clock3,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { getAirports } from "../api/airports";
import type { Airport } from "../api/airports";
import { getCities } from "../api/cities";
import type { City } from "../api/cities";
import { searchFlights } from "../api/flights";
import type { Flight } from "../api/flights";

const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function FlightSearch() {
  const navigate = useNavigate();

  const [airports, setAirports] = useState<Airport[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [originAirport, setOriginAirport] = useState("");
  const [destinationAirport, setDestinationAirport] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = getLocalDateString(new Date());

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
        setError("No fue posible cargar los aeropuertos.");
      }
    };

    void loadData();
  }, []);

  const getCityName = (cityId: string) =>
    cities.find((city) => city.id === cityId)?.name ?? "";

  const getAirportLabel = (airport: Airport) => {
    const cityName = getCityName(airport.city_id);

    return `${airport.iata_code} - ${airport.name}${
      cityName ? ` (${cityName})` : ""
    }`;
  };

  const filterAirports = (search: string) => {
    const value = search.toLowerCase().trim();

    if (!value) return airports;

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

  const handleSelectDate = (date: Date) => {
    setDepartureDate(getLocalDateString(date));
    setShowCalendar(false);
    setError("");
  };

  const selectedDate = departureDate
    ? new Date(`${departureDate}T12:00:00`)
    : null;

  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate();

  // La semana comienza el lunes.
  const firstDayOffset =
    (new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1
    ).getDay() +
      6) %
    7;

  const calendarDays = Array.from(
    { length: firstDayOffset + daysInMonth },
    (_, index) => {
      if (index < firstDayOffset) return null;
      return index - firstDayOffset + 1;
    }
  );

  const monthLabel = calendarMonth.toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
  });

  const changeMonth = (amount: number) => {
    setCalendarMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + amount,
          1
        )
    );
  };

  const handleSearch = async () => {
    setError("");
    setFlights([]);
    setHasSearched(false);

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
      setHasSearched(true);
    } catch (error) {
      console.error("Error searching flights:", error);
      setError("No fue posible completar la búsqueda de vuelos.");
    } finally {
      setLoading(false);
    }
  };

  const getAirportById = (id: string) =>
    airports.find((airport) => airport.id === id);

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const originSuggestions = filterAirports(originSearch);
  const destinationSuggestions = filterAirports(destinationSearch);

  return (
    <div className="w-full">
      <div className="relative z-20 rounded-2xl border border-white/30 bg-white/90 p-6 shadow-2xl backdrop-blur-md">
        <h2 className="mb-6 text-left text-2xl font-bold text-gray-900">
          Buscar vuelos
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Origen */}
          <div className="relative z-30">
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
                onBlur={() =>
                  setTimeout(() => setShowOriginSuggestions(false), 150)
                }
                placeholder="Ciudad o aeropuerto"
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {showOriginSuggestions && originSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                {originSuggestions.map((airport) => (
                  <button
                    key={airport.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
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

          {/* Destino */}
          <div className="relative z-30">
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
                onBlur={() =>
                  setTimeout(
                    () => setShowDestinationSuggestions(false),
                    150
                  )
                }
                placeholder="Ciudad o aeropuerto"
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {showDestinationSuggestions &&
              destinationSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                  {destinationSuggestions.map((airport) => (
                    <button
                      key={airport.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
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

          {/* Calendario personalizado */}
          <div className="relative z-40">
            <label className="mb-2 block text-left text-sm font-medium text-gray-700">
              Fecha de salida
            </label>

            <button
              type="button"
              onClick={() => {
                if (departureDate) {
                  const date = new Date(`${departureDate}T12:00:00`);
                  setCalendarMonth(
                    new Date(date.getFullYear(), date.getMonth(), 1)
                  );
                }

                setShowCalendar((current) => !current);
              }}
              className={`flex w-full items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left outline-none transition focus:ring-2 focus:ring-blue-100 ${
                showCalendar
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <CalendarDays className="h-5 w-5 shrink-0 text-blue-600" />

              <span
                className={
                  departureDate ? "text-gray-900" : "text-gray-400"
                }
              >
                {selectedDate
                  ? selectedDate.toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Selecciona una fecha"}
              </span>
            </button>

            {showCalendar && (
              <>
                <button
                  type="button"
                  aria-label="Cerrar calendario"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setShowCalendar(false)}
                />

                <div className="absolute right-0 top-full z-50 mt-3 w-[min(320px,calc(100vw-3rem))] rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-2xl sm:w-80">
                  {/* Encabezado del calendario */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Fecha de salida
                      </p>

                      <h3 className="mt-1 text-lg font-bold capitalize text-slate-900">
                        {monthLabel}
                      </h3>
                    </div>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        aria-label="Mes anterior"
                        onClick={() => changeMonth(-1)}
                        disabled={
                          calendarMonth.getFullYear() ===
                            new Date().getFullYear() &&
                          calendarMonth.getMonth() === new Date().getMonth()
                        }
                        className="rounded-lg p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronLeft size={19} />
                      </button>

                      <button
                        type="button"
                        aria-label="Mes siguiente"
                        onClick={() => changeMonth(1)}
                        className="rounded-lg p-2 transition hover:bg-slate-100"
                      >
                        <ChevronRight size={19} />
                      </button>
                    </div>
                  </div>

                  {/* Días de la semana */}
                  <div className="mt-5 grid grid-cols-7 text-center">
                    {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map(
                      (day) => (
                        <span
                          key={day}
                          className="py-2 text-xs font-semibold text-slate-400"
                        >
                          {day}
                        </span>
                      )
                    )}
                  </div>

                  {/* Días del mes */}
                  <div className="grid grid-cols-7 gap-y-1">
                    {calendarDays.map((day, index) => {
                      if (day === null) {
                        return <div key={`empty-${index}`} />;
                      }

                      const date = new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth(),
                        day
                      );

                      const dateString = getLocalDateString(date);
                      const isPast = dateString < today;
                      const isSelected = dateString === departureDate;
                      const isToday = dateString === today;

                      return (
                        <button
                          key={dateString}
                          type="button"
                          disabled={isPast}
                          onClick={() => handleSelectDate(date)}
                          className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-xl text-sm transition ${
                            isSelected
                              ? "bg-blue-600 font-semibold text-white shadow-md shadow-blue-200"
                              : isPast
                                ? "cursor-not-allowed text-slate-300"
                                : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                          }`}
                        >
                          {day}

                          {isToday && !isSelected && (
                            <span className="absolute bottom-1 h-1 w-1 rounded-full bg-blue-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Acciones */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => handleSelectDate(new Date())}
                      className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                    >
                      Hoy
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDepartureDate("");
                        setShowCalendar(false);
                      }}
                      className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
                    >
                      <X size={15} />
                      Limpiar
                    </button>
                  </div>
                </div>
              </>
            )}
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

      {/* Resultados de búsqueda */}
      {flights.length > 0 && (
        <div className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-white">
              Vuelos disponibles
            </h2>

            <p className="mt-1 text-white/80">
              {flights.length} vuelo{flights.length !== 1 ? "s" : ""}{" "}
              encontrado{flights.length !== 1 ? "s" : ""}
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
                            {origin ? getCityName(origin.city_id) : "Origen"}
                          </p>
                        </div>

                        <div className="flex flex-1 items-center gap-2">
                          <div className="h-px flex-1 bg-gray-300" />
                          <Clock3 className="h-4 w-4 text-gray-400" />
                          <div className="h-px flex-1 bg-gray-300" />
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

                    <div className="border-t border-gray-100 pt-4 text-left md:border-l md:border-t-0 md:pl-6 md:pt-0 md:text-right">
                      <p className="text-sm text-gray-500">
                        Precio por pasajero
                      </p>

                      <p className="mt-1 text-2xl font-bold text-blue-600">
                        ${flight.price.toLocaleString("es-CO")}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          const token = localStorage.getItem("access_token");

                          if (!token) {
                            navigate("/login");
                            return;
                          }

                          navigate(
                            `/reservations/new?flight_id=${flight.id}`
                          );
                        }}
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

      {!loading && hasSearched && flights.length === 0 && !error && (
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
