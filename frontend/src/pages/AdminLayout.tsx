import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">

        <div className="px-6 py-6 border-b border-slate-800">
          <h1 className="text-xl font-bold">
            Flight System
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Administration
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">

          <Link
            to="/admin"
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin")
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/admin/flights"
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin/flights")
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Flights
          </Link>

          <Link
            to="/admin/airports"
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin/airports")
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Airports
          </Link>

          <Link
            to="/admin/cities"
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin/cities")
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Cities
          </Link>

          <Link
            to="/admin/countries"
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin/countries")
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Countries
          </Link>

          <Link
            to="/admin/users"
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin/users")
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Users
          </Link>

        </nav>

        <div className="px-4 py-6 border-t border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Logout
          </button>
        </div>

      </aside>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;