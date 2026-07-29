import { motion } from "framer-motion";

const features = [
  {
    icon: "📝",
    title: "Create & Manage Itineraries",
    description: "Build day-by-day itineraries and keep every detail in one place.",
  },
  {
    icon: "📅",
    title: "Day-wise Trip Planning",
    description: "Organize your schedule with clear, easy-to-use timelines.",
  },
  {
    icon: "💰",
    title: "Budget Tracking",
    description: "Track your spending, stay within limits, and avoid surprises.",
  },
  {
    icon: "📊",
    title: "Interactive Dashboard",
    description: "Visualize your entire journey with a modern dashboard.",
  },
  {
    icon: "🔒",
    title: "Secure Firebase Authentication",
    description: "Secure sign-in and account protection for every traveler.",
  },
  {
    icon: "📱",
    title: "Responsive Design",
    description: "Works seamlessly across mobiles, tablets, and desktops.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 text-slate-800">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-[2rem] bg-gradient-to-r from-blue-400 via-sky-500 to-indigo-400 p-12 shadow-2xl"
        >
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-100">
              Plan smarter, travel farther
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl text-white">
              About Travel Planner
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-50">
              Travel Planner is a modern travel management platform designed to help you create personalized itineraries, manage your budget, and organize every trip with ease. Plan smarter, stay organized, and enjoy a seamless travel experience from start to finish.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-16 grid gap-6 md:grid-cols-2"
        >
          <div className="rounded-[1.75rem] bg-gradient-to-br from-blue-100 to-sky-50 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-900">
              Why Travel Planner?
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              We help travelers move from scattered notes to organized planning.
              Create itineraries, manage expenses, and visualize your journey in
              one beautiful and easy-to-use platform.
            </p>
          </div>

          <div className="rounded-[1.75rem] bg-gradient-to-br from-indigo-100 to-blue-50 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-900">Mission</h2>

            <p className="mt-5 leading-8 text-slate-700">
              Our mission is to simplify travel planning and make every trip
              stress-free, organized, and enjoyable for modern travelers.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16"
        >
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-600">
              Features
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              Built for modern travel planning
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Everything you need to organize trips, manage budgets, and travel
              smarter with confidence.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[1.75rem] bg-gradient-to-br from-white to-blue-50 p-7 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 text-2xl text-white shadow-md">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
