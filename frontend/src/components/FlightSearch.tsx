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
  ArrowRight,
  ArrowRightLeft,
  ShieldCheck,
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
      {/* Formulario de búsqueda */}
      <div className="relative z-20 rounded-xl bg-white p-1 sm:p-2">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Origen */}
          <div className="relative z-30">
            <label className="mb-2 block text-left text-sm font-semibold text-slate-700">
              Desde
            </label>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-blue-700" />

              <input
                type="text"
                value={originSearch}
                onChange={(e) => handleOriginChange(e.target.value)}
                onFocus={() => setShowOriginSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowOriginSuggestions(false), 150)
                }
                placeholder="Ciudad o aeropuerto"
                aria-label="Aeropuerto de origen"
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {showOriginSuggestions && originSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-2xl">
                {originSuggestions.map((airport) => (
                  <button
                    key={airport.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectOrigin(airport)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-blue-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <Plane size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {airport.iata_code} - {airport.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
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
            <label className="mb-2 block text-left text-sm font-semibold text-slate-700">
              Hacia
            </label>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-blue-700" />

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
                aria-label="Aeropuerto de destino"
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {showDestinationSuggestions &&
              destinationSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-2xl">
                  {destinationSuggestions.map((airport) => (
                    <button
                      key={airport.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectDestination(airport)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-blue-50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                        <MapPin size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {airport.iata_code} - {airport.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {getCityName(airport.city_id)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
          </div>

          {/* Fecha de salida */}
          <div className="relative z-40">
            <label className="mb-2 block text-left text-sm font-semibold text-slate-700">
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
              aria-label="Seleccionar fecha de salida"
              aria-expanded={showCalendar}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-4 text-left text-sm outline-none transition focus:ring-4 focus:ring-blue-500/10 ${
                showCalendar
                  ? "border-blue-500 bg-white"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <CalendarDays className="h-5 w-5 shrink-0 text-blue-700" />

              <span
                className={
                  departureDate
                    ? "font-medium text-slate-800"
                    : "text-slate-400"
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

              <ChevronRight
                size={17}
                className={`ml-auto shrink-0 text-slate-400 transition-transform ${
                  showCalendar ? "rotate-90" : ""
                }`}
              />
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                        Tu viaje
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
                              ? "bg-blue-700 font-semibold text-white shadow-md shadow-blue-200"
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

                  {/* Acciones del calendario */}
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
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-700"
          >
            {error}
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
            Consulta los vuelos programados disponibles.
          </p>

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 hover:shadow-xl hover:shadow-blue-700/25 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            <Search size={19} />
            {loading ? "Buscando vuelos..." : "Buscar vuelos"}
            {!loading && <ArrowRight size={17} />}
          </button>
        </div>
      </div>

      {/* Resultados de búsqueda */}
      {flights.length > 0 && (
        <div className="mt-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">
                Resultados de búsqueda
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                Vuelos disponibles
              </h2>
            </div>

            <p className="text-sm text-white/80">
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
                <article
                  key={flight.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-stretch">
                    <div className="min-w-0 flex-1 p-5 sm:p-7">
                      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-800">
                          <Plane size={17} />
                          Vuelo {flight.flight_number}
                        </div>

                        <span className="text-xs font-medium text-slate-500">
                          {formatDate(flight.departure_at)}
                        </span>
                      </div>

                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
                        <div className="min-w-0">
                          <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            {formatTime(flight.departure_at)}
                          </p>

                          <p className="mt-1 text-base font-bold text-blue-800">
                            {origin?.iata_code ?? "---"}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                            {origin ? getCityName(origin.city_id) : "Origen"}
                          </p>
                        </div>

                        <div className="flex min-w-[65px] flex-col items-center gap-2 px-1 sm:min-w-[100px]">
                          <Clock3 size={16} className="text-slate-400" />

                          <div className="flex w-full items-center">
                            <div className="h-px flex-1 bg-slate-300" />
                            <Plane
                              size={16}
                              className="mx-1 shrink-0 rotate-90 text-blue-700"
                            />
                            <div className="h-px flex-1 bg-slate-300" />
                          </div>

                          <span className="text-[10px] font-medium text-slate-400 sm:text-xs">
                            Vuelo
                          </span>
                        </div>

                        <div className="min-w-0 text-right">
                          <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            {formatTime(flight.arrival_at)}
                          </p>

                          <p className="mt-1 text-base font-bold text-blue-800">
                            {destination?.iata_code ?? "---"}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                            {destination
                              ? getCityName(destination.city_id)
                              : "Destino"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center border-t border-slate-200 bg-slate-50 p-5 md:w-56 md:shrink-0 md:border-l md:border-t-0 md:p-6">
                      <p className="text-xs font-medium text-slate-500">
                        Precio por pasajero
                      </p>

                      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
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
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                      >
                        Seleccionar
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Búsqueda sin resultados */}
      {!loading && hasSearched && flights.length === 0 && !error && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Plane size={30} />
          </div>

          <h3 className="mt-5 text-xl font-bold text-slate-900">
            No hay vuelos disponibles
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            No encontramos vuelos para los criterios seleccionados. Prueba con
            otra fecha, origen o destino.
          </p>

          <button
            type="button"
            onClick={() => {
              setDepartureDate("");
              setFlights([]);
              setHasSearched(false);
              setError("");
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <ArrowRightLeft size={16} />
            Nueva búsqueda
          </button>
        </div>
      )}
    </div>
  );
}

export default FlightSearch;