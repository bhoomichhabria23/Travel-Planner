export function readTrips() {
  const storedTrips = localStorage.getItem("travelPlannerTrips");
  return storedTrips ? JSON.parse(storedTrips) : [];
}

export function writeTrips(trips) {
  localStorage.setItem("travelPlannerTrips", JSON.stringify(trips));
  window.dispatchEvent(new Event("travelPlannerTripsUpdated"));
}

export function normalizeBudgetBreakdown(breakdown = {}) {
  const normalized = {
    Accommodation: 0,
    Food: 0,
    Transportation: 0,
    Activities: 0,
  };

  const aliases = {
    accommodation: "Accommodation",
    food: "Food",
    transportation: "Transportation",
    activities: "Activities",
    Accommodation: "Accommodation",
    Food: "Food",
    Transportation: "Transportation",
    Activities: "Activities",
  };

  Object.entries(breakdown).forEach(([key, value]) => {
    const normalizedKey = aliases[key] || aliases[key?.toLowerCase?.()];
    if (normalizedKey && normalized[normalizedKey] !== undefined) {
      normalized[normalizedKey] = Number(value || 0);
    }
  });

  return normalized;
}
