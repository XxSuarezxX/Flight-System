import { useEffect, useState } from "react";
import axios from "axios";
import {
  Globe2,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  MapPin,
  Plane,
  Hash,
} from "lucide-react";

import {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
} from "../api/countries";

import type { Country } from "../api/countries";
import Notification from "../components/Notification";
import ConfirmationModal from "../components/ConfirmationModal";

function Countries() {
  const [countries, setCountries] = useState<Country[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  const [name, setName] = useState("");
  const [isoCode, setIsoCode] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadCountries = async () => {
    try {
      const data = await getCountries();
      setCountries(data);
    } catch (error) {
      console.error("Error loading countries:", error);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const openCreateForm = () => {
    setEditingCountry(null);
    setName("");
    setIsoCode("");
    setShowForm(true);
  };

  const openEditForm = (country: Country) => {
    setEditingCountry(country);
    setName(country.name);
    setIsoCode(country.iso_code);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCountry(null);
    setName("");
    setIsoCode("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      if (editingCountry) {
        await updateCountry(editingCountry.id, {
          name,
          iso_code: isoCode,
        });
      } else {
        await createCountry({
          name,
          iso_code: isoCode,
        });
      }

      closeForm();
      await loadCountries();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail ||
          "Unable to save the country.";

        setNotification(message);
      } else {
        setNotification("Unable to save the country.");
      }
    }
  };

  const handleDelete = (countryId: string) => {
    setItemToDelete(countryId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) {
      return;
    }

    try {
      await deleteCountry(itemToDelete);
      await loadCountries();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail ||
          "Unable to delete the country.";

        setNotification(message);
      } else {
        setNotification("Unable to delete the country.");
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

  const filteredCountries = countries.filter((country) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      country.name.toLowerCase().includes(search) ||
      country.iso_code.toLowerCase().includes(search)
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
                <span className="text-slate-300">Countries</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Countries
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Manage the countries available in your flight system and
                organize your geographical directory.
              </p>
            </div>

            <button
              onClick={openCreateForm}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
            >
              <Plus size={18} />
              Add country
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Globe2 size={22} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Registered countries
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {countries.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
              <MapPin size={22} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Countries directory
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {countries.length === 0 ? "—" : "Active"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Plane size={22} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Available for locations
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {countries.length}
              </p>
            </div>
          </div>
        </div>

        {/* Countries directory */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Countries directory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredCountries.length}{" "}
                {filteredCountries.length === 1 ? "country" : "countries"} found
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
                placeholder="Search countries or ISO codes..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {countries.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                <Globe2 size={30} />
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-800">
                No countries registered
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Start building your geographical directory by registering
                the first country.
              </p>

              <button
                onClick={openCreateForm}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={16} />
                Add first country
              </button>
            </div>
          ) : filteredCountries.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Search size={28} className="mx-auto text-slate-300" />

              <p className="mt-3 font-semibold text-slate-700">
                No matching countries
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try another country name or ISO code.
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
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Country
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      ISO code
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCountries.map((country) => (
                    <tr
                      key={country.id}
                      className="group transition-colors hover:bg-blue-50/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 transition group-hover:from-blue-100 group-hover:to-indigo-100">
                            <Globe2 size={19} />
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800">
                              {country.name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              Registered country
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 font-mono text-sm font-bold tracking-widest text-blue-700">
                          <Hash size={14} />
                          {country.iso_code}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditForm(country)}
                            title="Edit country"
                            aria-label={`Edit ${country.name}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Pencil size={15} />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDelete(country.id)}
                            title="Delete country"
                            aria-label={`Delete ${country.name}`}
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

          {countries.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {filteredCountries.length} of {countries.length} countries
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Countries directory
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
                    {editingCountry ? (
                      <Pencil size={21} />
                    ) : (
                      <Globe2 size={22} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingCountry ? "Edit country" : "Add country"}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-300">
                      {editingCountry
                        ? "Update the country's registration details."
                        : "Enter the details to register a new country."}
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
                <label className={labelClasses}>Country name</label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Colombia"
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>ISO code</label>

                <input
                  type="text"
                  value={isoCode}
                  onChange={(event) =>
                    setIsoCode(event.target.value.toUpperCase())
                  }
                  placeholder="e.g. CO"
                  maxLength={3}
                  className={`${inputClasses} font-mono uppercase tracking-widest`}
                  required
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Enter the country's ISO code.
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
                  {editingCountry ? (
                    <>
                      <Pencil size={16} />
                      Save changes
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Create country
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
          message="Are you sure you want to delete this country?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default Countries;