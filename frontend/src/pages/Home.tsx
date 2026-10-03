import Navbar from "../components/Navbar";
import FlightSearch from "../components/FlightSearch";
import heroImage from "../assets/hero.jpg";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <section className="relative min-h-[560px] overflow-hidden">
          <img
            src={heroImage}
            alt="Avión viajando"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col items-center justify-center px-6 py-16 text-center">
            <h1 className="text-5xl font-bold text-white">
              Encuentra tu próximo vuelo
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-white/90">
              Busca vuelos y encuentra la mejor opción para tu próximo viaje.
            </p>

            <div className="mt-10 w-full max-w-5xl">
              <FlightSearch />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Viaja con Flight System
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">
                Busca vuelos
              </h3>
              <p className="mt-2 text-gray-600">
                Encuentra vuelos según tu origen, destino y fecha.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">
                Compara opciones
              </h3>
              <p className="mt-2 text-gray-600">
                Revisa los horarios y precios disponibles.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">
                Reserva tu vuelo
              </h3>
              <p className="mt-2 text-gray-600">
                Elige tu vuelo y continúa con tu reserva.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;