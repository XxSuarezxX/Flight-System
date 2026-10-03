import { useEffect, useState } from "react";
import { User, Mail, Phone, Save, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import {
  getCustomerProfile,
  updateCustomerProfile,
} from "../api/customer";
import type { CustomerProfile } from "../api/customer";

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

  const editing = searchParams.get("edit") === "true";

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getCustomerProfile();

        setProfile(data);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPhoneNumber(data.phone_number ?? "");
      } catch (error) {
        console.error("Error loading profile:", error);
        setError("No se pudo cargar la información del perfil.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleCancel = () => {
    if (!profile) {
      return;
    }

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
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
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

  if (!profile) {
    return null;
  }

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-72px)] bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Mi perfil
            </h1>

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

          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <User className="h-8 w-8 text-blue-600" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile.first_name} {profile.last_name}
                </h2>

                <p className="text-sm text-gray-500">
                  Cliente
                </p>
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
                  <p className="text-gray-900">
                    {profile.first_name}
                  </p>
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
                  <p className="text-gray-900">
                    {profile.last_name}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />

                  <span className="text-sm font-medium text-gray-500">
                    Correo electrónico
                  </span>
                </div>

                <p className="text-gray-900">
                  {profile.email}
                </p>

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
          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;