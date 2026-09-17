import { useEffect, useState } from "react";
import axios from "axios";

import {
  getAirports,
  createAirport,
  updateAirport,
  deleteAirport,
} from "../api/airports";

import type { Airport } from "../api/airports";

import { getCities } from "../api/cities";
import type { City } from "../api/cities";

import Notification from "../components/Notification";
import ConfirmationModal from "../components/ConfirmationModal";

function Airports() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingAirport, setEditingAirport] = useState<Airport | null>(null);

  const [name, setName] = useState("");
  const [iataCode, setIataCode] = useState("");
  const [icaoCode, setIcaoCode] = useState("");
  const [cityId, setCityId] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [airportsData, citiesData] = await Promise.all([
        getAirports(),
        getCities(),
      ]);

      setAirports(airportsData);
      setCities(citiesData);
    } catch (error) {
      console.error("Error loading airports:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateForm = () => {
    setEditingAirport(null);
    setName("");
    setIataCode("");
    setIcaoCode("");
    setCityId("");
    setShowForm(true);
  };

  const openEditForm = (airport: Airport) => {
    setEditingAirport(airport);
    setName(airport.name);
    setIataCode(airport.iata_code);
    setIcaoCode(airport.icao_code);
    setCityId(airport.city_id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAirport(null);
    setName("");
    setIataCode("");
    setIcaoCode("");
    setCityId("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const data = {
        name,
        iata_code: iataCode,
        icao_code: icaoCode,
        city_id: cityId,
      };

      if (editingAirport) {
        await updateAirport(editingAirport.id, data);
      } else {
        await createAirport(data);
      }

      closeForm();
      await loadData();
    } catch (error) {
      console.error("Error saving airport:", error);

      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setNotification(error.response.data.detail);
        return;
      }

      setNotification("Could not save airport.");
    }
  };

  const handleDelete = (airportId: string) => {
    setItemToDelete(airportId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) {
      return;
    }

    try {
      await deleteAirport(itemToDelete);
      await loadData();
    } catch (error) {
      console.error("Error deleting airport:", error);

      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setNotification(error.response.data.detail);
      } else {
        setNotification("Could not delete airport.");
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

  const getCityName = (cityId: string) => {
    const city = cities.find((city) => city.id === cityId);

    return city ? city.name : "Unknown";
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
            Airports
          </h1>

          <p className="text-slate-500 mt-2">
            Manage the airports available in the flight system.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium
                     hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Add Airport
        </button>

      </div>

      {/* Airports table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-800">
            Airport List
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {airports.length}{" "}
            {airports.length === 1 ? "airport" : "airports"} registered
          </p>

        </div>

        {airports.length === 0 ? (

          <div className="px-6 py-16 text-center">

            <p className="text-slate-500">
              No airports have been registered yet.
            </p>

            <button
              onClick={openCreateForm}
              className="mt-4 text-blue-600 font-medium hover:text-blue-700"
            >
              Add your first airport
            </button>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Airport
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    IATA
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    ICAO
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    City
                  </th>

                  <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {airports.map((airport) => (

                  <tr
                    key={airport.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                  >

                    <td className="px-6 py-4">

                      <div className="font-medium text-slate-800">
                        {airport.name}
                      </div>

                    </td>

                    <td className="px-6 py-4">

                      <span className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {airport.iata_code}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <span className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {airport.icao_code}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <span className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {getCityName(airport.city_id)}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-right">

                      <button
                        onClick={() => openEditForm(airport)}
                        className="text-blue-600 font-medium hover:text-blue-800 mr-5 transition-colors"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(airport.id)}
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

      {/* Airport form modal */}
      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

              <div>

                <h2 className="text-xl font-semibold text-slate-800">
                  {editingAirport ? "Edit Airport" : "Add Airport"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {editingAirport
                    ? "Update the airport information."
                    : "Register a new airport in the system."}
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
                  Airport Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. El Dorado International Airport"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3
                             text-slate-800 placeholder:text-slate-400
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-blue-500"
                  required
                />

              </div>

              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  IATA Code
                </label>

                <input
                  type="text"
                  value={iataCode}
                  onChange={(event) => setIataCode(event.target.value)}
                  placeholder="e.g. BOG"
                  maxLength={3}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3
                             text-slate-800 placeholder:text-slate-400
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-blue-500"
                  required
                />

              </div>

              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  ICAO Code
                </label>

                <input
                  type="text"
                  value={icaoCode}
                  onChange={(event) => setIcaoCode(event.target.value)}
                  placeholder="e.g. SKBO"
                  maxLength={4}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3
                             text-slate-800 placeholder:text-slate-400
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-blue-500"
                  required
                />

              </div>

              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  City
                </label>

                <select
                  value={cityId}
                  onChange={(event) => setCityId(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3
                             text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-blue-500"
                  required
                >

                  <option value="">
                    Select a city
                  </option>

                  {cities.map((city) => (

                    <option
                      key={city.id}
                      value={city.id}
                    >
                      {city.name}
                    </option>

                  ))}

                </select>

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
                  {editingAirport ? "Save Changes" : "Create Airport"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Delete confirmation */}
      {showConfirmation && (
        <ConfirmationModal
          message="Are you sure you want to delete this airport?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

    </div>
  );
}

export default Airports;