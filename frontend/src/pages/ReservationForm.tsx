import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, UserRound, Plane, CheckCircle2 } from "lucide-react";
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <Plane className="mx-auto mb-4 h-12 w-12 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">
            No hay un vuelo seleccionado
          </h1>
          <p className="mt-2 text-gray-500">
            Regresa a la página principal para buscar vuelos.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold text-gray-800">
            ¡Reserva creada!
          </h1>
          <p className="mt-3 text-gray-500">
            Tu reserva se registró correctamente. Puedes consultar su estado
            desde tu perfil.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Ir a mi perfil
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Volver
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Datos de los pasajeros
          </h1>
          <p className="mt-2 text-gray-500">
            Ingresa la información de cada pasajero para continuar con la
            reserva.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {passengers.map((passenger, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <UserRound size={22} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      Pasajero {index + 1}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Información personal
                    </p>
                  </div>
                </div>

                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassenger(index)}
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                    aria-label={`Eliminar pasajero ${index + 1}`}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={passenger.first_name}
                    onChange={(event) =>
                      updatePassenger(index, "first_name", event.target.value)
                    }
                    placeholder="Nombre del pasajero"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Apellido
                  </label>
                  <input
                    type="text"
                    required
                    value={passenger.last_name}
                    onChange={(event) =>
                      updatePassenger(index, "last_name", event.target.value)
                    }
                    placeholder="Apellido del pasajero"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Número de documento
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
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
                    placeholder="Número de documento"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addPassenger}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-medium text-blue-700 transition hover:bg-blue-100"
          >
            <Plus size={18} />
            Agregar pasajero
          </button>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Revisa que los datos de todos los pasajeros sean correctos antes
              de crear la reserva.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creando reserva..." : "Confirmar reserva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
