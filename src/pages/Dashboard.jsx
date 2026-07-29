import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "../firebase.config";
import { readTrips, writeTrips } from "../utils/tripStorage";

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState("");
  const [userName, setUserName] = useState("Traveler");

  useEffect(() => {
    const loadTrips = () => setTrips(readTrips());
    loadTrips();

    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserName(
        currentUser.displayName ||
          currentUser.email?.split("@")[0] ||
          "Traveler",
      );
    }

    const handleTripsUpdated = () => loadTrips();
    window.addEventListener("travelPlannerTripsUpdated", handleTripsUpdated);

    return () => {
      window.removeEventListener(
        "travelPlannerTripsUpdated",
        handleTripsUpdated,
      );
    };
  }, []);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) =>
      `${trip.name} ${trip.destination}`
        .toLowerCase()
        .includes(filter.toLowerCase()),
    );
  }, [filter, trips]);

  const upcomingTrips = trips.filter(
    (trip) => new Date(trip.startDate) >= new Date(),
  );
  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
  const activeItineraries = trips.filter(
    (trip) => new Date(trip.endDate) >= new Date(),
  ).length;

  const metrics = [
    { label: "Total Trips Created", value: trips.length, icon: "🧳" },
    { label: "Upcoming Trips", value: upcomingTrips.length, icon: "✈️" },
    {
      label: "Total Budget Overview",
      value: `$${totalBudget.toLocaleString()}`,
      icon: "💰",
    },
    { label: "Active Itineraries", value: activeItineraries, icon: "🗺️" },
  ];

  const deleteTrip = (tripId) => {
    const confirmed = window.confirm(
      "Delete this trip? This cannot be undone.",
    );
    if (!confirmed) return;

    const tripsList = readTrips();
    const updated = tripsList.filter((item) => item.id !== tripId);
    writeTrips(updated);
    setTrips(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-amber-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-[2rem] border border-slate-200 bg-slate-100/90 p-8 shadow-xl shadow-slate-200"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-500">
                My Trips
              </p>
              <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
                Hello, {userName}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Browse your saved travel plans, track budgets, and keep every
                itinerary organized in one elegant dashboard.
              </p>
            </div>
            <Link
              to="/create-trip"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-amber-400 px-7 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-sky-200 transition hover:scale-[1.02]"
            >
              Create New Trip
            </Link>
          </div>
        </motion.section>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: index * 0.08 }}
              className="rounded-[1.8rem] border border-slate-200 bg-sky-50/80 p-6 shadow-sm shadow-slate-200 hover:-translate-y-1 hover:shadow-lg transition"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-100 text-2xl shadow-md shadow-slate-200">
                {item.icon}
              </div>
              <p className="mt-6 text-sm uppercase tracking-[0.25em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {item.value}
              </p>
            </motion.div>
          ))}
        </section>

        <section className="mt-12">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-500">
                Trips
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                Manage your travel history
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              {trips.length} trips saved in your dashboard
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search trips
            </label>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by name or destination"
              className="w-full rounded-3xl border border-slate-200 bg-white py-3 px-4 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          {trips.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-amber-50/70 p-10 text-center shadow-sm shadow-slate-200">
              <p className="text-xl font-semibold text-slate-900">
                No trips created yet
              </p>
              <p className="mt-3 text-slate-600">
                Start planning your first itinerary and it will appear here.
              </p>
              <Link
                to="/create-trip"
                className="mt-6 inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-200 transition hover:bg-sky-600"
              >
                Create Your First Trip
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              {filteredTrips.map((trip) => {
                const status =
                  trip.status ||
                  (new Date(trip.endDate) >= new Date()
                    ? "Upcoming"
                    : "Completed");
                const duration = Math.max(
                  1,
                  Math.round(
                    (new Date(trip.endDate) - new Date(trip.startDate)) /
                      (1000 * 60 * 60 * 24),
                  ),
                );

                return (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65 }}
                    className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200 hover:-translate-y-1 hover:shadow-lg transition"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                          {trip.destination}
                        </p>
                        <h3 className="mt-3 text-2xl font-semibold text-slate-900">
                          {trip.name}
                        </h3>
                      </div>
                      <span
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          status === "Upcoming"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                        <p className="font-semibold text-slate-900">Dates</p>
                        <p className="mt-2">
                          {trip.startDate} — {trip.endDate}
                        </p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                        <p className="font-semibold text-slate-900">Budget</p>
                        <p className="mt-2">${trip.budget.toLocaleString()}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                        <p className="font-semibold text-slate-900">Duration</p>
                        <p className="mt-2">{duration} days</p>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Link
                        to={`/trip/${trip.id}`}
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-600"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/create-trip?edit=${trip.id}`}
                        className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                      >
                        Edit Trip
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteTrip(trip.id)}
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-200"
                      >
                        Delete Trip
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
