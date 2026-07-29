import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase.config";
import Footer from "../components/Footer";

const publicNavItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
];

const protectedNavItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Analytics", path: "/analytics" },
  { label: "Create Trip", path: "/create-trip" },
];

export default function MainLayout({ children }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  const navItems = isAuthenticated ? protectedNavItems : publicNavItems;

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-400 font-semibold"
      : "text-blue-200 hover:text-blue-100";

  const bgClass = "bg-blue-50";
  const navBgClass = "bg-blue-950/90 border-blue-800/15";

  return (
    <div className={`min-h-screen flex flex-col ${bgClass}`}>
      <header
        className={`sticky top-0 z-50 border-b ${navBgClass} backdrop-blur-xl shadow-2xl shadow-blue-950/20`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-bold tracking-tight text-white"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30 text-lg text-white">
              ✈
            </span>
            <span className="text-lg font-semibold">TravelPlanner</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  location.pathname === item.path
                    ? "bg-blue-900 text-white shadow-md shadow-blue-950/20"
                    : `${isActive(item.path)} hover:bg-blue-900 hover:text-white`
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="rounded-full border border-blue-700 bg-blue-950/90 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-blue-950/20 transition hover:border-cyan-400 hover:bg-blue-900"
              >
                Login
              </Link>
            ) : (
              <Link
                to="/profile"
                className="rounded-full border border-blue-700 bg-blue-950/90 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-blue-950/20 transition hover:border-cyan-400 hover:bg-blue-900"
              >
                Profile
              </Link>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-blue-700 bg-blue-950/90 text-blue-200 shadow-lg shadow-blue-950/20 transition hover:bg-blue-900 md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t bg-blue-950/95 border-blue-800/15 px-4 py-5 md:hidden">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    location.pathname === item.path
                      ? "bg-blue-900 text-white"
                      : `${isActive(item.path)} hover:bg-blue-900 hover:text-white`
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>
      {location.pathname !== "/login" && <Footer />}
    </div>
  );
}
