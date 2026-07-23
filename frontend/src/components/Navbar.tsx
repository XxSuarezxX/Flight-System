function Navbar() {
  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <img
            src="/airplane.svg"
            alt="Flight System"
            className="w-10 h-10"
          />

          <h1 className="text-2xl font-bold text-blue-600">
            Flight System
          </h1>
        </div>

        <span className="text-gray-600 font-medium">
          Login
        </span>
      </nav>
    </header>
  );
}

export default Navbar;