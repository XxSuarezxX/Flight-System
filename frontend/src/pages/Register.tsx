
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { register } from "../api/auth";

function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone_number: phoneNumber,
      });

      alert("Cuenta creada correctamente.");

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("No se pudo crear la cuenta.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 lg:min-h-[680px] lg:grid-cols-2">

          {/* Panel visual */}
          <section className="relative flex min-h-[260px] flex-col justify-between overflow-hidden bg-slate-900 p-7 text-white sm:p-10 lg:min-h-full lg:p-12">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=85"
              alt="Avión de pasajeros sobre las nubes"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-blue-950/40 to-sky-900/30" />

            <div className="relative z-10">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-sky-300" />
                Tu próxima aventura comienza aquí
              </div>

              <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Cada viaje
                <br />
                tiene un comienzo.
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-blue-50/90 sm:text-lg">
                Crea tu cuenta y organiza tus viajes, consulta tus reservas
                y descubre nuevas posibilidades desde un solo lugar.
              </p>
            </div>

            <div className="relative z-10 mt-8 hidden items-center gap-3 text-sm text-white/80 sm:flex">
              <span className="h-px w-10 bg-white/70" />
              <span>Flight System · Viaja a tu manera</span>
            </div>
          </section>

          {/* Formulario */}
          <section className="flex items-center justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14">
            <div className="w-full max-w-md">
              <div className="mb-7">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Únete a nosotros
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Crear cuenta
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                  Registra tus datos para comenzar a gestionar tus viajes.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Nombre
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Tu nombre"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Apellido
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Tu apellido"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Correo electrónico
                  </label>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Contraseña
                  </label>

                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Crea una contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Número de teléfono
                  </label>

                  <input
                    id="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+57 300 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-700 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-600/25 active:scale-[0.99]"
                >
                  Crear mi cuenta
                </button>

                <p className="pt-2 text-center text-sm text-slate-500">
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-700 transition hover:text-blue-900 hover:underline"
                  >
                    Iniciar sesión
                  </Link>
                </p>
              </form>

              <div className="mt-7 border-t border-slate-100 pt-5 text-center">
                <p className="text-xs leading-5 text-slate-400">
                  Flight System · Gestiona tus viajes desde un solo lugar.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default Register;
