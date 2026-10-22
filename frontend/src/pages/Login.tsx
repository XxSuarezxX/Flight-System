import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ArrowRight, LockKeyhole, Mail, Plane } from "lucide-react";

import Navbar from "../components/Navbar";
import Notification from "../components/Notification";
import { login } from "../api/auth";

interface TokenPayload {
  role: string;
}

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setNotification(null);

    try {
      const response = await login({
        email,
        password,
      });

      const token = response.access_token;

      localStorage.setItem("access_token", token);

      const decodedToken = jwtDecode<TokenPayload>(token);

      if (decodedToken.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      console.error(error);
      setNotification("Correo electrónico o contraseña incorrectos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}

      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-2xl shadow-slate-900/[0.06] lg:min-h-[640px] lg:grid-cols-2">
          {/* Panel visual */}
          <section className="relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-slate-950 p-7 text-white sm:p-10 lg:p-12">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=85"
              alt="Avión de pasajeros sobre las nubes"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-blue-950/65 to-sky-900/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

            <div className="relative z-10">
              <div className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white/95 shadow-lg backdrop-blur-md">
                <Plane size={16} className="text-sky-300" />
                Tu próxima aventura comienza aquí
              </div>

              <h1 className="max-w-lg text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                El mundo está
                <br />
                a un vuelo de distancia.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
                Encuentra nuevos destinos, organiza tus viajes y gestiona tus
                reservas desde un solo lugar.
              </p>
            </div>

            <div className="relative z-10 mt-12 hidden items-center gap-4 sm:flex">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
                <Plane size={20} className="text-sky-200" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Flight System
                </p>
                <p className="mt-0.5 text-xs text-slate-300">
                  Planifica. Reserva. Descubre.
                </p>
              </div>
            </div>
          </section>

          {/* Formulario */}
          <section className="flex items-center justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 xl:px-16">
            <div className="w-full max-w-md">
              <div className="mb-9">
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                  <Plane size={23} />
                </div>

                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                  Bienvenido de nuevo
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Iniciar sesión
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
                  Accede a tu cuenta para consultar y gestionar tus viajes.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2.5 block text-sm font-semibold text-slate-700"
                  >
                    Correo electrónico
                  </label>

                  <div className="group relative">
                    <Mail
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600"
                    />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="nombre@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2.5 block text-sm font-semibold text-slate-700"
                  >
                    Contraseña
                  </label>

                  <div className="group relative">
                    <LockKeyhole
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600"
                    />

                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-700 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition duration-200 hover:bg-blue-800 hover:shadow-xl hover:shadow-blue-700/25 focus:outline-none focus:ring-4 focus:ring-blue-600/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:shadow-lg sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      Iniciar sesión
                      <ArrowRight
                        size={18}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

                <p className="pt-1 text-center text-sm text-slate-500">
                  ¿Todavía no tienes una cuenta?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-blue-700 transition hover:text-blue-900 hover:underline"
                  >
                    Crear cuenta
                  </Link>
                </p>
              </form>

              <div className="mt-9 border-t border-slate-100 pt-6 text-center">
                <p className="text-xs leading-5 text-slate-400">
                  Tu cuenta, tus reservas y tus próximos destinos en un solo
                  lugar.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default Login;