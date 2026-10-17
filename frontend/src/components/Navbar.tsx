import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plane, User, LogOut, ChevronDown, Pencil } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
  const isProfilePage = location.pathname === "/profile";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Plane className="h-6 w-6 text-white" />
          </div>

          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Flight<span className="text-blue-600">System</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              {!isProfilePage ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
                >
                  <User className="h-4 w-4" />
                  Mi perfil
                </Link>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
                  >
                    <User className="h-4 w-4" />
                    Mi perfil
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showProfileMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                      <Link
                        to="/profile?edit=true"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar perfil
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white transition hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
