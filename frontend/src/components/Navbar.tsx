import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Plane,
  User,
  LogOut,
  ChevronDown,
  Pencil,
  Menu,
  X,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
  const isProfilePage = location.pathname === "/profile";
  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    setShowProfileMenu(false);
    setShowMobileMenu(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setShowProfileMenu(false);
    setShowMobileMenu(false);
    navigate("/login");
  };

  const linkStyle = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
      active
        ? "bg-blue-50 text-blue-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-blue-700"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="FlightSystem - Inicio"
        >
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg shadow-blue-600/20 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-blue-600/30">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
            <Plane className="relative h-5 w-5 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Flight<span className="text-blue-600">System</span>
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 sm:block">
              Your journey starts here
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className={linkStyle(location.pathname === "/login")}
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              {isAdminPage && (
                <Link
                  to="/admin"
                  className={linkStyle(location.pathname === "/admin")}
                >
                  <LayoutDashboard size={17} />
                  Panel administrativo
                </Link>
              )}

              {!isProfilePage ? (
                <Link
                  to="/profile"
                  className={linkStyle(false)}
                >
                  <User size={17} />
                  Mi perfil
                </Link>
              ) : (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu((current) => !current)}
                    aria-expanded={showProfileMenu}
                    className={`${linkStyle(true)} ${
                      showProfileMenu ? "bg-blue-50 text-blue-700" : ""
                    }`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                      <User size={16} />
                    </span>
                    Mi perfil
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        showProfileMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-3 w-60 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                      <div className="border-b border-slate-100 px-3 py-3">
                        <p className="text-sm font-bold text-slate-800">
                          Mi cuenta
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Administra tu información personal
                        </p>
                      </div>

                      <Link
                        to="/profile?edit=true"
                        onClick={() => setShowProfileMenu(false)}
                        className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Pencil size={16} />
                        </span>
                        <span>Editar perfil</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div className="mx-2 h-8 w-px bg-slate-200" />

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={17} />
                Cerrar sesión
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowMobileMenu((current) => !current)}
          aria-label={showMobileMenu ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={showMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 md:hidden"
        >
          {showMobileMenu ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {showMobileMenu && (
        <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 shadow-lg md:hidden sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className={linkStyle(location.pathname === "/login")}
                >
                  <User size={17} />
                  Iniciar sesión
                </Link>

                <Link
                  to="/register"
                  onClick={() => setShowMobileMenu(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <>
                {isAdminPage && (
                  <Link
                    to="/admin"
                    onClick={() => setShowMobileMenu(false)}
                    className={linkStyle(location.pathname === "/admin")}
                  >
                    <LayoutDashboard size={17} />
                    Panel administrativo
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className={linkStyle(isProfilePage)}
                >
                  <User size={17} />
                  Mi perfil
                </Link>

                {isProfilePage && (
                  <Link
                    to="/profile?edit=true"
                    onClick={() => setShowMobileMenu(false)}
                    className="ml-4 inline-flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Pencil size={16} />
                    Editar perfil
                  </Link>
                )}

                <div className="my-2 h-px bg-slate-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <LogOut size={17} />
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;