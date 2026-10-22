import { Link } from "react-router-dom";
import {
  Search,
  Ticket,
  ClipboardList,
  ArrowRight,
  Plane,
  ShieldCheck,
  Globe2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import FlightSearch from "../components/FlightSearch";
import heroImage from "../assets/hero.jpg";

const features = [
  {
    number: "01",
    icon: Search,
    title: "Encuentra tu vuelo",
    description:
      "Explora los vuelos programados, compara opciones y encuentra una ruta que se adapte a tus planes.",
    action: "Explorar vuelos",
    to: "/flights/available",
    disabled: false,
  },
  {
    number: "02",
    icon: Ticket,
    title: "Prepara tu viaje",
    description:
      "Encuentra las opciones disponibles y organiza los detalles de tu próximo destino.",
    action: "Próximamente",
    to: "",
    disabled: true,
  },
  {
    number: "03",
    icon: ClipboardList,
    title: "Gestiona tu cuenta",
    description:
      "Consulta tu perfil y accede a las opciones disponibles para administrar tu información.",
    action: "Ver mi perfil",
    to: "/profile",
    disabled: false,
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <main>
        {/* Hero y buscador */}
        <section className="relative isolate overflow-visible bg-slate-950">
          <img
            src={heroImage}
            alt="Avión viajando hacia su próximo destino"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-blue-950/35" />

          <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <Plane size={16} />
                Tu próxima aventura comienza aquí
              </div>

              <h1 className="mt-7 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
                El mundo es grande.
                <span className="mt-1 block text-sky-300">
                  Empieza por explorarlo.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
                Encuentra vuelos, descubre nuevas rutas y comienza a planear
                ese viaje que tienes en mente.
              </p>
            </div>

            <div className="relative z-10 mt-12 w-full rounded-2xl border border-white/60 bg-white p-4 shadow-2xl shadow-black/20 sm:p-6 lg:mt-16 lg:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Search size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Encuentra tu próximo vuelo
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Busca opciones para tu próximo destino.
                  </p>
                </div>
              </div>

              <FlightSearch />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/85">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={17} className="text-sky-300" />
                Consulta vuelos disponibles
              </span>

              <span className="inline-flex items-center gap-2">
                <Globe2 size={17} className="text-sky-300" />
                Explora nuevas rutas
              </span>
            </div>
          </div>
        </section>

        {/* Funcionalidades */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
                Flight System
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Todo comienza con un destino
              </h2>

              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Encuentra las herramientas que necesitas para consultar vuelos
                y gestionar tu experiencia en la plataforma.
              </p>
            </div>

            <Link
              to="/flights/available"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Ver vuelos disponibles
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className={`group relative flex min-h-[275px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 ${
                    feature.disabled
                      ? "bg-slate-50/70"
                      : "hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        feature.disabled
                          ? "bg-slate-200/70 text-slate-500"
                          : "bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white"
                      }`}
                    >
                      <Icon size={22} />
                    </div>

                    <span className="text-sm font-semibold tracking-wider text-slate-300">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>

                  {feature.disabled ? (
                    <span className="mt-6 inline-flex w-fit items-center rounded-lg bg-slate-200/70 px-4 py-2.5 text-sm font-semibold text-slate-500">
                      {feature.action}
                    </span>
                  ) : (
                    <Link
                      to={feature.to}
                      className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold text-blue-700 transition-colors hover:text-blue-900"
                    >
                      {feature.action}
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Llamado final */}
        <section className="px-5 pb-16 sm:px-8 sm:pb-20">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-950 px-6 py-10 sm:px-10 sm:py-14 lg:px-16">
            <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-300">
                  Tu próximo viaje
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  ¿A dónde te gustaría ir?
                </h2>

                <p className="mt-3 leading-7 text-blue-100/80">
                  Explora los vuelos disponibles y encuentra tu próximo
                  destino.
                </p>
              </div>

              <Link
                to="/flights/available"
                className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-blue-950 transition hover:bg-sky-100"
              >
                Explorar vuelos
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Pie de página */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-center text-sm text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} Flight System</p>
          <p>Tu próximo destino comienza aquí.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;