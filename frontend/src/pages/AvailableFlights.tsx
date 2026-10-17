import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  MapPin,
  Clock3,
  CalendarDays,
  ArrowRight,
  RefreshCw,
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

  useEffect(() => {
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

  const availableFlights = flights
    .filter(
      (flight) =>
        flight.status === "SCHEDULED" &&
        new Date(flight.departure_at).getTime() > Date.now()
    )
    .sort(
      (a, b) =>
        new Date(a.departure_at).getTime() -
        new Date(b.departure_at).getTime()
    );

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
        <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-800 px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-blue-100">
              <Plane size={16} />
              Explora tus opciones
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Vuelos disponibles
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Consulta horarios, destinos y precios para encontrar la opción
              que mejor se adapte a tu viaje.
            </p>

            {!loading && !error && (
              <div className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-slate-800 shadow-lg">
                <Plane size={18} className="text-blue-700" />
                {availableFlights.length} vuelo
                {availableFlights.length !== 1 ? "s" : ""} disponible
                {availableFlights.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
          {loading && (
            <div className="flex flex-col items-center py-20 text-slate-500">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-4">Cargando vuelos disponibles...</p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
              <p className="font-medium text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <RefreshCw size={17} />
                Intentar nuevamente
              </button>
            </div>
          )}

          {!loading && !error && availableFlights.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <Plane className="h-8 w-8 text-blue-600" />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                No hay vuelos disponibles
              </h2>

              <p className="mx-auto mt-3 max-w-md leading-6 text-slate-500">
                Por el momento no encontramos vuelos futuros programados.
                Vuelve a consultar más adelante.
              </p>
            </div>
          )}

          {!loading && !error && availableFlights.length > 0 && (
            <div className="space-y-5">
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-slate-900">
                  Encuentra tu próximo destino
                </h2>
                <p className="mt-2 text-slate-500">
                  Los vuelos están ordenados por fecha de salida.
                </p>
              </div>

              {availableFlights.map((flight) => {
                const origin = getAirport(flight.origin_airport_id);
                const destination = getAirport(
                  flight.destination_airport_id
                );

                return (
                  <article
                    key={flight.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="grid md:grid-cols-[1fr_auto]">
                      <div className="p-5 sm:p-7">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                              <Plane className="h-5 w-5 text-blue-700" />
                            </div>

                            <div>
                              <p className="font-bold text-slate-900">
                                Vuelo {flight.flight_number}
                              </p>
                              <p className="text-sm text-slate-500">
                                Vuelo programado
                              </p>
                            </div>
                          </div>

                          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            Disponible
                          </span>
                        </div>

                        <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
                          <div>
                            <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                              {formatTime(flight.departure_at)}
                            </p>
                            <p className="mt-1 text-lg font-semibold text-blue-700">
                              {origin?.iata_code ?? "—"}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {origin
                                ? getCityName(origin.city_id)
                                : "Origen"}
                            </p>
                          </div>

                          <div className="flex min-w-12 flex-col items-center gap-2 text-slate-400">
                            <span className="text-xs">Salida → llegada</span>
                            <div className="flex w-full items-center">
                              <div className="h-px flex-1 bg-slate-300" />
                              <Plane size={17} className="mx-1 text-blue-600" />
                              <div className="h-px flex-1 bg-slate-300" />
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                              {formatTime(flight.arrival_at)}
                            </p>
                            <p className="mt-1 text-lg font-semibold text-blue-700">
                              {destination?.iata_code ?? "—"}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {destination
                                ? getCityName(destination.city_id)
                                : "Destino"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-5 text-sm text-slate-500">
                          <span className="flex items-center gap-2">
                            <CalendarDays
                              size={17}
                              className="text-blue-600"
                            />
                            {formatDate(flight.departure_at)}
                          </span>

                          <span className="flex items-center gap-2">
                            <Clock3 size={17} className="text-blue-600" />
                            Horario local
                          </span>

                          <span className="flex items-center gap-2">
                            <MapPin size={17} className="text-blue-600" />
                            {origin?.iata_code ?? "—"} →{" "}
                            {destination?.iata_code ?? "—"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center border-t border-slate-100 bg-slate-50 p-5 sm:p-7 md:w-56 md:border-l md:border-t-0">
                        <p className="text-sm text-slate-500">
                          Precio por pasajero
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {formatPrice(flight.price)}
                        </p>

                        <button
                          type="button"
                          onClick={() => handleSelectFlight(flight.id)}
                          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
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
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 text-center text-sm text-slate-500 sm:px-8">
          © {new Date().getFullYear()} Flight System
        </div>
      </footer>
    </div>
  );
}

export default AvailableFlights;
