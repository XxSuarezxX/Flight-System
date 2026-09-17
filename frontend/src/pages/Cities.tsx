import { useEffect, useState } from "react";
import axios from "axios";

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
            Cities
          </h1>

          <p className="text-slate-500 mt-2">
            Manage the cities available in the flight system.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium
                     hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Add City
        </button>

      </div>

      {/* Cities table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-800">
            City List
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {cities.length}{" "}
            {cities.length === 1 ? "city" : "cities"} registered
          </p>

        </div>

        {cities.length === 0 ? (

          <div className="px-6 py-16 text-center">

            <p className="text-slate-500">
              No cities have been registered yet.
            </p>

            <button
              onClick={openCreateForm}
              className="mt-4 text-blue-600 font-medium hover:text-blue-700"
            >
              Add your first city
            </button>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    City
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Country
                  </th>

                  <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {cities.map((city) => (

                  <tr
                    key={city.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                  >

                    <td className="px-6 py-4">

                      <div className="font-medium text-slate-800">
                        {city.name}
                      </div>

                    </td>

                    <td className="px-6 py-4">

                      <span className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {getCountryName(city.country_id)}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-right">

                      <button
                        onClick={() => openEditForm(city)}
                        className="text-blue-600 font-medium hover:text-blue-800 mr-5 transition-colors"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(city.id)}
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

      {/* City form modal */}
      {showForm && (

        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

              <div>

                <h2 className="text-xl font-semibold text-slate-800">
                  {editingCity ? "Edit City" : "Add City"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {editingCity
                    ? "Update the city information."
                    : "Register a new city in the system."}
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
                  City Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Bogotá"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3
                             text-slate-800 placeholder:text-slate-400
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-blue-500"
                  required
                />

              </div>

              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Country
                </label>

                <select
                  value={countryId}
                  onChange={(event) => setCountryId(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3
                             text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-blue-500"
                  required
                >

                  <option value="">
                    Select a country
                  </option>

                  {countries.map((country) => (

                    <option
                      key={country.id}
                      value={country.id}
                    >
                      {country.name}
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
                  {editingCity ? "Save Changes" : "Create City"}
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