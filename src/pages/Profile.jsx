import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.config";

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Traveler",
    email: "guest@travelplanner.app",
  });
  const [tripStats, setTripStats] = useState({ trips: 0, destinations: 0 });

  useEffect(() => {
    const storedTrips = localStorage.getItem("travelPlannerTrips");
    if (storedTrips) {
      const trips = JSON.parse(storedTrips);
      setTripStats({
        trips: trips.length,
        destinations: new Set(
          trips.map((trip) => trip.destination?.trim()).filter(Boolean),
        ).size,
      });
    }

    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name:
          currentUser.displayName ||
          currentUser.email?.split("@")[0] ||
          "Traveler",
        email: currentUser.email || "guest@travelplanner.app",
        createdAt: currentUser.metadata?.creationTime,
      });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch {
      console.warn("Logout failed or user not signed in");
    }
    navigate("/login");
  };

  const bgClass = "bg-slate-50";
  const textClass = "text-slate-900";
  const cardBgClass = "bg-white border-slate-200";
  const cardHoverBgClass = "bg-slate-50 border-slate-200";

  return (
    <div className={`min-h-screen ${bgClass} py-12`}>
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400">
              Profile
            </p>
            <h1 className={`mt-3 text-4xl font-semibold ${textClass}`}>
              Your account details
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
              Manage your personal settings and view your account information in
              one place.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section
            className={`rounded-[2rem] border ${cardBgClass} p-8 shadow-lg`}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 text-3xl font-bold text-white shadow-lg shadow-sky-500/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-sky-500">
                    Account holder
                  </p>
                  <h2 className={`mt-2 text-3xl font-semibold ${textClass}`}>
                    {user.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div
                  className={`rounded-[1.8rem] border ${cardHoverBgClass} p-5 text-sm text-slate-600`}
                >
                  <p className={`font-semibold ${textClass}`}>Trips planned</p>
                  <p className={`mt-3 text-3xl font-semibold ${textClass}`}>
                    {tripStats.trips}
                  </p>
                </div>
                <div
                  className={`rounded-[1.8rem] border ${cardHoverBgClass} p-5 text-sm text-slate-600`}
                >
                  <p className={`font-semibold ${textClass}`}>
                    Unique destinations
                  </p>
                  <p className={`mt-3 text-3xl font-semibold ${textClass}`}>
                    {tripStats.destinations}
                  </p>
                </div>
              </div>

              <div
                className={`mt-6 rounded-[1.8rem] border ${cardHoverBgClass} p-6`}
              >
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                  Account information
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-600">Member since</p>
                    <p className={`mt-2 text-base font-semibold ${textClass}`}>
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Account type</p>
                    <p className={`mt-2 text-base font-semibold ${textClass}`}>
                      Premium Traveler
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className={`rounded-[2rem] border ${cardBgClass} p-8 shadow-lg`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                  Preferences
                </p>
                <h2 className={`mt-2 text-2xl font-semibold ${textClass}`}>
                  Account settings
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div
                className={`rounded-[1.8rem] border ${cardHoverBgClass} px-6 py-5`}
              >
                <p className={`text-sm font-semibold ${textClass}`}>Security</p>
                <p className="mt-2 text-sm text-slate-600">
                  Logout to protect your session and access the login flow
                  again.
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
                >
                  Logout Now
                </button>
              </div>

              <div
                className={`rounded-[1.8rem] border ${cardHoverBgClass} px-6 py-5`}
              >
                <p className={`text-sm font-semibold ${textClass}`}>Support</p>
                <p className="mt-2 text-sm text-slate-600">
                  Need help? Reach out to our travel support team from the login
                  page.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
