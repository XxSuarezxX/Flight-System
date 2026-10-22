import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plane,
  MapPin,
  Building2,
  Globe2,
  Users,
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  Clock3,
  CircleCheck,
  CircleAlert,
  UserRound,
  PlaneTakeoff,
  PlaneLanding,
  Ban,
  Activity,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

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
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setLoadError(false);

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
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const getAirportCode = (airportId: string) => {
    const airport = airports.find((airport) => airport.id === airportId);
    return airport?.iata_code ?? "N/A";
  };

  const getStatusCount = (status: string) => {
    return flights.filter((flight) => flight.status === status).length;
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
  const scheduledFlights = getStatusCount("SCHEDULED");
  const departedFlights = getStatusCount("DEPARTED");
  const arrivedFlights = getStatusCount("ARRIVED");

  const inactiveUsers = users.filter((user) => !user.is_active).length;
  const activeUsers = users.filter((user) => user.is_active).length;

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-US", {
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
    const labels: Record<string, string> = {
      SCHEDULED: "Scheduled",
      DEPARTED: "Departed",
      ARRIVED: "Arrived",
      CANCELLED: "Cancelled",
    };

    return labels[status] ?? status;
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      SCHEDULED: "bg-blue-50 text-blue-700 ring-blue-600/15",
      DEPARTED: "bg-amber-50 text-amber-700 ring-amber-600/15",
      ARRIVED: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
      CANCELLED: "bg-red-50 text-red-700 ring-red-600/15",
    };

    return styles[status] ?? "bg-slate-100 text-slate-600 ring-slate-500/10";
  };

  const statistics = [
    {
      label: "Total flights",
      value: flightCount,
      icon: Plane,
      iconStyle: "bg-blue-50 text-blue-700",
      description: "Registered flights",
      path: "/admin/flights",
    },
    {
      label: "Airports",
      value: airportCount,
      icon: MapPin,
      iconStyle: "bg-violet-50 text-violet-700",
      description: "Airport network",
      path: "/admin/airports",
    },
    {
      label: "Cities",
      value: cityCount,
      icon: Building2,
      iconStyle: "bg-amber-50 text-amber-700",
      description: "Connected cities",
      path: "/admin/cities",
    },
    {
      label: "Countries",
      value: countryCount,
      icon: Globe2,
      iconStyle: "bg-emerald-50 text-emerald-700",
      description: "Destination coverage",
      path: "/admin/countries",
    },
    {
      label: "Users",
      value: userCount,
      icon: Users,
      iconStyle: "bg-sky-50 text-sky-700",
      description: "Registered accounts",
      path: "/admin/users",
    },
  ];

  const activityItems = [
    ...recentUsers.map((user) => ({
      id: `user-${user.id}`,
      type: "user" as const,
      timestamp: new Date(user.created_at).getTime(),
      name: `${user.first_name} ${user.last_name}`,
      description: "New user registered",
      date: user.created_at,
    })),
    ...recentFlights.map((flight) => ({
      id: `flight-${flight.id}`,
      type: "flight" as const,
      timestamp: new Date(flight.departure_at).getTime(),
      name: `${flight.flight_number} · ${getAirportCode(
        flight.origin_airport_id
      )} → ${getAirportCode(flight.destination_airport_id)}`,
      description: "Flight in the system",
      date: flight.departure_at,
    })),
  ]
    .filter((item) => !Number.isNaN(item.timestamp))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-[1600px] space-y-8">
        {/* Header */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <ShieldCheck size={14} />
              Administrative workspace
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Dashboard overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Monitor your flight operations, manage your network, and review
              the current state of your system.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:self-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                System overview
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {loading ? "Loading data..." : "Dashboard summary"}
              </p>
            </div>
          </div>
        </section>

        {/* Loading error */}
        {loadError && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <CircleAlert size={21} className="mt-0.5 shrink-0 text-red-600" />
              <div>
                <p className="font-semibold text-red-800">
                  Unable to load dashboard data
                </p>
                <p className="mt-1 text-sm text-red-700">
                  One or more requests failed. Check your connection and
                  reload the page to try again.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              <RefreshCw size={15} />
              Reload dashboard
            </button>
          </div>
        )}

        {/* Statistics */}
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                System resources
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Summary of registered resources
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {statistics.map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.label}
                  to={stat.path}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/[0.04]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconStyle}`}
                    >
                      <Icon size={21} />
                    </div>

                    <ArrowUpRight
                      size={18}
                      className="text-slate-300 transition group-hover:text-blue-600"
                    />
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                    {loading ? (
                      <span className="inline-block h-9 w-12 animate-pulse rounded-lg bg-slate-100" />
                    ) : (
                      stat.value.toLocaleString("en-US")
                    )}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {stat.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Flights and status */}
        <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
          {/* Recent flights */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm 2xl:col-span-2">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent flights
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest flights sorted by departure date
                </p>
              </div>

              <Link
                to="/admin/flights"
                className="inline-flex items-center gap-2 self-start text-sm font-semibold text-blue-700 transition hover:text-blue-900 sm:self-auto"
              >
                Manage flights
                <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex animate-pulse items-center gap-4 py-2"
                  >
                    <div className="h-10 w-10 rounded-xl bg-slate-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-28 rounded bg-slate-100" />
                      <div className="h-3 w-36 rounded bg-slate-100" />
                    </div>
                    <div className="h-6 w-20 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : recentFlights.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Plane size={26} />
                </div>
                <h3 className="mt-4 font-semibold text-slate-800">
                  No flights available
                </h3>
                <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                  Flights registered in the system will appear here.
                </p>
                <Link
                  to="/admin/flights"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Manage flights
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[650px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70">
                        <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Flight
                        </th>
                        <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Route
                        </th>
                        <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Departure
                        </th>
                        <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Price
                        </th>
                        <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {recentFlights.map((flight) => (
                        <tr
                          key={flight.id}
                          className="transition hover:bg-slate-50/80"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                                <Plane size={17} />
                              </div>
                              <span className="text-sm font-semibold text-slate-800">
                                {flight.flight_number}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                              <span>
                                {getAirportCode(flight.origin_airport_id)}
                              </span>
                              <PlaneTakeoff
                                size={14}
                                className="text-slate-400"
                              />
                              <span>
                                {getAirportCode(flight.destination_airport_id)}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <CalendarDays
                                size={15}
                                className="shrink-0 text-slate-400"
                              />
                              {formatDate(flight.departure_at)}
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-800">
                            {formatPrice(flight.price)}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(
                                flight.status
                              )}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {getStatusLabel(flight.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="divide-y divide-slate-100 md:hidden">
                  {recentFlights.map((flight) => (
                    <div key={flight.id} className="space-y-3 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <Plane size={19} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {flight.flight_number}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatDate(flight.departure_at)}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(
                            flight.status
                          )}`}
                        >
                          {getStatusLabel(flight.status)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <div className="flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            From
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {getAirportCode(flight.origin_airport_id)}
                          </p>
                        </div>

                        <PlaneTakeoff
                          size={17}
                          className="text-blue-600"
                        />

                        <div className="flex-1 text-right">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            To
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {getAirportCode(flight.destination_airport_id)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-500">
                          Ticket price
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {formatPrice(flight.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!loading && !loadError && recentFlights.length > 0 && (
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3">
                <p className="text-xs text-slate-500">
                  Showing {recentFlights.length} of {flightCount} registered
                  flights
                </p>
              </div>
            )}
          </div>

          {/* Flight status */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <Activity size={21} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Flight status
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Distribution across all registered flights
              </p>
            </div>

            {loading ? (
              <div className="space-y-5">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="animate-pulse">
                    <div className="mb-2 flex justify-between">
                      <div className="h-3 w-20 rounded bg-slate-100" />
                      <div className="h-3 w-8 rounded bg-slate-100" />
                    </div>
                    <div className="h-2 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {[
                  {
                    label: "Scheduled",
                    count: scheduledFlights,
                    color: "bg-blue-500",
                    text: "text-blue-700",
                  },
                  {
                    label: "Departed",
                    count: departedFlights,
                    color: "bg-amber-500",
                    text: "text-amber-700",
                  },
                  {
                    label: "Arrived",
                    count: arrivedFlights,
                    color: "bg-emerald-500",
                    text: "text-emerald-700",
                  },
                  {
                    label: "Cancelled",
                    count: cancelledFlights,
                    color: "bg-red-500",
                    text: "text-red-700",
                  },
                ].map((status) => {
                  const percentage =
                    flightCount > 0
                      ? (status.count / flightCount) * 100
                      : 0;

                  return (
                    <div key={status.label}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${status.color}`}
                          />
                          <span className="text-sm font-medium text-slate-600">
                            {status.label}
                          </span>
                        </div>

                        <span className={`text-sm font-bold ${status.text}`}>
                          {status.count}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${status.color}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-7 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Total flights
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {loading ? "—" : flightCount.toLocaleString("en-US")}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Across all flight statuses
              </p>
            </div>
          </div>
        </section>

        {/* Activity and alerts */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Recent activity */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent activity
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest users and flight records
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Clock3 size={19} />
              </div>
            </div>

            {loading ? (
              <div className="space-y-5">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex animate-pulse items-center gap-3"
                  >
                    <div className="h-10 w-10 rounded-xl bg-slate-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-32 rounded bg-slate-100" />
                      <div className="h-3 w-24 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activityItems.length === 0 ? (
              <div className="py-10 text-center">
                <Activity size={28} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-600">
                  No recent activity
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  New records will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {activityItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        item.type === "user"
                          ? "bg-violet-50 text-violet-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {item.type === "user" ? (
                        <UserRound size={19} />
                      ) : (
                        <Plane size={19} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {item.description}
                      </p>
                      <p className="mt-1 break-words text-sm text-slate-500">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 border-t border-slate-100 pt-4">
              <Link
                to="/admin/users"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
              >
                Manage users
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* System alerts */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  System alerts
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Conditions that may require attention
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <CircleAlert size={20} />
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex animate-pulse gap-3 rounded-xl border border-slate-100 p-4"
                  >
                    <div className="h-9 w-9 rounded-lg bg-slate-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-32 rounded bg-slate-100" />
                      <div className="h-3 w-full rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {cancelledFlights > 0 && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/70 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700">
                      <Ban size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-red-800">
                        Cancelled flights
                      </p>
                      <p className="mt-1 text-sm leading-5 text-red-700">
                        {cancelledFlights} flight
                        {cancelledFlights !== 1 ? "s are" : " is"} marked as
                        cancelled.
                      </p>
                    </div>
                  </div>
                )}

                {inactiveUsers > 0 && (
                  <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/70 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                      <Users size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-amber-800">
                        Inactive users
                      </p>
                      <p className="mt-1 text-sm leading-5 text-amber-700">
                        {inactiveUsers} user
                        {inactiveUsers !== 1 ? "s are" : " is"} currently
                        inactive.
                      </p>
                    </div>
                  </div>
                )}

                {flightCount === 0 && (
                  <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                      <Plane size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-blue-800">
                        No flights registered
                      </p>
                      <p className="mt-1 text-sm leading-5 text-blue-700">
                        The system currently has no registered flights.
                      </p>
                    </div>
                  </div>
                )}

                {cancelledFlights === 0 &&
                  inactiveUsers === 0 &&
                  flightCount > 0 && (
                    <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        <CircleCheck size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-emerald-800">
                          No alerts detected
                        </p>
                        <p className="mt-1 text-sm leading-5 text-emerald-700">
                          No conditions covered by these checks currently
                          require attention.
                        </p>
                      </div>
                    </div>
                  )}

                {flightCount === 0 &&
                  cancelledFlights === 0 &&
                  inactiveUsers === 0 && (
                    <p className="text-xs leading-5 text-slate-400">
                      Alerts are based on the flight and user data available
                      to this dashboard.
                    </p>
                  )}
              </div>
            )}

            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs leading-5 text-slate-500">
                These alerts are calculated from the records returned by the
                existing API. They do not represent a live infrastructure
                health check.
              </p>
            </div>
          </div>
        </section>

        {/* Overview footer */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/admin/users"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <Users size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-500">Active users</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {loading ? "—" : activeUsers.toLocaleString("en-US")}
              </p>
            </div>

            <ArrowUpRight
              size={18}
              className="shrink-0 text-slate-300 transition group-hover:text-blue-600"
            />
          </Link>

          <Link
            to="/admin/airports"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <MapPin size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-500">Airport network</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {loading ? "—" : airportCount.toLocaleString("en-US")}
              </p>
            </div>

            <ArrowUpRight
              size={18}
              className="shrink-0 text-slate-300 transition group-hover:text-blue-600"
            />
          </Link>

          <Link
            to="/admin/countries"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Globe2 size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-500">Country coverage</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {loading ? "—" : countryCount.toLocaleString("en-US")}
              </p>
            </div>

            <ArrowUpRight
              size={18}
              className="shrink-0 text-slate-300 transition group-hover:text-blue-600"
            />
          </Link>
        </section>

        <footer className="border-t border-slate-200 pt-5">
          <p className="text-center text-xs text-slate-400">
            Flight System · Administrative dashboard
          </p>
        </footer>
      </div>
    </div>
  );
}

export default AdminDashboard;