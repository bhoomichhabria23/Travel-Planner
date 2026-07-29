import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        await createUserWithEmailAndPassword(auth, email, pass);
      }
      nav("/dashboard");
    } catch (err) {
      setError(err.message || "Auth failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-900/40 text-slate-100">
      <div className="grid min-h-screen md:grid-cols-2">
        <div
          className="relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-slate-900/60" />
          <div className="relative flex h-full items-center justify-center p-8">
            <div className="max-w-md text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-200/80">
                Travel blogger
              </p>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">
                Travel is the only thing you buy that makes you richer
              </h1>
              <p className="mt-6 text-slate-200/90">
                Join the community and manage your trips with ease.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md rounded-3xl bg-blue-50 p-8 text-slate-900 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <button
                className="text-sm text-blue-600"
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Name
                  </label>
                  <input
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@mail.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
                type="submit"
                disabled={busy}
              >
                {busy ? "Loading…" : mode === "login" ? "Log in" : "Register"}
              </button>
            </form>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
