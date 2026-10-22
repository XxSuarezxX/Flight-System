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
  ShieldCheck,
  ArrowRight,
  Pencil,
  MapPin,
  CheckCircle2,
  CircleAlert,
  Luggage,
  CircleUserRound,
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
    maximumFractionDigits: 0,
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
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "CONFIRMED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getInitials(firstName: string, lastName: string) {
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);

  return `${first}${last}`.toUpperCase() || "U";
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
  const [loadingDetailsId, setLoadingDetailsId] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const editing = searchParams.get("edit") === "true";

  const getAirportLabel = (airportId: string) => {
    const airport = airports.find((item) => item.id === airportId);

    if (!airport) {
      return airportId;
    }

    return `${airport.iata_code} · ${airport.name}`;
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
      setSuccess("Tu perfil se actualizó correctamente.");
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
      "¿Estás seguro de que deseas cancelar esta reserva?",
    );

    if (!confirmed) return;

    try {
      setCancellingId(reservation.id);
      setReservationError("");
      setReservationSuccess("");

      const updatedReservation = await cancelReservation(reservation.id);

      setReservations((current) =>
        current.map((item) =>
          item.id === updatedReservation.id ? updatedReservation : item,
        ),
      );

      setReservationDetails((current) =>
        current?.id === updatedReservation.id
          ? { ...current, status: updatedReservation.status }
          : current,
      );

      setReservationSuccess("La reserva se canceló correctamente.");
    } catch (err: any) {
      console.error("Error cancelling reservation:", err);

      const detail = err.response?.data?.detail;
      setReservationError(
        typeof detail === "string"
          ? detail
          : "No se pudo cancelar la reserva.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  const pendingReservations = reservations.filter(
    (reservation) => reservation.status === "PENDING",
  ).length;

  const confirmedReservations = reservations.filter(
    (reservation) => reservation.status === "CONFIRMED",
  ).length;

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
              <Plane className="h-7 w-7 animate-pulse text-blue-700" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              Preparando tu espacio personal...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (error && !profile) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-4">
          <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <CircleAlert className="mx-auto h-10 w-10 text-red-500" />
            <h1 className="mt-4 text-xl font-bold text-slate-900">
              No pudimos cargar tu perfil
            </h1>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Intentar de nuevo
            </button>
          </div>
        </main>
      </>
    );
  }

  if (!profile) return null;

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-72px)] bg-slate-50 pb-16">
        {/* Cabecera de la página */}
        <section className="relative overflow-hidden bg-slate-950">
          <div className="absolute -right-24 -top-36 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-blue-200">
                  <ShieldCheck size={14} />
                  Tu espacio personal
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Hola, {profile.first_name}
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  Administra tu información y consulta todos los detalles de
                  tus viajes desde un solo lugar.
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm sm:min-w-72">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-xl font-bold text-white shadow-lg shadow-blue-950/30">
                  {getInitials(profile.first_name, profile.last_name)}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-300">
                    {profile.email}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-cyan-300">
                    <CircleUserRound size={13} />
                    Cuenta de cliente
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Resumen */}
          <section className="-mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Ticket size={21} />
                </div>
                <span className="text-xs font-medium text-slate-400">
                  Actividad
                </span>
              </div>
              <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {loadingReservations ? "—" : reservations.length}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Reservas registradas
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <Clock size={21} />
                </div>
                <span className="text-xs font-medium text-slate-400">
                  Por gestionar
                </span>
              </div>
              <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {loadingReservations ? "—" : pendingReservations}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Reservas pendientes
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <CheckCircle2 size={21} />
                </div>
                <span className="text-xs font-medium text-slate-400">
                  Estado
                </span>
              </div>
              <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {loadingReservations ? "—" : confirmedReservations}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Reservas confirmadas
              </p>
            </article>
          </section>

          {/* Mensajes del perfil */}
          {success && (
            <div
              role="status"
              className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{success}</p>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
            >
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Información personal */}
          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <User size={21} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Información personal
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Tus datos de contacto y de cuenta
                  </p>
                </div>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setSearchParams({ edit: "true" });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Pencil size={15} />
                  Editar perfil
                </button>
              )}
            </div>

            <div className="p-5 sm:p-7">
              {editing && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                  <Pencil className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Editando tu información
                    </p>
                    <p className="mt-1 text-sm leading-5 text-blue-800/80">
                      Actualiza tus datos y guarda los cambios cuando termines.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-first-name"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600"
                  >
                    <User size={15} className="text-slate-400" />
                    Nombre
                  </label>
                  {editing ? (
                    <input
                      id="profile-first-name"
                      type="text"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  ) : (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {profile.first_name}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="profile-last-name"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600"
                  >
                    <User size={15} className="text-slate-400" />
                    Apellido
                  </label>
                  {editing ? (
                    <input
                      id="profile-last-name"
                      type="text"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  ) : (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {profile.last_name}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Mail size={15} className="text-slate-400" />
                    Correo electrónico
                  </label>
                  <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                    <p className="min-w-0 flex-1 break-all text-sm font-medium text-slate-700">
                      {profile.email}
                    </p>
                    <ShieldCheck
                      size={17}
                      className="shrink-0 text-emerald-600"
                    />
                  </div>
                  {editing && (
                    <p className="mt-2 text-xs text-slate-400">
                      El correo electrónico no se puede modificar.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="profile-phone"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600"
                  >
                    <Phone size={15} className="text-slate-400" />
                    Teléfono
                  </label>
                  {editing ? (
                    <input
                      id="profile-phone"
                      type="tel"
                      autoComplete="tel"
                      value={phoneNumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                      placeholder="Ingresa tu número de teléfono"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  ) : (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                      <p
                        className={`text-sm font-semibold ${
                          profile.phone_number
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {profile.phone_number || "No registrado"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {editing && (
                <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={16} />
                    Descartar cambios
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {saving ? "Guardando cambios..." : "Guardar cambios"}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Reservas */}
          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Plane size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Mis reservas
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {loadingReservations
                      ? "Actualizando tus viajes..."
                      : `${reservations.length} ${
                          reservations.length === 1
                            ? "reserva registrada"
                            : "reservas registradas"
                        }`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void loadReservations()}
                  disabled={loadingReservations}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={loadingReservations ? "animate-spin" : ""}
                  />
                  Actualizar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setReservationsExpanded((current) => !current)
                  }
                  aria-expanded={reservationsExpanded}
                  aria-label={
                    reservationsExpanded
                      ? "Contraer reservas"
                      : "Expandir reservas"
                  }
                  className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50"
                >
                  {reservationsExpanded ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              </div>
            </div>

            {reservationsExpanded && (
              <div className="p-4 sm:p-6">
                {reservationSuccess && (
                  <div
                    role="status"
                    className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>{reservationSuccess}</p>
                  </div>
                )}

                {reservationError && (
                  <div
                    role="alert"
                    className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
                  >
                    <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                    <div className="flex-1">
                      <p>{reservationError}</p>
                      <button
                        type="button"
                        onClick={() => void loadReservations()}
                        className="mt-2 font-semibold underline underline-offset-2"
                      >
                        Volver a intentar
                      </button>
                    </div>
                  </div>
                )}

                {loadingReservations ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <RefreshCw className="h-7 w-7 animate-spin text-blue-600" />
                    <p className="mt-4 text-sm text-slate-500">
                      Cargando tus reservas...
                    </p>
                  </div>
                ) : reservations.length === 0 && !reservationError ? (
                  <div className="px-4 py-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Luggage size={29} />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      Tu próxima aventura empieza aquí
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Todavía no tienes reservas. Cuando reserves un vuelo,
                      podrás consultar aquí toda la información de tu viaje.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
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
                          className={`overflow-hidden rounded-2xl border transition-colors ${
                            isExpanded
                              ? "border-blue-200 bg-white shadow-sm"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-start gap-3 p-4 sm:gap-4 sm:p-5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                              <Ticket size={21} />
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                void handleToggleReservation(reservation.id)
                              }
                              aria-expanded={isExpanded}
                              className="min-w-0 flex-1 text-left"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-slate-900">
                                  Reserva #{index + 1}
                                </h3>
                                <span
                                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                    reservation.status,
                                  )}`}
                                >
                                  {getStatusLabel(reservation.status)}
                                </span>
                              </div>

                              <p className="mt-1 break-all text-xs text-slate-400">
                                Código: {reservation.id}
                              </p>

                              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                  <CalendarDays
                                    size={14}
                                    className="shrink-0"
                                  />
                                  {formatDate(reservation.created_at)}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900">
                                  <Wallet
                                    size={15}
                                    className="text-slate-400"
                                  />
                                  {formatPrice(reservation.price)}
                                </span>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void handleToggleReservation(reservation.id)
                              }
                              aria-expanded={isExpanded}
                              aria-label={
                                isExpanded
                                  ? "Ocultar detalles de la reserva"
                                  : "Ver detalles de la reserva"
                              }
                              className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-700"
                            >
                              {isExpanded ? (
                                <ChevronUp size={20} />
                              ) : (
                                <ChevronDown size={20} />
                              )}
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-6">
                              {isLoadingDetails ? (
                                <div className="flex items-center justify-center gap-3 py-8">
                                  <RefreshCw
                                    size={19}
                                    className="animate-spin text-blue-600"
                                  />
                                  <p className="text-sm text-slate-500">
                                    Cargando los detalles del viaje...
                                  </p>
                                </div>
                              ) : details ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Plane
                                      size={18}
                                      className="text-blue-700"
                                    />
                                    <h4 className="font-bold text-slate-900">
                                      Información del vuelo
                                    </h4>
                                  </div>

                                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                      <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                          Número de vuelo
                                        </p>
                                        <p className="mt-1 text-lg font-bold text-slate-900">
                                          {details.flight.flight_number}
                                        </p>
                                      </div>

                                      <span
                                        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                                          reservation.status,
                                        )}`}
                                      >
                                        {getStatusLabel(reservation.status)}
                                      </span>
                                    </div>

                                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                                          <MapPin size={14} />
                                          Aeropuerto de origen
                                        </div>
                                        <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-800">
                                          {getAirportLabel(
                                            details.flight.origin_airport_id,
                                          )}
                                        </p>
                                      </div>

                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                                          <MapPin size={14} />
                                          Aeropuerto de destino
                                        </div>
                                        <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-800">
                                          {getAirportLabel(
                                            details.flight.destination_airport_id,
                                          )}
                                        </p>
                                      </div>

                                      <div>
                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                                          <CalendarDays size={14} />
                                          Fecha de salida
                                        </div>
                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                          {formatDate(
                                            details.flight.departure_at,
                                          )}
                                        </p>
                                      </div>

                                      <div>
                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                                          <Clock size={14} />
                                          Fecha de llegada
                                        </div>
                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                          {formatDate(
                                            details.flight.arrival_at,
                                          )}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                                      <span className="text-sm text-slate-500">
                                        Precio por pasajero
                                      </span>
                                      <span className="text-base font-bold text-slate-900">
                                        {formatPrice(details.flight.price)}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="mt-6">
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-2">
                                        <Users
                                          size={18}
                                          className="text-blue-700"
                                        />
                                        <h4 className="font-bold text-slate-900">
                                          Pasajeros
                                        </h4>
                                      </div>
                                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                                        {details.passengers.length}{" "}
                                        {details.passengers.length === 1
                                          ? "pasajero"
                                          : "pasajeros"}
                                      </span>
                                    </div>

                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                      {details.passengers.map((passenger) => (
                                        <div
                                          key={passenger.id}
                                          className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
                                        >
                                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                            <User size={19} />
                                          </div>
                                          <div className="min-w-0">
                                            <p className="break-words text-sm font-semibold text-slate-900">
                                              {passenger.first_name}{" "}
                                              {passenger.last_name}
                                            </p>
                                            <p className="mt-1 break-words text-xs text-slate-500">
                                              Documento:{" "}
                                              {passenger.identification}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {reservation.status === "PENDING" && (
                                    <div className="mt-6 flex flex-col justify-between gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center">
                                      <p className="max-w-md text-xs leading-5 text-slate-500">
                                        Si ya no necesitas esta reserva, puedes
                                        solicitar su cancelación.
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          void handleCancelReservation(
                                            reservation,
                                          )
                                        }
                                        disabled={
                                          cancellingId === reservation.id
                                        }
                                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                      >
                                        {cancellingId === reservation.id ? (
                                          <RefreshCw
                                            size={16}
                                            className="animate-spin"
                                          />
                                        ) : (
                                          <Ban size={16} />
                                        )}
                                        {cancellingId === reservation.id
                                          ? "Cancelando..."
                                          : "Cancelar reserva"}
                                      </button>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="rounded-xl border border-red-100 bg-white p-5">
                                  <div className="flex items-start gap-3">
                                    <CircleAlert
                                      size={19}
                                      className="mt-0.5 shrink-0 text-red-500"
                                    />
                                    <div>
                                      <p className="text-sm font-medium text-red-700">
                                        {detailsError ||
                                          "No se pudieron cargar los detalles."}
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          void handleToggleReservation(
                                            reservation.id,
                                          )
                                        }
                                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
                                      >
                                        Intentar de nuevo
                                        <ArrowRight size={14} />
                                      </button>
                                    </div>
                                  </div>
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

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={15} />
            Tu información personal se gestiona desde tu cuenta.
          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;