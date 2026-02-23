"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/lawnies_logo.svg"
            alt="Lawnies"
            className="h-10 w-auto mx-auto mb-4"
            style={{
              filter:
                "brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(110deg)",
            }}
          />
          <h1 className="text-2xl font-black text-white">Admin Login</h1>
          <p className="text-slate-400 text-sm mt-1">Super admin access only</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-6 py-3 text-base font-bold text-white hover:bg-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
