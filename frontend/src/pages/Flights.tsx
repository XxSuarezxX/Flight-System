import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plane,
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  X,
  RefreshCw,
  PlaneTakeoff,
  PlaneLanding,
} from "lucide-react";

import {
  getFlights,
  createFlight,
  updateFlight,
  deleteFlight,
} from "../api/flights";
import type { Flight } from "../api/flights";

import { getAirports } from "../api/airports";
import type { Airport } from "../api/airports";

import Notification from "../components/Notification";
import ConfirmationModal from "../components/ConfirmationModal";

function Flights() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

  const [flightNumber, setFlightNumber] = useState("");
  const [originAirportId, setOriginAirportId] = useState("");
  const [destinationAirportId, setDestinationAirportId] = useState("");
  const [departureAt, setDepartureAt] = useState("");
  const [arrivalAt, setArrivalAt] = useState("");
  const [price, setPrice] = useState("");

  const [notification, setNotification] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [flightsData, airportsData] = await Promise.all([
        getFlights(),
        getAirports(),
      ]);

      setFlights(flightsData);
      setAirports(airportsData);
    } catch (error) {
      console.error("Error loading flights:", error);
      setNotification("Could not load flight information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateForm = () => {
    setEditingFlight(null);
    setFlightNumber("");
    setOriginAirportId("");
    setDestinationAirportId("");
    setDepartureAt("");
    setArrivalAt("");
    setPrice("");
    setShowForm(true);
  };

  const openEditForm = (flight: Flight) => {
    setEditingFlight(flight);
    setFlightNumber(flight.flight_number);
    setOriginAirportId(flight.origin_airport_id);
    setDestinationAirportId(flight.destination_airport_id);
    setDepartureAt(flight.departure_at.slice(0, 16));
    setArrivalAt(flight.arrival_at.slice(0, 16));
    setPrice(String(flight.price));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingFlight(null);
    setFlightNumber("");
    setOriginAirportId("");
    setDestinationAirportId("");
    setDepartureAt("");
    setArrivalAt("");
    setPrice("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (originAirportId === destinationAirportId) {
      setNotification("Origin and destination airports must be different.");
      return;
    }

    if (
      new Date(arrivalAt).getTime() <=
      new Date(departureAt).getTime()
    ) {
      setNotification("Arrival must be later than departure.");
      return;
    }

    setSaving(true);

    try {
      const data = {
        flight_number: flightNumber.trim(),
        origin_airport_id: originAirportId,
        destination_airport_id: destinationAirportId,
        departure_at: departureAt,
        arrival_at: arrivalAt,
        price: Number(price),
      };

      if (editingFlight) {
        await updateFlight(editingFlight.id, data);
        setNotification("Flight updated successfully.");
      } else {
        await createFlight(data);
        setNotification("Flight created successfully.");
      }

      closeForm();
      await loadData();
    } catch (error) {
      console.error("Error saving flight:", error);

      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setNotification(
          typeof error.response.data?.detail === "string"
            ? error.response.data.detail
            : "A conflict occurred while saving the flight."
        );
      } else {
        setNotification("Could not save flight.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (flightId: string) => {
    setItemToDelete(flightId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteFlight(itemToDelete);
      setNotification("Flight deleted successfully.");
      await loadData();
    } catch (error) {
      console.error("Error deleting flight:", error);

      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setNotification(
          typeof error.response.data?.detail === "string"
            ? error.response.data.detail
            : "This flight cannot be deleted."
        );
      } else {
        setNotification("Could not delete flight.");
      }
    } finally {
      setShowConfirmation(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setItemToDelete(null);
  };

  const getAirport = (airportId: string) =>
    airports.find((airport) => airport.id === airportId);

  const getAirportName = (airportId: string) =>
    getAirport(airportId)?.name ?? "Unknown airport";

  const getAirportCode = (airportId: string) =>
    getAirport(airportId)?.iata_code ?? "N/A";

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-50 text-blue-700 ring-blue-600/15";
      case "DEPARTED":
        return "bg-amber-50 text-amber-700 ring-amber-600/15";
      case "ARRIVED":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/15";
      case "CANCELLED":
        return "bg-red-50 text-red-700 ring-red-600/15";
      default:
        return "bg-slate-100 text-slate-600 ring-slate-500/15";
    }
  };

  const filteredFlights = flights.filter((flight) => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return true;

    return [
      flight.flight_number,
      getAirportName(flight.origin_airport_id),
      getAirportName(flight.destination_airport_id),
      getAirportCode(flight.origin_airport_id),
      getAirportCode(flight.destination_airport_id),
      flight.status,
    ].some((value) => value.toLowerCase().includes(term));
  });

  const scheduledCount = flights.filter(
    (flight) => flight.status === "SCHEDULED"
  ).length;

  const departedCount = flights.filter(
    (flight) => flight.status === "DEPARTED"
  ).length;

  const cancelledCount = flights.filter(
    (flight) => flight.status === "CANCELLED"
  ).length;

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100">
                <Plane size={17} />
              </span>
              Administration
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">Flights</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Flight management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Create, review and manage the flights registered in your system.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                loadData();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
            >
              <Plus size={18} />
              Add flight
            </button>
          </div>
        </header>

        {/* Summary cards */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total flights
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {loading ? "—" : flights.length}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Registered in the system
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Plane size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Scheduled
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {loading ? "—" : scheduledCount}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Ready for departure
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <CalendarDays size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  In progress
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {loading ? "—" : departedCount}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Flights already departed
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <PlaneTakeoff size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Cancelled
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {loading ? "—" : cancelledCount}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Flights requiring attention
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <X size={22} />
              </div>
            </div>
          </div>
        </section>

        {/* Flight table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Registered flights
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredFlights.length}{" "}
                {filteredFlights.length === 1 ? "flight" : "flights"} found
              </p>
            </div>

            <div className="relative w-full sm:max-w-sm">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search flight, airport or status..."
                aria-label="Search flights"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center px-6 py-20">
              <div className="mb-4 h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
              <p className="text-sm font-medium text-slate-600">
                Loading flight information...
              </p>
            </div>
          ) : filteredFlights.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center sm:py-20">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Plane size={30} />
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                {searchTerm
                  ? "No matching flights"
                  : "No flights registered yet"}
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {searchTerm
                  ? "Try another flight number, airport name or status."
                  : "Create your first flight to start managing your flight network."}
              </p>

              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Clear search
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  <Plus size={17} />
                  Add first flight
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="bg-slate-50/80">
                  <tr>
                    {[
                      "Flight",
                      "Route",
                      "Departure",
                      "Arrival",
                      "Price",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className={`whitespace-nowrap px-5 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:px-6 ${
                          heading === "Actions" ? "text-right" : ""
                        }`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredFlights.map((flight) => (
                    <tr
                      key={flight.id}
                      className="transition-colors hover:bg-blue-50/30"
                    >
                      <td className="px-5 py-5 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <Plane size={19} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {flight.flight_number}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              Flight ID: {flight.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="min-w-[70px]">
                            <p className="text-sm font-bold text-slate-800">
                              {getAirportCode(flight.origin_airport_id)}
                            </p>
                            <p className="mt-1 max-w-[130px] truncate text-xs text-slate-500">
                              {getAirportName(flight.origin_airport_id)}
                            </p>
                          </div>

                          <ArrowRight
                            size={16}
                            className="shrink-0 text-slate-400"
                          />

                          <div className="min-w-[70px]">
                            <p className="text-sm font-bold text-slate-800">
                              {getAirportCode(flight.destination_airport_id)}
                            </p>
                            <p className="mt-1 max-w-[130px] truncate text-xs text-slate-500">
                              {getAirportName(flight.destination_airport_id)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 sm:px-6">
                        <div className="flex items-start gap-2.5">
                          <CalendarDays
                            size={16}
                            className="mt-0.5 shrink-0 text-slate-400"
                          />
                          <div>
                            <p className="whitespace-nowrap text-sm font-medium text-slate-700">
                              {formatDate(flight.departure_at)}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                              <Clock3 size={12} />
                              {formatTime(flight.departure_at)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 sm:px-6">
                        <div className="flex items-start gap-2.5">
                          <PlaneLanding
                            size={16}
                            className="mt-0.5 shrink-0 text-slate-400"
                          />
                          <div>
                            <p className="whitespace-nowrap text-sm font-medium text-slate-700">
                              {formatDate(flight.arrival_at)}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                              <Clock3 size={12} />
                              {formatTime(flight.arrival_at)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 sm:px-6">
                        <p className="text-sm font-bold text-slate-900">
                          {formatPrice(flight.price)}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Per passenger
                        </p>
                      </td>

                      <td className="px-5 py-5 sm:px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusStyles(
                            flight.status
                          )}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {flight.status.charAt(0) +
                            flight.status.slice(1).toLowerCase()}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-right sm:px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(flight)}
                            aria-label={`Edit ${flight.flight_number}`}
                            title="Edit flight"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(flight.id)}
                            aria-label={`Delete ${flight.flight_number}`}
                            title="Delete flight"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && flights.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p>
                Showing {filteredFlights.length} of {flights.length} flights
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={13} />
                Flight System administration
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Create / edit modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              closeForm();
            }
          }}
        >
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-950/20">
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-blue-950 to-blue-800 px-6 py-6 text-white sm:px-8">
              <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/5" />
              <div className="absolute -right-1 -top-5 h-24 w-24 rounded-full bg-white/5" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                    {editingFlight ? (
                      <Pencil size={20} />
                    ) : (
                      <Plane size={21} />
                    )}
                  </div>

                  <h2 className="text-xl font-bold sm:text-2xl">
                    {editingFlight ? "Edit flight" : "Create a new flight"}
                  </h2>

                  <p className="mt-2 text-sm text-blue-100/80">
                    {editingFlight
                      ? "Update the flight details below."
                      : "Enter the route, schedule and ticket price."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  aria-label="Close form"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <div className="mb-7">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                  Flight information
                </p>

                <div>
                  <label htmlFor="flight-number" className={labelClass}>
                    Flight number
                  </label>
                  <input
                    id="flight-number"
                    type="text"
                    value={flightNumber}
                    onChange={(event) => setFlightNumber(event.target.value)}
                    placeholder="e.g. AV123"
                    autoComplete="off"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="mb-7">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                  Flight route
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="origin-airport" className={labelClass}>
                      Origin airport
                    </label>
                    <select
                      id="origin-airport"
                      value={originAirportId}
                      onChange={(event) =>
                        setOriginAirportId(event.target.value)
                      }
                      className={inputClass}
                      required
                    >
                      <option value="">Select origin</option>
                      {airports.map((airport: Airport) => (
                        <option key={airport.id} value={airport.id}>
                          {airport.name} ({airport.iata_code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="destination-airport"
                      className={labelClass}
                    >
                      Destination airport
                    </label>
                    <select
                      id="destination-airport"
                      value={destinationAirportId}
                      onChange={(event) =>
                        setDestinationAirportId(event.target.value)
                      }
                      className={inputClass}
                      required
                    >
                      <option value="">Select destination</option>
                      {airports.map((airport: Airport) => (
                        <option key={airport.id} value={airport.id}>
                          {airport.name} ({airport.iata_code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {originAirportId &&
                  destinationAirportId &&
                  originAirportId === destinationAirportId && (
                    <p className="mt-3 text-sm font-medium text-red-600">
                      Choose two different airports for this route.
                    </p>
                  )}
              </div>

              <div className="mb-7">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                  Schedule
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="departure-at" className={labelClass}>
                      Departure date and time
                    </label>
                    <input
                      id="departure-at"
                      type="datetime-local"
                      value={departureAt}
                      onChange={(event) => setDepartureAt(event.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="arrival-at" className={labelClass}>
                      Arrival date and time
                    </label>
                    <input
                      id="arrival-at"
                      type="datetime-local"
                      value={arrivalAt}
                      onChange={(event) => setArrivalAt(event.target.value)}
                      min={departureAt || undefined}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {departureAt &&
                  arrivalAt &&
                  new Date(arrivalAt).getTime() <=
                    new Date(departureAt).getTime() && (
                    <p className="mt-3 text-sm font-medium text-red-600">
                      Arrival must be later than departure.
                    </p>
                  )}
              </div>

              <div>
                <label htmlFor="flight-price" className={labelClass}>
                  Ticket price (COP)
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                    $
                  </span>
                  <input
                    id="flight-price"
                    type="number"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="250000"
                    min="0"
                    step="0.01"
                    className={`${inputClass} pl-9`}
                    required
                  />
                </div>

                {price !== "" && Number(price) >= 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    Preview: {formatPrice(Number(price))}
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingFlight ? (
                        <Pencil size={16} />
                      ) : (
                        <Plus size={17} />
                      )}
                      {editingFlight ? "Save changes" : "Create flight"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {showConfirmation && (
        <ConfirmationModal
          message="Are you sure you want to delete this flight?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default Flights;