import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import { login } from "../api/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await login({
        email,
        password,
      });

      console.log(response);

      alert("Login successful!");
    } catch (error) {
      console.error(error);
      alert("Invalid credentials.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-72px)] bg-slate-100 flex items-center justify-center px-8 py-10">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-2">

          {/* Panel izquierdo */}
          <section className="bg-gradient-to-br from-blue-700 to-cyan-500 text-white flex flex-col justify-center p-14">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Welcome to
              <br />
              Flight System
            </h1>

            <p className="text-lg text-blue-100 leading-8">
              Book flights quickly, manage your reservations and travel
              comfortably from anywhere in the world.
            </p>
          </section>

          {/* Panel derecho */}
          <section className="flex items-center justify-center p-12">
            <div className="w-full max-w-md">

              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Login
              </h2>

              <p className="text-gray-500 mb-8">
                Enter your credentials to continue.
              </p>

              <form
                className="space-y-5"
                onSubmit={handleSubmit}
              >

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  Sign In
                </button>

                <p className="text-center text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-700 font-semibold hover:underline"
                  >
                    Create one
                  </Link>
                </p>

              </form>

            </div>
          </section>

        </div>
      </main>
    </>
  );
}

export default Login;