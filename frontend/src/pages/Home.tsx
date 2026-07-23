import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-10">
        <h1 className="text-5xl font-bold mb-4">
          Find your next destination
        </h1>

        <p className="text-gray-600 text-lg">
          Search and book flights quickly and securely.
        </p>
      </main>
    </>
  );
}

export default Home;