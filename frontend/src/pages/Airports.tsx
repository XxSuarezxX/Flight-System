import { useEffect, useState } from "react";
import axios from "axios";
import { Plane, Plus, Pencil, Trash2, X, MapPin, Search, Building2, Hash, RadioTower } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredAirports = airports.filter((airport) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      airport.name.toLowerCase().includes(search) ||
      airport.iata_code.toLowerCase().includes(search) ||
      airport.icao_code.toLowerCase().includes(search) ||
      getCityName(airport.city_id).toLowerCase().includes(search)
    );
  });

  const inputClasses =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

  const labelClasses =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50/80 p-4 sm:p-6 lg:p-8">
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6 shadow-lg shadow-slate-900/10 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-200">
                <Plane size={16} />
                <span>Flight management</span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-300">Airports</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Airports
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Manage airport information, aviation codes, and their
                associated cities.
              </p>
            </div>

            <button
              onClick={openCreateForm}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
            >
              <Plus size={18} />
              Add airport
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Plane size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Registered airports
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {airports.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Available cities
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {cities.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <MapPin size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Cities with airports
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {new Set(airports.map((airport) => airport.city_id)).size}
              </p>
            </div>
          </div>
        </div>

        {/* Airport list */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Airport directory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredAirports.length}{" "}
                {filteredAirports.length === 1 ? "airport" : "airports"} found
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search airports..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {airports.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                <Plane size={30} />
              </div>
              <h3 className="mt-5 text-base font-semibold text-slate-800">
                No airports registered
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Start building your airport directory by registering the first
                airport.
              </p>
              <button
                onClick={openCreateForm}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={16} />
                Add first airport
              </button>
            </div>
          ) : filteredAirports.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Search size={28} className="mx-auto text-slate-300" />
              <p className="mt-3 font-semibold text-slate-700">
                No matching airports
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try another name, code, or city.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Airport
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      IATA code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      ICAO code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      City
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAirports.map((airport) => (
                    <tr
                      key={airport.id}
                      className="group transition-colors hover:bg-blue-50/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 transition group-hover:from-blue-100 group-hover:to-indigo-100">
                            <Plane size={19} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800">
                              {airport.name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              Airport facility
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 font-mono text-sm font-bold tracking-wide text-blue-700">
                          {airport.iata_code}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-sm font-semibold tracking-wide text-slate-600">
                          {airport.icao_code}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin
                            size={16}
                            className="shrink-0 text-slate-400"
                          />
                          <span>{getCityName(airport.city_id)}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditForm(airport)}
                            title="Edit airport"
                            aria-label={`Edit ${airport.name}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Pencil size={15} />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDelete(airport.id)}
                            title="Delete airport"
                            aria-label={`Delete ${airport.name}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {airports.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {filteredAirports.length} of {airports.length} airports
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Airport directory
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl shadow-slate-950/20">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 px-6 py-6 sm:px-7">
              <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-blue-500/20 blur-2xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-200 ring-1 ring-white/10">
                    {editingAirport ? (
                      <Pencil size={21} />
                    ) : (
                      <Plane size={22} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingAirport ? "Edit airport" : "Add airport"}
                    </h2>
                    <p className="mt-1 text-sm leading-5 text-slate-300">
                      {editingAirport
                        ? "Update the airport's registration details."
                        : "Enter the details to register a new airport."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  aria-label="Close form"
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-7">
              <div>
                <label className={labelClasses}>Airport name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. El Dorado International Airport"
                  className={inputClasses}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClasses}>
                    <span className="inline-flex items-center gap-1.5">
                      <Hash size={14} className="text-blue-500" />
                      IATA code
                    </span>
                  </label>
                  <input
                    type="text"
                    value={iataCode}
                    onChange={(event) =>
                      setIataCode(event.target.value.toUpperCase())
                    }
                    placeholder="BOG"
                    maxLength={3}
                    minLength={3}
                    className={`${inputClasses} font-mono uppercase tracking-widest`}
                    required
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    3-letter airport code
                  </p>
                </div>

                <div>
                  <label className={labelClasses}>
                    <span className="inline-flex items-center gap-1.5">
                      <RadioTower size={14} className="text-blue-500" />
                      ICAO code
                    </span>
                  </label>
                  <input
                    type="text"
                    value={icaoCode}
                    onChange={(event) =>
                      setIcaoCode(event.target.value.toUpperCase())
                    }
                    placeholder="SKBO"
                    maxLength={4}
                    minLength={4}
                    className={`${inputClasses} font-mono uppercase tracking-widest`}
                    required
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    4-letter airport code
                  </p>
                </div>
              </div>

              <div>
                <label className={labelClasses}>Associated city</label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={cityId}
                    onChange={(event) => setCityId(event.target.value)}
                    className={`${inputClasses} appearance-none pl-10`}
                    required
                  >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                >
                  {editingAirport ? (
                    <>
                      <Pencil size={16} />
                      Save changes
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Create airport
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
          message="Are you sure you want to delete this airport?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default Airports;