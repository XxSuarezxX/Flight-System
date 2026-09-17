import { useEffect, useState } from "react";
import axios from "axios";

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

    try {
      const data = {
        flight_number: flightNumber,
        origin_airport_id: originAirportId,
        destination_airport_id: destinationAirportId,
        departure_at: departureAt,
        arrival_at: arrivalAt,
        price: Number(price),
      };

      if (editingFlight) {
        await updateFlight(editingFlight.id, data);
      } else {
        await createFlight(data);
      }

      closeForm();
      await loadData();
    } catch (error) {
      console.error("Error saving flight:", error);

      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setNotification(error.response.data.detail);
        return;
      }

      setNotification("Could not save flight.");
    }
  };

  const handleDelete = (flightId: string) => {
    setItemToDelete(flightId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) {
      return;
    }

    try {
      await deleteFlight(itemToDelete);
      await loadData();
    } catch (error) {
      console.error("Error deleting flight:", error);

      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setNotification(error.response.data.detail);
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

  const getAirportName = (airportId: string) => {
    const airport = airports.find(
      (airport) => airport.id === airportId
    );

    return airport ? airport.name : "Unknown";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">

      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Flights
          </h1>

          <p className="text-slate-500 mt-2">
            Manage the flights available in the flight system.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium
                     hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Add Flight
        </button>

      </div>

      {/* Flights table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-800">
            Flight List
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {flights.length}{" "}
            {flights.length === 1 ? "flight" : "flights"} registered
          </p>

        </div>

        {flights.length === 0 ? (

          <div className="px-6 py-16 text-center">

            <p className="text-slate-500">
              No flights have been registered yet.
            </p>

            <button
              onClick={openCreateForm}
              className="mt-4 text-blue-600 font-medium hover:text-blue-700"
            >
              Add your first flight
            </button>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Flight
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Origin
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Destination
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Departure
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Price
                  </th>

                  <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {flights.map((flight) => (

                  <tr
                    key={flight.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                  >

                    <td className="px-6 py-4">

                      <div className="font-medium text-slate-800">
                        {flight.flight_number}
                      </div>

                      <div className="text-sm text-slate-500">
                        {flight.status}
                      </div>

                    </td>

                    <td className="px-6 py-4">

                      <span className="text-sm text-slate-700">
                        {getAirportName(flight.origin_airport_id)}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <span className="text-sm text-slate-700">
                        {getAirportName(flight.destination_airport_id)}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <span className="text-sm text-slate-700">
                        {formatDate(flight.departure_at)}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <span className="text-sm font-medium text-slate-700">
                        ${flight.price}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-right">

                      <button
                        onClick={() => openEditForm(flight)}
                        className="text-blue-600 font-medium hover:text-blue-800 mr-5 transition-colors"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(flight.id)}
                        className="text-red-600 font-medium hover:text-red-800 transition-colors"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Flight form modal */}
      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

              <div>

                <h2 className="text-xl font-semibold text-slate-800">
                  {editingFlight ? "Edit Flight" : "Add Flight"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {editingFlight
                    ? "Update the flight information."
                    : "Register a new flight in the system."}
                </p>

              </div>

              <button
                type="button"
                onClick={closeForm}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
              >
                ×
              </button>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Flight Number
                </label>

                <input
                  type="text"
                  value={flightNumber}
                  onChange={(event) => setFlightNumber(event.target.value)}
                  placeholder="e.g. AV123"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3
                             text-slate-800 placeholder:text-slate-400
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-blue-500"
                  required
                />

              </div>

              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Origin Airport
                </label>

                <select
                  value={originAirportId}
                  onChange={(event) => setOriginAirportId(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3
                             text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-blue-500"
                  required
                >

                  <option value="">
                    Select origin airport
                  </option>

                  {airports.map((airport) => (

                    <option
                      key={airport.id}
                      value={airport.id}
                    >
                      {airport.name} ({airport.iata_code})
                    </option>

                  ))}

                </select>

              </div>

              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Destination Airport
                </label>

                <select
                  value={destinationAirportId}
                  onChange={(event) =>
                    setDestinationAirportId(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3
                             text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-blue-500"
                  required
                >

                  <option value="">
                    Select destination airport
                  </option>

                  {airports.map((airport) => (

                    <option
                      key={airport.id}
                      value={airport.id}
                    >
                      {airport.name} ({airport.iata_code})
                    </option>

                  ))}

                </select>

              </div>

              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Departure
                </label>

                <input
                  type="datetime-local"
                  value={departureAt}
                  onChange={(event) => setDepartureAt(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3
                             text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-blue-500"
                  required
                />

              </div>

              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Arrival
                </label>

                <input
                  type="datetime-local"
                  value={arrivalAt}
                  onChange={(event) => setArrivalAt(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3
                             text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-blue-500"
                  required
                />

              </div>

              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Price
                </label>

                <input
                  type="number"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="e.g. 250000"
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3
                             text-slate-800 placeholder:text-slate-400
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-blue-500"
                  required
                />

              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-3 rounded-lg bg-slate-100 text-slate-700
                             font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-lg bg-blue-600 text-white
                             font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {editingFlight ? "Save Changes" : "Create Flight"}
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