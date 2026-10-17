import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Save,
  X,
  Plane,
  CalendarDays,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Ban,
  RefreshCw,
  Wallet,
  Ticket,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getAirports, type Airport } from "../api/airports";

import Navbar from "../components/Navbar";
import {
  getCustomerProfile,
  updateCustomerProfile,
} from "../api/customer";
import type { CustomerProfile } from "../api/customer";
import {
  getUserReservations,
  getReservationDetails,
  cancelReservation,
} from "../api/reservations";
import type {
  Reservation,
  ReservationDetails,
} from "../api/reservations";

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 2,
  }).format(value);
}

function getStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Pendiente";
    case "CONFIRMED":
      return "Confirmada";
    case "CANCELLED":
      return "Cancelada";
    default:
      return status;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800";
    case "CONFIRMED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [airports, setAirports] = useState<Airport[]>([]);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [reservationError, setReservationError] = useState("");
  const [reservationSuccess, setReservationSuccess] = useState("");

  const [reservationsExpanded, setReservationsExpanded] = useState(true);
  const [expandedReservationId, setExpandedReservationId] = useState<
    string | null
  >(null);

  const [reservationDetails, setReservationDetails] =
    useState<ReservationDetails | null>(null);
  const [loadingDetailsId, setLoadingDetailsId] = useState<string | null>(
    null
  );
  const [detailsError, setDetailsError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const editing = searchParams.get("edit") === "true";

  const getAirportLabel = (airportId: string) => {
    const airport = airports.find((item) => item.id === airportId);

    if (!airport) {
      return airportId;
    }

    return `${airport.iata_code} - ${airport.name}`;
  };

  const loadReservations = async () => {
    setLoadingReservations(true);

    try {
      setReservationError("");
      const data = await getUserReservations();
      setReservations(data);
    } catch (err) {
      console.error("Error loading reservations:", err);
      setReservationError("No se pudieron cargar tus reservas.");
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getCustomerProfile();

        setProfile(data);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPhoneNumber(data.phone_number ?? "");
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("No se pudo cargar la información del perfil.");
      } finally {
        setLoading(false);
      }
    };

    const loadAirports = async () => {
      try {
        const data = await getAirports();
        setAirports(data);
      } catch (err) {
        console.error("Error loading airports:", err);
      }
    };

    void loadProfile();
    void loadAirports();
    void loadReservations();
  }, []);

  const handleCancel = () => {
    if (!profile) return;

    setFirstName(profile.first_name);
    setLastName(profile.last_name);
    setPhoneNumber(profile.phone_number ?? "");

    setError("");
    setSuccess("");
    setSearchParams({});
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("El nombre y el apellido son obligatorios.");
      return;
    }

    try {
      setSaving(true);

      const updatedProfile = await updateCustomerProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phoneNumber.trim() || null,
      });

      setProfile(updatedProfile);
      setFirstName(updatedProfile.first_name);
      setLastName(updatedProfile.last_name);
      setPhoneNumber(updatedProfile.phone_number ?? "");

      setSearchParams({});
      setSuccess("Perfil actualizado correctamente.");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleReservation = async (reservationId: string) => {
    if (expandedReservationId === reservationId) {
      setExpandedReservationId(null);
      setDetailsError("");
      return;
    }

    setExpandedReservationId(reservationId);
    setReservationDetails(null);
    setDetailsError("");
    setLoadingDetailsId(reservationId);

    try {
      const details = await getReservationDetails(reservationId);
      setReservationDetails(details);
    } catch (err) {
      console.error("Error loading reservation details:", err);
      setDetailsError("No se pudieron cargar los detalles de esta reserva.");
    } finally {
      setLoadingDetailsId(null);
    }
  };

  const handleCancelReservation = async (reservation: Reservation) => {
    if (reservation.status !== "PENDING") return;

    const confirmed = window.confirm(
      "¿Estás seguro de que deseas cancelar esta reserva?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(reservation.id);
      setReservationError("");
      setReservationSuccess("");

      const updatedReservation = await cancelReservation(reservation.id);

      setReservations((current) =>
        current.map((item) =>
          item.id === updatedReservation.id ? updatedReservation : item
        )
      );

      setReservationDetails((current) =>
        current?.id === updatedReservation.id
          ? { ...current, status: updatedReservation.status }
          : current
      );

      setReservationSuccess("La reserva se canceló correctamente.");
    } catch (err: any) {
      console.error("Error cancelling reservation:", err);

      const detail = err.response?.data?.detail;
      setReservationError(
        typeof detail === "string"
          ? detail
          : "No se pudo cancelar la reserva."
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-gray-50">
          <p className="text-gray-500">Cargando perfil...</p>
        </main>
      </>
    );
  }

  if (error && !profile) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-gray-50">
          <p className="text-red-600">{error}</p>
        </main>
      </>
    );
  }

  if (!profile) return null;

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-72px)] bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mi perfil</h1>
            <p className="mt-2 text-gray-500">
              {editing
                ? "Actualiza tu información personal."
                : "Consulta tu información personal."}
            </p>
          </div>

          {success && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Perfil del usuario */}
          <section className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <User className="h-8 w-8 text-blue-600" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-sm text-gray-500">Cliente</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    Nombre
                  </span>
                </div>

                {editing ? (
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                ) : (
                  <p className="text-gray-900">{profile.first_name}</p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    Apellido
                  </span>
                </div>

                {editing ? (
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                ) : (
                  <p className="text-gray-900">{profile.last_name}</p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    Correo electrónico
                  </span>
                </div>

                <p className="text-gray-900">{profile.email}</p>

                {editing && (
                  <p className="mt-1 text-xs text-gray-400">
                    El correo electrónico no se puede modificar.
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    Teléfono
                  </span>
                </div>

                {editing ? (
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    placeholder="Número de teléfono"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                ) : (
                  <p className="text-gray-900">
                    {profile.phone_number || "No registrado"}
                  </p>
                )}
              </div>
            </div>

            {editing && (
              <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            )}
          </section>

          {/* Acordeón general de reservas */}
          <section className="mt-10 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setReservationsExpanded((current) => !current)}
              aria-expanded={reservationsExpanded}
              className="flex w-full items-center justify-between gap-4 p-6 text-left transition hover:bg-gray-50 sm:p-8"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Plane size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Mis reservas
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {loadingReservations
                      ? "Cargando reservas..."
                      : `${reservations.length} ${
                          reservations.length === 1
                            ? "reserva registrada"
                            : "reservas registradas"
                        }`}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    void loadReservations();
                  }}
                  disabled={loadingReservations}
                  aria-label="Actualizar reservas"
                  className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-white hover:text-blue-600 disabled:opacity-50"
                >
                  <RefreshCw
                    size={17}
                    className={loadingReservations ? "animate-spin" : ""}
                  />
                </button>

                {reservationsExpanded ? (
                  <ChevronUp className="text-gray-400" />
                ) : (
                  <ChevronDown className="text-gray-400" />
                )}
              </div>
            </button>

            {reservationsExpanded && (
              <div className="border-t border-gray-100 p-4 sm:p-6">
                {reservationSuccess && (
                  <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {reservationSuccess}
                  </div>
                )}

                {reservationError && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {reservationError}
                  </div>
                )}

                {loadingReservations ? (
                  <p className="py-8 text-center text-sm text-gray-500">
                    Cargando tus reservas...
                  </p>
                ) : reservations.length === 0 && !reservationError ? (
                  <div className="py-10 text-center">
                    <Plane className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 font-semibold text-gray-800">
                      Todavía no tienes reservas
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Cuando reserves un vuelo, aparecerá aquí.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reservations.map((reservation, index) => {
                      const isExpanded =
                        expandedReservationId === reservation.id;
                      const isLoadingDetails =
                        loadingDetailsId === reservation.id;
                      const details =
                        reservationDetails?.id === reservation.id
                          ? reservationDetails
                          : null;

                      return (
                        <article
                          key={reservation.id}
                          className={`overflow-hidden rounded-xl border transition ${
                            isExpanded
                              ? "border-blue-200 bg-white"
                              : "border-gray-200 bg-gray-50/70"
                          }`}
                        >
                          {/* Fila compacta de cada reserva */}
                          <button
                            type="button"
                            onClick={() =>
                              void handleToggleReservation(reservation.id)
                            }
                            aria-expanded={isExpanded}
                            className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-blue-50/40 sm:gap-4 sm:p-5"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                              <Ticket size={20} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-gray-900">
                                  Reserva {index + 1}
                                </h3>
                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                    reservation.status
                                  )}`}
                                >
                                  {getStatusLabel(reservation.status)}
                                </span>
                              </div>

                              <p className="mt-1 truncate text-xs text-gray-500">
                                Código: {reservation.id}
                              </p>

                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                <span className="inline-flex items-center gap-1">
                                  <CalendarDays size={13} />
                                  {formatDate(reservation.created_at)}
                                </span>
                                <span className="inline-flex items-center gap-1 font-medium text-gray-700">
                                  <Wallet size={13} />
                                  {formatPrice(reservation.price)}
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0 text-gray-400">
                              {isExpanded ? (
                                <ChevronUp size={20} />
                              ) : (
                                <ChevronDown size={20} />
                              )}
                            </div>
                          </button>

                          {/* Detalles de la reserva seleccionada */}
                          {isExpanded && (
                            <div className="border-t border-gray-100 p-4 sm:p-5">
                              {isLoadingDetails ? (
                                <p className="py-5 text-center text-sm text-gray-500">
                                  Cargando detalles...
                                </p>
                              ) : details ? (
                                <>
                                  <h4 className="font-semibold text-gray-900">
                                    Información del vuelo
                                  </h4>

                                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Número de vuelo
                                      </p>
                                      <p className="mt-1 font-medium text-gray-800">
                                        {details.flight.flight_number}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Precio por pasajero
                                      </p>
                                      <p className="mt-1 font-medium text-gray-800">
                                        {formatPrice(details.flight.price)}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Aeropuerto de origen
                                      </p>
                                      <p className="mt-1 text-sm font-medium text-gray-800">
                                        {getAirportLabel(
                                          details.flight.origin_airport_id
                                        )}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Aeropuerto de destino
                                      </p>
                                      <p className="mt-1 text-sm font-medium text-gray-800">
                                        {getAirportLabel(
                                          details.flight.destination_airport_id
                                        )}
                                      </p>
                                    </div>

                                    <div>
                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock size={15} />
                                        Salida
                                      </div>
                                      <p className="mt-1 text-sm font-medium text-gray-800">
                                        {formatDate(
                                          details.flight.departure_at
                                        )}
                                      </p>
                                    </div>

                                    <div>
                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock size={15} />
                                        Llegada
                                      </div>
                                      <p className="mt-1 text-sm font-medium text-gray-800">
                                        {formatDate(details.flight.arrival_at)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="mt-6 border-t border-gray-100 pt-5">
                                    <h4 className="font-semibold text-gray-900">
                                      Pasajeros ({details.passengers.length})
                                    </h4>

                                    <div className="mt-3 space-y-3">
                                      {details.passengers.map((passenger) => (
                                        <div
                                          key={passenger.id}
                                          className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                                        >
                                          <div className="flex items-start gap-3">
                                            <Users
                                              size={18}
                                              className="mt-0.5 text-gray-400"
                                            />
                                            <div>
                                              <p className="font-medium text-gray-800">
                                                {passenger.first_name}{" "}
                                                {passenger.last_name}
                                              </p>
                                              <p className="mt-1 text-sm text-gray-500">
                                                Documento:{" "}
                                                {passenger.identification}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {reservation.status === "PENDING" && (
                                    <div className="mt-5 border-t border-gray-100 pt-5">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          void handleCancelReservation(
                                            reservation
                                          )
                                        }
                                        disabled={
                                          cancellingId === reservation.id
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                      >
                                        <Ban size={16} />
                                        {cancellingId === reservation.id
                                          ? "Cancelando..."
                                          : "Cancelar reserva"}
                                      </button>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="py-3">
                                  <p className="text-sm text-red-600">
                                    {detailsError ||
                                      "No se pudieron cargar los detalles."}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      void handleToggleReservation(
                                        reservation.id
                                      )
                                    }
                                    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                                  >
                                    Intentar de nuevo
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default Profile;
