import { useEffect, useState } from "react";

import { getFlights } from "../api/flights";
import type { Flight } from "../api/flights";

import { getAirports } from "../api/airports";
import type { Airport } from "../api/airports";

import { getCities } from "../api/cities";
import { getCountries } from "../api/countries";
import { getUsers } from "../api/users";
import type { User } from "../api/users";

function AdminDashboard() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [flightCount, setFlightCount] = useState(0);
  const [airportCount, setAirportCount] = useState(0);
  const [cityCount, setCityCount] = useState(0);
  const [countryCount, setCountryCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          flightsData,
          airportsData,
          citiesData,
          countriesData,
          usersData,
        ] = await Promise.all([
          getFlights(),
          getAirports(),
          getCities(),
          getCountries(),
          getUsers(),
        ]);

        setFlights(flightsData);
        setAirports(airportsData);
        setUsers(usersData);

        setFlightCount(flightsData.length);
        setAirportCount(airportsData.length);
        setCityCount(citiesData.length);
        setCountryCount(countriesData.length);
        setUserCount(usersData.length);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const getAirportCode = (airportId: string) => {
    const airport = airports.find(
      (airport) => airport.id === airportId
    );

    return airport?.iata_code ?? "N/A";
  };

  const getStatusCount = (status: string) => {
    return flights.filter(
      (flight) => flight.status === status
    ).length;
  };

  const recentFlights = [...flights]
    .sort(
      (a, b) =>
        new Date(b.departure_at).getTime() -
        new Date(a.departure_at).getTime()
    )
    .slice(0, 5);

  const recentUsers = [...users]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const cancelledFlights = getStatusCount("CANCELLED");

  const inactiveUsers = users.filter(
    (user) => !user.is_active
  ).length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-800">
            Admin Dashboard
          </h2>

          <p className="text-slate-500 mt-2">
            Manage and monitor your Flight System.
          </p>
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Flights
            </p>

            <p className="text-3xl font-bold text-slate-800 mt-2">
              {loading ? "..." : flightCount}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Airports
            </p>

            <p className="text-3xl font-bold text-slate-800 mt-2">
              {loading ? "..." : airportCount}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Cities
            </p>

            <p className="text-3xl font-bold text-slate-800 mt-2">
              {loading ? "..." : cityCount}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Countries
            </p>

            <p className="text-3xl font-bold text-slate-800 mt-2">
              {loading ? "..." : countryCount}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Users
            </p>

            <p className="text-3xl font-bold text-slate-800 mt-2">
              {loading ? "..." : userCount}
            </p>
          </div>

        </section>

        {/* Main dashboard */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Recent Flights */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800">
                Recent Flights
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Latest scheduled flights
              </p>
            </div>

            {recentFlights.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                No flights available.
              </div>
            ) : (
              <div className="space-y-1">

                {recentFlights.map((flight) => (
                  <div
                    key={flight.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-lg hover:bg-slate-50 transition"
                  >

                    <div>
                      <p className="font-semibold text-slate-800">
                        {flight.flight_number}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {getAirportCode(flight.origin_airport_id)}
                        {" → "}
                        {getAirportCode(flight.destination_airport_id)}
                      </p>
                    </div>

                    <div className="text-sm text-slate-500">
                      {formatDate(flight.departure_at)}
                    </div>

                    <div className="font-medium text-slate-700">
                      {formatPrice(flight.price)}
                    </div>

                    <div>
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {getStatusLabel(flight.status)}
                      </span>
                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* Flight Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800">
                Flight Status
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Current flight distribution
              </p>
            </div>

            <div className="space-y-5">

              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Scheduled
                </span>

                <span className="font-bold text-slate-800">
                  {getStatusCount("SCHEDULED")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Departed
                </span>

                <span className="font-bold text-slate-800">
                  {getStatusCount("DEPARTED")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Arrived
                </span>

                <span className="font-bold text-slate-800">
                  {getStatusCount("ARRIVED")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Cancelled
                </span>

                <span className="font-bold text-slate-800">
                  {getStatusCount("CANCELLED")}
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* Recent Activity + System Alerts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800">
                Recent Activity
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Latest activity available in the system
              </p>
            </div>

            <div className="space-y-5">

              {recentUsers.length === 0 && recentFlights.length === 0 ? (
                <div className="py-8 text-center text-slate-500">
                  No recent activity.
                </div>
              ) : (
                <>
                  {recentUsers.slice(0, 3).map((user) => (
                    <div
                      key={`user-${user.id}`}
                      className="flex items-start gap-4"
                    >

                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-blue-600 text-sm font-bold">
                          U
                        </span>
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          New user registered
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {user.first_name} {user.last_name}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {formatDate(user.created_at)}
                        </p>
                      </div>

                    </div>
                  ))}

                  {recentFlights.slice(0, 3).map((flight) => (
                    <div
                      key={`flight-${flight.id}`}
                      className="flex items-start gap-4"
                    >

                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <span className="text-slate-600 text-sm font-bold">
                          F
                        </span>
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          Flight available
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {flight.flight_number}{" "}
                          {getAirportCode(flight.origin_airport_id)}
                          {" → "}
                          {getAirportCode(flight.destination_airport_id)}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          Departure: {formatDate(flight.departure_at)}
                        </p>
                      </div>

                    </div>
                  ))}
                </>
              )}

            </div>

          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-xl shadow-sm p-6">

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800">
                System Alerts
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Conditions that may require attention
              </p>
            </div>

            <div className="space-y-4">

              {cancelledFlights > 0 && (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-red-50 border border-red-100">

                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <span className="text-red-600 font-bold">
                      !
                    </span>
                  </div>

                  <div>
                    <p className="font-medium text-red-700">
                      Cancelled flights
                    </p>

                    <p className="text-sm text-red-600 mt-1">
                      There are {cancelledFlights} cancelled flight
                      {cancelledFlights !== 1 ? "s" : ""} in the system.
                    </p>
                  </div>

                </div>
              )}

              {inactiveUsers > 0 && (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-amber-50 border border-amber-100">

                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <span className="text-amber-600 font-bold">
                      !
                    </span>
                  </div>

                  <div>
                    <p className="font-medium text-amber-700">
                      Inactive users
                    </p>

                    <p className="text-sm text-amber-600 mt-1">
                      There are {inactiveUsers} inactive user
                      {inactiveUsers !== 1 ? "s" : ""}.
                    </p>
                  </div>

                </div>
              )}

              {flightCount === 0 && (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 border border-blue-100">

                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-bold">
                      i
                    </span>
                  </div>

                  <div>
                    <p className="font-medium text-blue-700">
                      No flights registered
                    </p>

                    <p className="text-sm text-blue-600 mt-1">
                      The system currently has no flights available.
                    </p>
                  </div>

                </div>
              )}

              {cancelledFlights === 0 &&
                inactiveUsers === 0 &&
                flightCount > 0 && (
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 border border-green-100">

                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <span className="text-green-600 font-bold">
                        ✓
                      </span>
                    </div>

                    <div>
                      <p className="font-medium text-green-700">
                        System operating normally
                      </p>

                      <p className="text-sm text-green-600 mt-1">
                        No relevant alerts detected with the
                        available system data.
                      </p>
                    </div>

                  </div>
                )}

            </div>

          </div>

        </section>

        {/* System Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-slate-500">
              Total Flights
            </p>

            <p className="text-2xl font-bold text-slate-800 mt-2">
              {flightCount}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Flights registered in the system
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-slate-500">
              Active Users
            </p>

            <p className="text-2xl font-bold text-slate-800 mt-2">
              {users.filter((user) => user.is_active).length}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Users currently active
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-slate-500">
              Airport Network
            </p>

            <p className="text-2xl font-bold text-slate-800 mt-2">
              {airportCount}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Airports currently available
            </p>
          </div>

        </section>

      </div>

    </div>
  );
}

export default AdminDashboard;