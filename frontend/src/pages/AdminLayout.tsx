import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plane,
  MapPin,
  Building2,
  Globe2,
  Users,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Flights",
    path: "/admin/flights",
    icon: Plane,
  },
  {
    name: "Airports",
    path: "/admin/airports",
    icon: MapPin,
  },
  {
    name: "Cities",
    path: "/admin/cities",
    icon: Building2,
  },
  {
    name: "Countries",
    path: "/admin/countries",
    icon: Globe2,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === path;
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const currentPage =
    navigation.find((item) => isActive(item.path))?.name ?? "Administration";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">
        <Link
          to="/admin"
          onClick={closeMobileMenu}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-md shadow-blue-700/20">
            <Plane size={21} />
          </div>

          <div>
            <p className="text-base font-bold tracking-tight text-slate-900">
              Flight System
            </p>
            <p className="text-xs text-slate-500">Administration</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          {isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-slate-950 text-white shadow-2xl shadow-slate-950/20 transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="border-b border-white/[0.08] px-6 py-7">
          <Link
            to="/admin"
            onClick={closeMobileMenu}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-950/50">
              <Plane size={24} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Flight System
              </h1>
              <p className="mt-1 text-xs font-medium tracking-wide text-slate-400">
                ADMINISTRATION
              </p>
            </div>
          </Link>
        </div>

        {/* Admin badge */}
        <div className="mx-4 mt-6 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
            <ShieldCheck size={21} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              Admin Panel
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Management console
            </p>
          </div>

          <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Main menu
          </p>

          {navigation.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-sky-300" />
                )}

                <Icon
                  size={19}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={`shrink-0 transition-colors ${
                    active
                      ? "text-white"
                      : "text-slate-500 group-hover:text-slate-200"
                  }`}
                />

                <span className="flex-1">{item.name}</span>

                {active && (
                  <ChevronRight
                    size={16}
                    className="text-blue-100"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/[0.08] p-4">
          <div className="mb-3 rounded-xl bg-white/[0.04] px-3 py-3">
            <p className="text-xs font-medium text-slate-300">
              Flight System
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Administrative workspace
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400/50"
          >
            <LogOut
              size={19}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen lg:pl-[280px]">
        {/* Desktop topbar */}
        <header className="sticky top-0 z-30 hidden h-[72px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-8 backdrop-blur-xl lg:flex xl:px-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Flight System</span>
              <ChevronRight size={13} />
              <span className="font-medium text-slate-600">
                Administration
              </span>
            </div>

            <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
              {currentPage}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Administrator
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Management workspace
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
              <ShieldCheck size={20} />
            </div>
          </div>
        </header>

        {/* Mobile page title */}
        <div className="border-b border-slate-200/80 bg-white px-5 py-4 lg:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Administration</span>
            <ChevronRight size={13} />
            <span className="font-medium text-slate-600">{currentPage}</span>
          </div>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            {currentPage}
          </h2>
        </div>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
  
export default AdminLayout;