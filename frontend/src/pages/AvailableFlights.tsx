import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  MapPin,
  Clock3,
  CalendarDays,
  ArrowRight,
  RefreshCw,
  Search,
  ShieldCheck,
  ArrowDownUp,
  Luggage,
  CircleCheck,
  SlidersHorizontal,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { getFlights } from "../api/flights";
import type { Flight } from "../api/flights";
import { getAirports } from "../api/airports";
import type { Airport } from "../api/airports";
import { getCities } from "../api/cities";
import type { City } from "../api/cities";

function AvailableFlights() {
  const navigate = useNavigate();

  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("departure");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [flightData, airportData, cityData] = await Promise.all([
        getFlights(),
        getAirports(),
        getCities(),
      ]);

      setFlights(flightData);
      setAirports(airportData);
      setCities(cityData);
    } catch (error) {
      console.error("Error loading available flights:", error);
      setError("No fue posible cargar los vuelos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const getAirport = (id: string) =>
    airports.find((airport) => airport.id === id);

  const getCityName = (cityId: string) =>
    cities.find((city) => city.id === cityId)?.name ?? "";

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatPrice = (price: number) =>
    price.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const getDuration = (departure: string, arrival: string) => {
    const difference =
      new Date(arrival).getTime() - new Date(departure).getTime();

    if (difference <= 0) return "—";

    const hours = Math.floor(difference / 3_600_000);
    const minutes = Math.floor((difference % 3_600_000) / 60_000);

    return hours > 0
      ? `${hours} h ${minutes > 0 ? `${minutes} min` : ""}`.trim()
      : `${minutes} min`;
  };

  const availableFlights = flights
    .filter(
      (flight) =>
        flight.status === "SCHEDULED" &&
        new Date(flight.departure_at).getTime() > Date.now()
    )
    .filter((flight) => {
      const origin = getAirport(flight.origin_airport_id);
      const destination = getAirport(flight.destination_airport_id);
      const search = searchTerm.toLowerCase().trim();

      if (!search) return true;

      const searchableValues = [
        flight.flight_number,
        origin?.iata_code ?? "",
        destination?.iata_code ?? "",
        origin ? getCityName(origin.city_id) : "",
        destination ? getCityName(destination.city_id) : "",
      ];

      return searchableValues.some((value) =>
        value.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;

      if (sortBy === "departure") {
        return (
          new Date(a.departure_at).getTime() -
          new Date(b.departure_at).getTime()
        );
      }

      return (
        new Date(b.departure_at).getTime() -
        new Date(a.departure_at).getTime()
      );
    });

  const handleSelectFlight = (flightId: string) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    navigate(`/reservations/new?flight_id=${flightId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-5 py-14 sm:px-8 sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 backdrop-blur-sm">
              <Plane size={16} />
              Encuentra tu próximo destino
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Vuela hacia
                  <span className="block bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
                    nuevas experiencias.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100/75 sm:text-lg">
                  Explora los vuelos programados, compara precios y horarios, y
                  encuentra la opción adecuada para tu próximo viaje.
                </p>
              </div>

              {!loading && !error && (
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.08] p-5 backdrop-blur-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
                    <Plane size={23} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {availableFlights.length}
                    </p>
                    <p className="text-sm text-blue-100/70">
                      {availableFlights.length === 1
                        ? "Vuelo encontrado"
                        : "Vuelos encontrados"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-blue-100/80">
              <span className="flex items-center gap-2">
                <CircleCheck size={17} className="text-cyan-300" />
                Vuelos programados
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-cyan-300" />
                Reserva segura
              </span>
              <span className="flex items-center gap-2">
                <Luggage size={17} className="text-cyan-300" />
                Planifica tu viaje
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
          {!loading && !error && flights.length > 0 && (
            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Encuentra tu vuelo
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Busca por ciudad, aeropuerto o número de vuelo.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative sm:min-w-72">
                    <Search
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Ciudad, código o vuelo..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div className="relative">
                    <SlidersHorizontal
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      aria-label="Ordenar vuelos"
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:w-52"
                    >
                      <option value="departure">Salida más próxima</option>
                      <option value="price">Menor precio</option>
                      <option value="latest">Salida más lejana</option>
                    </select>
                    <ArrowDownUp
                      size={15}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white py-24 text-slate-500">
              <RefreshCw className="h-9 w-9 animate-spin text-blue-600" />
              <p className="mt-5 font-semibold text-slate-700">
                Cargando vuelos disponibles
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Estamos preparando las opciones para tu viaje.
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <RefreshCw size={25} />
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                No pudimos cargar los vuelos
              </h2>
              <p className="mt-2 text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => void loadData()}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <RefreshCw size={17} />
                Intentar nuevamente
              </button>
            </div>
          )}

          {!loading && !error && availableFlights.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm sm:py-20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <Plane className="h-8 w-8 text-blue-600" />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                {searchTerm
                  ? "No encontramos coincidencias"
                  : "No hay vuelos disponibles"}
              </h2>

              <p className="mx-auto mt-3 max-w-md leading-6 text-slate-500">
                {searchTerm
                  ? "Prueba con otra ciudad, código de aeropuerto o número de vuelo."
                  : "Por el momento no encontramos vuelos futuros programados. Vuelve a consultar más adelante."}
              </p>

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="mt-5 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Limpiar búsqueda
                </button>
              )}

              {!searchTerm && (
                <button
                  type="button"
                  onClick={() => void loadData()}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  <RefreshCw size={17} />
                  Actualizar vuelos
                </button>
              )}
            </div>
          )}

          {!loading && !error && availableFlights.length > 0 && (
            <div className="space-y-5">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Vuelos programados
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Consulta los detalles y selecciona tu opción.
                  </p>
                </div>

                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-800">
                    {availableFlights.length}
                  </span>{" "}
                  {availableFlights.length === 1 ? "resultado" : "resultados"}
                </p>
              </div>

              {availableFlights.map((flight) => {
                const origin = getAirport(flight.origin_airport_id);
                const destination = getAirport(flight.destination_airport_id);

                return (
                  <article
                    key={flight.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/[0.06]"
                  >
                    <div className="grid md:grid-cols-[minmax(0,1fr)_245px]">
                      <div className="p-5 sm:p-7 lg:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 transition group-hover:from-blue-100 group-hover:to-indigo-100">
                              <Plane size={22} />
                            </div>

                            <div>
                              <p className="font-bold text-slate-900">
                                Vuelo {flight.flight_number}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                Detalles del itinerario
                              </p>
                            </div>
                          </div>

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Disponible
                          </span>
                        </div>

                        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_minmax(90px,0.8fr)_minmax(0,1fr)] items-center gap-2 sm:gap-6">
                          <div className="min-w-0">
                            <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                              {formatTime(flight.departure_at)}
                            </p>
                            <p className="mt-1.5 text-xl font-bold text-blue-700">
                              {origin?.iata_code ?? "—"}
                            </p>
                            <p className="mt-1 truncate text-sm font-medium text-slate-600">
                              {origin ? getCityName(origin.city_id) : "Origen"}
                            </p>
                            <p className="mt-1 truncate text-xs text-slate-400">
                              {origin?.name ?? "Aeropuerto"}
                            </p>
                          </div>

                          <div className="flex min-w-0 flex-col items-center gap-2.5">
                            <span className="text-center text-[11px] font-medium text-slate-400">
                              {getDuration(
                                flight.departure_at,
                                flight.arrival_at
                              )}
                            </span>
                            <div className="flex w-full items-center">
                              <div className="h-px flex-1 bg-slate-300" />
                              <div className="mx-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600">
                                <Plane size={15} />
                              </div>
                              <div className="h-px flex-1 bg-slate-300" />
                            </div>
                            <span className="text-center text-[10px] font-medium uppercase tracking-wider text-slate-400">
                              Directo
                            </span>
                          </div>

                          <div className="min-w-0 text-right">
                            <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                              {formatTime(flight.arrival_at)}
                            </p>
                            <p className="mt-1.5 text-xl font-bold text-blue-700">
                              {destination?.iata_code ?? "—"}
                            </p>
                            <p className="mt-1 truncate text-sm font-medium text-slate-600">
                              {destination
                                ? getCityName(destination.city_id)
                                : "Destino"}
                            </p>
                            <p className="mt-1 truncate text-xs text-slate-400">
                              {destination?.name ?? "Aeropuerto"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-5 text-sm text-slate-500">
                          <span className="flex items-center gap-2">
                            <CalendarDays
                              size={16}
                              className="shrink-0 text-blue-600"
                            />
                            {formatDate(flight.departure_at)}
                          </span>

                          <span className="flex items-center gap-2">
                            <Clock3
                              size={16}
                              className="shrink-0 text-blue-600"
                            />
                            Horario local
                          </span>

                          <span className="flex items-center gap-2">
                            <MapPin
                              size={16}
                              className="shrink-0 text-blue-600"
                            />
                            {origin?.iata_code ?? "—"} →{" "}
                            {destination?.iata_code ?? "—"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between border-t border-slate-100 bg-slate-50/80 p-5 sm:p-7 md:border-l md:border-t-0">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Precio por pasajero
                          </p>
                          <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                            {formatPrice(flight.price)}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Precio en pesos colombianos
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectFlight(flight.id)}
                          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/15 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
                        >
                          Seleccionar vuelo
                          <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </button>

                        <p className="mt-3 text-center text-xs text-slate-400">
                          Continúa para reservar
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-center sm:flex-row sm:px-8 sm:text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Plane size={16} />
            </div>
            <span className="font-bold text-slate-800">
              Flight<span className="text-blue-600">System</span>
            </span>
          </div>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Flight System. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AvailableFlights;