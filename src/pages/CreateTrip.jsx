import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { readTrips, writeTrips } from "../utils/tripStorage";

const initialForm = {
  tripName: "",
  destination: "",
  startDate: "",
  endDate: "",
  budget: "",
  description: "",
};

const defaultItinerary = [
  { day: "Day 1", places: [] },
  { day: "Day 2", places: [] },
  { day: "Day 3", places: [] },
];

const defaultBudget = {
  Accommodation: 0,
  Food: 0,
  Transportation: 0,
  Activities: 0,
};

const getStatus = (endDate) => {
  if (!endDate) return "Upcoming";
  return new Date(endDate) >= new Date() ? "Upcoming" : "Completed";
};

export default function CreateTrip() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!editId) return;
    const stored = localStorage.getItem("travelPlannerTrips");
    if (!stored) return;
    const trips = JSON.parse(stored);
    const trip = trips.find((item) => item.id === editId);
    if (trip) {
      setFormData({
        tripName: trip.name,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: String(trip.budget || ""),
        description: trip.description || "",
      });
    }
  }, [editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.tripName.trim())
      nextErrors.tripName = "Trip name is required.";
    if (!formData.destination.trim())
      nextErrors.destination = "Destination is required.";
    if (!formData.startDate) nextErrors.startDate = "Start date is required.";
    if (!formData.endDate) nextErrors.endDate = "End date is required.";
    if (!formData.budget) nextErrors.budget = "Budget is required.";
    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      nextErrors.endDate = "End date must be after start date.";
    }
    if (formData.budget && Number(formData.budget) <= 0) {
      nextErrors.budget = "Budget must be a positive number.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const loadTrips = () => readTrips();

  const saveTrips = (trips) => {
    writeTrips(trips);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const newTrip = {
      id: editId || `trip-${Date.now()}`,
      name: formData.tripName,
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: Number(formData.budget),
      description: formData.description,
      status: getStatus(formData.endDate),
      itinerary: defaultItinerary,
      budgetBreakdown: defaultBudget,
      createdAt: new Date().toISOString(),
    };

    const trips = loadTrips();
    let updatedTrips;
    if (editId) {
      updatedTrips = trips.map((trip) =>
        trip.id === editId ? { ...trip, ...newTrip } : trip,
      );
      setMessage("Your trip has been updated! Redirecting shortly...");
    } else {
      updatedTrips = [newTrip, ...trips];
      setMessage("Your trip has been saved! Redirecting shortly...");
    }

    saveTrips(updatedTrips);

    setTimeout(() => {
      navigate("/dashboard");
    }, 1200);

    setTimeout(() => {
      setLoading(false);
    }, 1400);
  };

  const title = editId ? "Edit Trip" : "Create New Trip";
  const subtitle = editId
    ? "Update the travel plan details"
    : "Plan your next journey in minutes";
  const actionLabel = editId ? "Update Trip" : "Create Trip";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-12">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-2xl shadow-slate-200"
        >
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-500">
              {title}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl text-slate-900">
              {subtitle}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Use this form to capture the destination, dates, and budget for
              your next adventure.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">
                  Trip Name
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    ✈️
                  </span>
                  <input
                    type="text"
                    name="tripName"
                    value={formData.tripName}
                    onChange={handleChange}
                    placeholder="Summer escape"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                {errors.tripName && (
                  <p className="text-sm text-rose-500">{errors.tripName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">
                  Destination
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    📍
                  </span>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Paris, Tokyo, Bali"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                {errors.destination && (
                  <p className="text-sm text-rose-500">{errors.destination}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 px-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
                {errors.startDate && (
                  <p className="text-sm text-rose-500">{errors.startDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 px-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
                {errors.endDate && (
                  <p className="text-sm text-rose-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Budget
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  💵
                </span>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="5000"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              {errors.budget && (
                <p className="text-sm text-rose-500">{errors.budget}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add a few notes about the trip"
                rows="4"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 px-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-sky-300/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Saving trip..." : actionLabel}
            </button>
          </form>

          {message && (
            <div className="mt-6 rounded-3xl border border-sky-400/30 bg-sky-50 px-5 py-4 text-slate-900 shadow-lg shadow-sky-200">
              {message}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
