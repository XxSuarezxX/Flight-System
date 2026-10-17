import { Link } from "react-router-dom";
import {
  Search,
  Ticket,
  ClipboardList,
  ArrowRight,
  Plane,
  ShieldCheck,
} from "lucide-react";

import Navbar from "../components/Navbar";
import FlightSearch from "../components/FlightSearch";
import heroImage from "../assets/hero.jpg";

const features = [
  {
    number: "01",
    icon: Search,
    title: "Ver vuelos disponibles",
    description:
      "Explora los vuelos programados y encuentra tu próximo destino.",
    action: "Explorar vuelos",
    to: "/flights/available",
    disabled: false,
  },
  {
    number: "02",
    icon: Ticket,
    title: "Compra tu boleto",
    description:
      "Encuentra tu vuelo y prepárate para organizar tu próximo viaje.",
    action: "Próximamente",
    to: "",
    disabled: true,
  },
  {
    number: "03",
    icon: ClipboardList,
    title: "Gestiona tus reservas",
    description:
      "Consulta tu perfil y accede a las opciones disponibles para tu cuenta.",
    action: "Ver mi perfil",
    to: "/profile",
    disabled: false,
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* Sección principal */}
        <section className="relative isolate min-h-[580px] overflow-visible">
          <img
            src={heroImage}
            alt="Avión viajando hacia su próximo destino"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/85 via-slate-900/65 to-blue-950/40" />

          <div className="relative z-10 mx-auto flex min-h-[580px] max-w-7xl flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Plane size={17} />
              Tu próximo destino comienza aquí
            </div>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Encuentra tu próximo{" "}
              <span className="text-sky-300">vuelo</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Busca opciones, compara horarios y encuentra el vuelo adecuado
              para tu próximo viaje.
            </p>

            <div className="relative z-20 mt-10 w-full max-w-5xl text-left">
              <FlightSearch />
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-white/80">
              <ShieldCheck size={17} />
              Consulta los vuelos disponibles desde un solo lugar.
            </div>
          </div>
        </section>

        {/* Tarjetas de funcionalidades */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              Flight System
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Organiza tu próximo viaje
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Accede a las principales funciones de la plataforma y encuentra
              las opciones que necesitas para planear tu viaje.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className={`group relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 ${
                    feature.disabled
                      ? "opacity-75"
                      : "hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/70"
                  }`}
                >
                  <span className="absolute right-6 top-5 text-sm font-semibold tracking-wider text-slate-300">
                    {feature.number}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>

                  {feature.disabled ? (
                    <span className="mt-6 inline-flex w-fit items-center rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-500">
                      {feature.action}
                    </span>
                  ) : (
                    <Link
                      to={feature.to}
                      className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-900"
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
      </main>

      {/* Pie de página */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-center text-sm text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} Flight System</p>
          <p>Encuentra tu próximo destino.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
