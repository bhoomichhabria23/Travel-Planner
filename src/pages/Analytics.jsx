import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { normalizeBudgetBreakdown, readTrips } from "../utils/tripStorage";

const defaultCategories = [
  "Accommodation",
  "Food",
  "Transportation",
  "Activities",
];
const fallbackDistribution = {
  Accommodation: 40,
  Food: 25,
  Transportation: 20,
  Activities: 15,
};

const formatCurrency = (value) => `$${Number(value).toLocaleString()}`;

export default function Analytics() {
  const [trips, setTrips] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const loadTrips = () => setTrips(readTrips());
    loadTrips();

    const handleStorageChange = () => loadTrips();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadTrips();
      }
    };

    window.addEventListener("travelPlannerTripsUpdated", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener(
        "travelPlannerTripsUpdated",
        handleStorageChange,
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [location.pathname]);

  const analytics = useMemo(() => {
    const now = new Date();
    const upcomingTrips = trips.filter(
      (trip) => new Date(trip.startDate) >= now,
    );
    const totalBudget = trips.reduce(
      (sum, trip) => sum + (trip.budget || 0),
      0,
    );
    const destinations = new Set(
      trips.map((trip) => trip.destination?.trim()).filter(Boolean),
    );

    const categoryTotals = defaultCategories.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {});

    const trend = [...trips]
      .filter((trip) => trip.startDate)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .map((trip) => ({
        name: trip.startDate,
        budget: trip.budget || 0,
      }));

    trips.forEach((trip) => {
      const breakdown = normalizeBudgetBreakdown(trip.budgetBreakdown || {});
      const amount = trip.budget || 0;
      if (Object.values(breakdown).some((value) => Number(value) > 0)) {
        defaultCategories.forEach((category) => {
          categoryTotals[category] += Number(breakdown[category] || 0);
        });
      } else {
        defaultCategories.forEach((category) => {
          categoryTotals[category] += Math.round(
            (fallbackDistribution[category] / 100) * amount,
          );
        });
      }
    });

    const pieData = defaultCategories.map((category) => ({
      name: category,
      value: categoryTotals[category],
    }));

    const barData = defaultCategories.map((category) => ({
      category,
      amount: categoryTotals[category],
    }));

    return {
      upcomingTrips: upcomingTrips.length,
      totalBudget,
      destinationsVisited: destinations.size,
      pieData,
      barData,
      trend,
    };
  }, [trips]);

  const hasTrips = trips.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 py-12 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-500">
              Analytics
            </p>
            <h1 className="mt-3 text-4xl font-semibold sm:text-5xl text-slate-900">
              Travel insights & budget trends
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Monitor trip performance, spending categories, and destinations
              visited from one modern analytics dashboard.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Total Trips
            </p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">
              {trips.length}
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Total number of travel plans recorded.
            </p>
          </div>
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Upcoming Trips
            </p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">
              {analytics.upcomingTrips}
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Trips with upcoming start dates.
            </p>
          </div>
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Total Budget
            </p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">
              {formatCurrency(analytics.totalBudget)}
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Total planned spending across all trips.
            </p>
          </div>
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Destinations Visited
            </p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">
              {analytics.destinationsVisited}
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Unique destinations captured in your trips.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                  Budget Allocation
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Spending by category
                </h2>
              </div>
              <p className="text-sm text-slate-600">
                Pie chart shows where budget is allocated.
              </p>
            </div>
            <div className="h-[320px]">
              {hasTrips ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Pie
                      data={analytics.pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      innerRadius={52}
                      paddingAngle={4}
                    >
                      {analytics.pieData.map((entry, index) => (
                        <Cell
                          key={`slice-${index}`}
                          fill={
                            ["#0ea5e9", "#22c55e", "#f59e0b", "#e11d48"][
                              index % 4
                            ]
                          }
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-3xl bg-slate-50 text-slate-500">
                  No trip data available yet.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                  Category spending
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Latest spending distribution
                </h2>
              </div>
              <p className="text-sm text-slate-600">
                Bar chart reflects budgets per category.
              </p>
            </div>
            <div className="h-[320px]">
              {hasTrips ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.barData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="category"
                      tick={{ fill: "#475569", fontSize: 12 }}
                    />
                    <YAxis
                      tickFormatter={(value) => `$${value}`}
                      tick={{ fill: "#475569", fontSize: 12 }}
                    />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar
                      dataKey="amount"
                      fill="#0ea5e9"
                      radius={[12, 12, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-3xl bg-slate-50 text-slate-500">
                  Create trips to populate charts.
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                Budget trends
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Budget over time
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Track how your travel budgets evolve across trips.
            </p>
          </div>
          <div className="h-[380px]">
            {hasTrips ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analytics.trend}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#475569", fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: "#475569", fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="budget"
                    stroke="#0ea5e9"
                    strokeWidth={4}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-3xl bg-slate-50 text-slate-500">
                No timeline data yet. Save trips to view trends.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
