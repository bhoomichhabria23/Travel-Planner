export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">
          © {new Date().getFullYear()} TravelPlanner. All rights reserved.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="hover:text-white transition">Privacy</span>
          <span className="hover:text-white transition">Terms</span>
          <span className="hover:text-white transition">Support</span>
        </div>
      </div>
    </footer>
  );
}
