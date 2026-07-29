import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  normalizeBudgetBreakdown,
  readTrips,
  writeTrips,
} from "../utils/tripStorage";

const CATEGORY_META = {
  Accommodation: { icon: "🛏️", color: "text-violet-500", bg: "bg-violet-50" },
  Food: { icon: "🍴", color: "text-orange-500", bg: "bg-orange-50" },
  Transportation: { icon: "🚗", color: "text-green-500", bg: "bg-green-50" },
  Activities: { icon: "📷", color: "text-red-400", bg: "bg-red-50" },
};

const getDuration = (s, e) =>
  !s || !e
    ? 0
    : Math.max(1, Math.round((new Date(e) - new Date(s)) / 86400000));

const getStatus = (endDate) =>
  !endDate || new Date(endDate) >= new Date() ? "Upcoming" : "Completed";

const fmt = (n) => `$${Number(n).toLocaleString()}`;

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [budgetBreakdown, setBudgetBreakdown] = useState({});
  const [openDay, setOpenDay] = useState("Day 1");
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [addInputs, setAddInputs] = useState({ place: "", note: "" });
  const [toast, setToast] = useState("");

  useEffect(() => {
    const trips = readTrips();
    const found = trips.find((t) => t.id === id);
    if (!found) return;
    setTrip(found);
    setItinerary(found.itinerary || [{ day: "Day 1", places: [] }]);
    setBudgetBreakdown(normalizeBudgetBreakdown(found.budgetBreakdown || {}));
    setOpenDay("Day 1");
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const saveToStorage = (updatedTrip) => {
    const trips = readTrips();
    const updated = trips.map((t) => (t.id === id ? updatedTrip : t));
    writeTrips(updated);
  };

  const totalAllocated = useMemo(
    () => Object.values(budgetBreakdown).reduce((s, v) => s + Number(v), 0),
    [budgetBreakdown],
  );

  const remaining = trip ? trip.budget - totalAllocated : 0;
  const duration = trip ? getDuration(trip.startDate, trip.endDate) : 0;
  const status = trip ? getStatus(trip.endDate) : "Upcoming";

  const handleAddPlace = (day) => {
    if (!addInputs.place.trim()) return;
    const updated = itinerary.map((s) =>
      s.day === day
        ? {
            ...s,
            places: [
              ...s.places,
              {
                id: `p-${Date.now()}`,
                name: addInputs.place.trim(),
                note: addInputs.note.trim(),
              },
            ],
          }
        : s,
    );
    setItinerary(updated);
    setAddInputs({ place: "", note: "" });
    if (trip) saveToStorage({ ...trip, itinerary: updated });
  };

  const handleRemovePlace = (day, pid) => {
    const updated = itinerary.map((s) =>
      s.day === day
        ? { ...s, places: s.places.filter((p) => p.id !== pid) }
        : s,
    );
    setItinerary(updated);
    if (trip) saveToStorage({ ...trip, itinerary: updated });
  };

  const handleAddDay = () => {
    const next = `Day ${itinerary.length + 1}`;
    const updated = [...itinerary, { day: next, places: [] }];
    setItinerary(updated);
    setOpenDay(next);
    if (trip) saveToStorage({ ...trip, itinerary: updated });
  };

  const handleDeleteDay = (dayLabel) => {
    if (itinerary.length === 1) {
      showToast("Need at least one day!");
      return;
    }
    const updated = itinerary
      .filter((s) => s.day !== dayLabel)
      .map((s, i) => ({ ...s, day: `Day ${i + 1}` }));
    setItinerary(updated);
    setOpenDay(updated[0]?.day || null);
    if (trip) saveToStorage({ ...trip, itinerary: updated });
    showToast("Day removed");
  };

  const handleSaveBudget = () => {
    setIsEditingBudget(false);
    if (trip) {
      saveToStorage({
        ...trip,
        budgetBreakdown: normalizeBudgetBreakdown(budgetBreakdown),
      });
    }
    showToast("Budget saved ✓");
  };

  const handleDeleteTrip = () => {
    if (!window.confirm("Delete this trip? This cannot be undone.")) return;
    const trips = readTrips();
    writeTrips(trips.filter((t) => t.id !== id));
    navigate("/");
  };

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50">
        <p className="text-slate-400 text-xl">Trip not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 text-slate-900">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white text-base font-semibold px-7 py-3 rounded-full shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100 px-10 h-14 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-full px-5 py-2 shadow-sm hover:bg-slate-50 transition"
        >
          ← Back
        </button>
        <span
          className={`text-xs font-bold tracking-widest px-4 py-2 rounded-full border ${
            status === "Upcoming"
              ? "text-violet-600 bg-violet-50 border-violet-200"
              : "text-green-600 bg-green-50 border-green-200"
          }`}
        >
          ✦ {status.toUpperCase()}
        </span>
      </div>

      <div className="bg-white/60 backdrop-blur border-b border-slate-100 px-10 py-8">
        <div className="flex items-baseline gap-4 flex-wrap mb-1">
          <h1 className="text-7xl font-black text-slate-900 tracking-tight leading-none">
            {trip.destination.toLowerCase()}
          </h1>
          <span className="text-5xl font-bold text-orange-400 italic leading-none">
            {trip.name}
          </span>
        </div>
        <p className="text-slate-500 text-base mt-2 mb-6">{trip.description}</p>

        <div className="grid grid-cols-3 w-full rounded-3xl border border-slate-500 bg-gray-200 shadow-sm overflow-hidden">
          {[
            {
              icon: "📅",
              label: "Dates",
              value: `${trip.startDate} — ${trip.endDate}`,
            },
            { icon: "🕐", label: "Duration", value: `${duration} days` },
            { icon: "💰", label: "Budget", value: fmt(trip.budget) },
          ].map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center gap-4 pl-56 py-5 ${i < 2 ? "border-r border-slate-200" : ""}`}
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-900 font-semibold uppercase tracking-widest mb-1">
                  {item.label}
                </p>
                <p className="text-base font-bold text-slate-900">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[60%_40%] gap-6 min-h-[calc(100vh-150px)]">
        <div className="px-10 py-8 border-r border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-lg flex-shrink-0">
              📍
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">Itinerary</p>
              <p className="text-sm text-gray-700">Your Travel Days</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {itinerary.map((section, idx) => {
              const isOpen = openDay === section.day;
              return (
                <div
                  key={section.day}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-violet-300 shadow-md shadow-violet-300"
                      : "border-slate-200 shadow-sm"
                  }`}
                >
                  <div
                    className={`flex items-center gap-3 px-5 ${isOpen ? "bg-violet-50/40" : "bg-white hover:bg-slate-50"} transition`}
                  >
                    <button
                      onClick={() => setOpenDay(isOpen ? null : section.day)}
                      className="flex items-center gap-4 flex-1 py-4 text-left"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                          isOpen
                            ? "bg-violet-600 text-white"
                            : "bg-violet-100 text-violet-600"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-slate-900">
                          {section.day}
                        </p>
                        {!isOpen && (
                          <p className="text-sm text-slate-900 mt-0.5 truncate">
                            {section.places.length === 0
                              ? `No stops yet for ${section.day}`
                              : `${section.places.length} stop${section.places.length > 1 ? "s" : ""}`}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-slate-400 text-sm mr-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      >
                        ⌄
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteDay(section.day)}
                      className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 hover:border-red-300 transition flex-shrink-0"
                    >
                      🗑 Delete
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="px-5 pb-5 pt-3 border-t border-violet-100">
                          {section.places.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-3">
                              No stops yet for {section.day}
                            </p>
                          ) : (
                            <div className="mb-3 flex flex-col gap-1">
                              {section.places.map((place, i) => (
                                <div
                                  key={place.id}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition"
                                >
                                  <div className="w-6 h-6 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {i + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                      {place.name}
                                    </p>
                                    {place.note && (
                                      <p className="text-xs text-slate-400 truncate">
                                        {place.note}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleRemovePlace(section.day, place.id)
                                    }
                                    className="text-xs font-semibold text-red-400 bg-red-50 px-3 py-1 rounded-full hover:bg-red-100 transition flex-shrink-0"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2 mt-3">
                            <input
                              value={addInputs.place}
                              onChange={(e) =>
                                setAddInputs((p) => ({
                                  ...p,
                                  place: e.target.value,
                                }))
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleAddPlace(section.day)
                              }
                              placeholder="Add place or experience…"
                              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-slate-50 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                            />
                            <input
                              value={addInputs.note}
                              onChange={(e) =>
                                setAddInputs((p) => ({
                                  ...p,
                                  note: e.target.value,
                                }))
                              }
                              placeholder="Note…"
                              className="w-28 border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                            />
                            <button
                              onClick={() => handleAddPlace(section.day)}
                              className="bg-violet-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-violet-700 transition flex-shrink-0"
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleAddDay}
            className="mt-4 w-full border-2 border-dashed border-violet-200 text-violet-600 font-semibold text-sm rounded-2xl py-3.5 hover:border-violet-400 hover:bg-violet-50 transition flex items-center justify-center gap-2"
          >
            + Add Day
          </button>
        </div>

        <div className="px-7 py-8 bg-white/40 flex flex-col gap-4">

          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-lg flex-shrink-0">
              💳
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">Budget</p>
              <p className="text-sm text-slate-400">Spending Tracker</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {Object.entries(budgetBreakdown).map(([cat, val], i, arr) => {
              const meta = CATEGORY_META[cat] || {
                icon: "💼",
                color: "text-slate-500",
                bg: "bg-slate-50",
              };
              const pct =
                totalAllocated > 0
                  ? Math.round((val / totalAllocated) * 100)
                  : 0;
              return (
                <div
                  key={cat}
                  className={`flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition ${
                    i < arr.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center text-base flex-shrink-0`}
                  >
                    {meta.icon}
                  </div>
                  <p className="flex-1 text-sm font-semibold text-slate-800">
                    {cat.toLowerCase()}
                  </p>

                  {isEditingBudget ? (
                    <input
                      type="number"
                      value={val}
                      onChange={(e) =>
                        setBudgetBreakdown((b) => ({
                          ...b,
                          [cat]: Number(e.target.value),
                        }))
                      }
                      className="w-24 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-right text-slate-900 bg-slate-50 outline-none focus:border-violet-400 transition"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-900 min-w-[58px] text-right">
                      {fmt(val)}
                    </p>
                  )}

                  <p
                    className={`text-sm font-bold min-w-[34px] text-right ${meta.color}`}
                  >
                    {pct}%
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
              <p className="text-sm text-slate-500 font-medium">Total Budget</p>
              <p className="text-sm font-bold text-slate-900">
                {fmt(trip.budget)}
              </p>
            </div>
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
              <p className="text-sm text-slate-500 font-medium">Allocated</p>
              <p className="text-sm font-bold text-violet-600">
                {fmt(totalAllocated)}
              </p>
            </div>
            <div className="flex justify-between items-center px-5 py-5 bg-green-50/60">
              <p className="text-base font-bold text-slate-900">Remaining</p>
              <p
                className={`text-2xl font-black ${remaining >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {fmt(remaining)}
              </p>
            </div>
          </div>

          {isEditingBudget ? (
            <div className="flex gap-3">
              <button
                onClick={handleSaveBudget}
                className="flex-1 bg-green-500 text-white font-bold text-sm rounded-xl py-3.5 hover:bg-green-600 transition"
              >
                Save Budget
              </button>
              <button
                onClick={() => setIsEditingBudget(false)}
                className="flex-1 bg-violet-50 text-violet-600 border border-violet-200 font-bold text-sm rounded-xl py-3.5 hover:bg-violet-100 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingBudget(true)}
              className="w-full bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl py-3.5 hover:bg-slate-50 shadow-sm transition flex items-center justify-center gap-2"
            >
              ✏️ Edit Budget
            </button>
          )}

          <button
            onClick={handleDeleteTrip}
            className="w-full bg-red-50 border border-red-100 text-red-500 font-bold text-sm rounded-xl py-3.5 hover:bg-red-100 transition"
          >
            🗑 Delete Trip
          </button>
        </div>
      </div>
    </div>
  );
}
