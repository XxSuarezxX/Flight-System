import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  UserRound,
  Plane,
  CheckCircle2,
  ShieldCheck,
  FileText,
  ArrowRight,
  Users,
} from "lucide-react";
import {
  createReservation,
  type PassengerRequest,
} from "../api/reservations";

interface PassengerForm extends Omit<PassengerRequest, "identification"> {
  identification: number;
}

export default function ReservationForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const flightId = searchParams.get("flight_id");

  const [passengers, setPassengers] = useState<PassengerForm[]>([
    { first_name: "", last_name: "", identification: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const updatePassenger = (
    index: number,
    field: keyof PassengerForm,
    value: string | number
  ) => {
    setPassengers((current) =>
      current.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      )
    );
  };

  const addPassenger = () => {
    setPassengers((current) => [
      ...current,
      { first_name: "", last_name: "", identification: 0 },
    ]);
  };

  const removePassenger = (index: number) => {
    if (passengers.length === 1) return;
    setPassengers((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!flightId) {
      setError("No se encontró el vuelo seleccionado.");
      return;
    }

    const invalidPassenger = passengers.some(
      (passenger) =>
        !passenger.first_name.trim() ||
        !passenger.last_name.trim() ||
        !Number.isInteger(passenger.identification) ||
        passenger.identification <= 0
    );

    if (invalidPassenger) {
      setError("Completa los datos de todos los pasajeros correctamente.");
      return;
    }

    try {
      setLoading(true);

      await createReservation({
        flight_id: flightId,
        passengers: passengers.map((passenger) => ({
          first_name: passenger.first_name.trim(),
          last_name: passenger.last_name.trim(),
          identification: Number(passenger.identification),
        })),
      });

      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "No fue posible crear la reserva. Inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!flightId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
            <Plane className="h-8 w-8 text-blue-600" />
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            No hay un vuelo seleccionado
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Para registrar una reserva, primero debes seleccionar un vuelo
            disponible.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Buscar vuelos
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-11 w-11 text-emerald-600" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Operación completada
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            ¡Reserva creada!
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-500">
            Tu reserva se registró correctamente. Puedes consultar su estado
            desde tu perfil.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Ir a mi perfil
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full rounded-xl border border-slate-200 px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
        >
          <ArrowLeft
            size={18}
            className="transition group-hover:-translate-x-1"
          />
          Volver a los vuelos
        </button>

        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <Plane size={14} />
            Proceso de reserva
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Datos de los pasajeros
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Introduce los datos de identificación de cada viajero. Verifica
            que la información sea correcta antes de confirmar.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={21} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Pasajeros
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {passengers.length}{" "}
                {passengers.length === 1 ? "viajero" : "viajeros"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText size={21} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Información requerida
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                Datos personales
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={21} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Siguiente paso
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                Confirmar reserva
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {passengers.map((passenger, index) => (
            <section
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <UserRound size={23} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Pasajero {index + 1}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Información personal
                    </p>
                  </div>
                </div>

                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassenger(index)}
                    aria-label={`Eliminar pasajero ${index + 1}`}
                    title="Eliminar pasajero"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-100"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
                <div>
                  <label
                    htmlFor={`first-name-${index}`}
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Nombre
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id={`first-name-${index}`}
                    type="text"
                    autoComplete="given-name"
                    required
                    value={passenger.first_name}
                    onChange={(event) =>
                      updatePassenger(index, "first_name", event.target.value)
                    }
                    placeholder="Nombre del pasajero"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`last-name-${index}`}
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Apellido
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id={`last-name-${index}`}
                    type="text"
                    autoComplete="family-name"
                    required
                    value={passenger.last_name}
                    onChange={(event) =>
                      updatePassenger(index, "last_name", event.target.value)
                    }
                    placeholder="Apellido del pasajero"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`identification-${index}`}
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Número de documento
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id={`identification-${index}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    required
                    value={
                      passenger.identification === 0
                        ? ""
                        : passenger.identification
                    }
                    onChange={(event) => {
                      const value = event.target.value;

                      if (/^\d*$/.test(value)) {
                        updatePassenger(
                          index,
                          "identification",
                          value === "" ? 0 : Number(value)
                        );
                      }
                    }}
                    placeholder="Introduce el número de documento"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Introduce únicamente los números del documento.
                  </p>
                </div>
              </div>
            </section>
          ))}

          <button
            type="button"
            onClick={addPassenger}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-blue-300 bg-blue-50/50 px-5 py-4 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:w-auto"
          >
            <Plus size={19} />
            Agregar otro pasajero
          </button>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <div className="mt-0.5 shrink-0">
                <ShieldCheck size={19} />
              </div>
              <p className="leading-6">{error}</p>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Revisa los datos antes de continuar
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Comprueba que los nombres, apellidos y documentos de todos
                  los pasajeros estén escritos correctamente.
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creando reserva...
                  </>
                ) : (
                  <>
                    Confirmar reserva
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                La reserva se creará cuando confirmes los datos.
              </p>
            </div>
          </div>
        </form>

        <footer className="mt-8 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
          Flight-System · Gestión de reservas de vuelos
        </footer>
      </div>
    </div>
  );
}