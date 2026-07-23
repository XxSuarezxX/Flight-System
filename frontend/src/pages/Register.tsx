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

      alert("User created successfully.");

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Could not create the account.");
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
              Create your
              <br />
              Account
            </h1>

            <p className="text-lg text-blue-100 leading-8">
              Join Flight System and manage your trips, reservations and future
              flights from a single place.
            </p>
          </section>

          {/* Panel derecho */}
          <section className="flex items-center justify-center p-12">
            <div className="w-full max-w-md">

              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Register
              </h2>

              <p className="text-gray-500 mb-8">
                Complete the information below.
              </p>

              <form
                className="space-y-5"
                onSubmit={handleSubmit}
              >

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      First Name
                    </label>

                    <input
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Last Name
                    </label>

                    <input
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                </div>

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

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    placeholder="+57 300 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  Create Account
                </button>

                <p className="text-center text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/"
                    className="text-blue-700 font-semibold hover:underline"
                  >
                    Login
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

export default Register;