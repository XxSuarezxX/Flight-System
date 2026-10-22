import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Globe2,
  Building2,
  ChevronDown,
} from "lucide-react";

import {
  getCities,
  createCity,
  updateCity,
  deleteCity,
} from "../api/cities";

import type { City } from "../api/cities";

import { getCountries } from "../api/countries";
import type { Country } from "../api/countries";

import Notification from "../components/Notification";
import ConfirmationModal from "../components/ConfirmationModal";

function Cities() {
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);

  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      const [citiesData, countriesData] = await Promise.all([
        getCities(),
        getCountries(),
      ]);

      setCities(citiesData);
      setCountries(countriesData);
    } catch (error) {
      console.error("Error loading cities:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateForm = () => {
    setEditingCity(null);
    setName("");
    setCountryId("");
    setShowForm(true);
  };

  const openEditForm = (city: City) => {
    setEditingCity(city);
    setName(city.name);
    setCountryId(city.country_id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCity(null);
    setName("");
    setCountryId("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      if (editingCity) {
        await updateCity(editingCity.id, {
          name,
          country_id: countryId,
        });
      } else {
        await createCity({
          name,
          country_id: countryId,
        });
      }

      closeForm();
      await loadData();
    } catch (error) {
      console.error("Error saving city:", error);
      setNotification("Could not save city.");
    }
  };

  const handleDelete = (cityId: string) => {
    setItemToDelete(cityId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) {
      return;
    }

    try {
      await deleteCity(itemToDelete);
      await loadData();
    } catch (error) {
      console.error("Error deleting city:", error);

      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setNotification(error.response.data.detail);
      } else {
        setNotification("Could not delete city.");
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

  const getCountryName = (countryId: string) => {
    const country = countries.find(
      (country) => country.id === countryId
    );

    return country ? country.name : "Unknown";
  };

  const filteredCities = cities.filter((city) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      city.name.toLowerCase().includes(search) ||
      getCountryName(city.country_id).toLowerCase().includes(search)
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
                <Globe2 size={16} />
                <span>Flight management</span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-300">Cities</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Cities
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Manage cities and organize the geographical locations
                available in your flight system.
              </p>
            </div>

            <button
              onClick={openCreateForm}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
            >
              <Plus size={18} />
              Add city
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MapPin size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Registered cities
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {cities.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
              <Globe2 size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Available countries
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {countries.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Countries with cities
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {new Set(cities.map((city) => city.country_id)).size}
              </p>
            </div>
          </div>
        </div>

        {/* City directory */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                City directory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredCities.length}{" "}
                {filteredCities.length === 1 ? "city" : "cities"} found
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
                placeholder="Search cities or countries..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {cities.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                <MapPin size={30} />
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-800">
                No cities registered
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Start building your location directory by registering
                the first city.
              </p>

              <button
                onClick={openCreateForm}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={16} />
                Add first city
              </button>
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Search size={28} className="mx-auto text-slate-300" />
              <p className="mt-3 font-semibold text-slate-700">
                No matching cities
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try another city or country name.
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
              <table className="w-full min-w-[620px]">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      City
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Country
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCities.map((city) => (
                    <tr
                      key={city.id}
                      className="group transition-colors hover:bg-blue-50/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 transition group-hover:from-blue-100 group-hover:to-indigo-100">
                            <MapPin size={19} />
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800">
                              {city.name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              City location
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
                          <Globe2 size={15} className="text-blue-500" />
                          {getCountryName(city.country_id)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditForm(city)}
                            title="Edit city"
                            aria-label={`Edit ${city.name}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Pencil size={15} />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDelete(city.id)}
                            title="Delete city"
                            aria-label={`Delete ${city.name}`}
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

          {cities.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {filteredCities.length} of {cities.length} cities
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                City directory
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
                    {editingCity ? (
                      <Pencil size={21} />
                    ) : (
                      <MapPin size={22} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingCity ? "Edit city" : "Add city"}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-300">
                      {editingCity
                        ? "Update the city's registration details."
                        : "Enter the details to register a new city."}
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
                <label className={labelClasses}>City name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Bogotá"
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Associated country</label>

                <div className="relative">
                  <Globe2
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={countryId}
                    onChange={(event) => setCountryId(event.target.value)}
                    className={`${inputClasses} appearance-none pl-10 pr-10`}
                    required
                  >
                    <option value="">Select a country</option>

                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Select the country where this city is located.
                </p>
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
                  {editingCity ? (
                    <>
                      <Pencil size={16} />
                      Save changes
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Create city
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
          message="Are you sure you want to delete this city?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default Cities;