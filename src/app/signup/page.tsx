"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const valuePoints = [
  "24/7 call answering",
  "Job requests secured before they call someone else",
  "Booking details sent instantly to your phone",
  "You stay in control of scheduling",
];

const nextSteps = [
  "We configure your services and pricing",
  "You forward your calls",
  "We go live within 48 hours",
];

export default function SignupPage() {
  const router = useRouter();
  const formRef = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      businessName: (form.elements.namedItem("businessName") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/signup/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = json.url;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <img src="/lawnies_logo.svg" alt="Lawnies" className="h-9 w-auto" />
        <a
          href="/"
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Back
        </a>
      </nav>

      <main className="px-6 py-12 md:py-16">
        <div className="w-full max-w-2xl mx-auto space-y-10 md:space-y-12">
          <section className="text-center">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
              Activate your 24/7 Receptionist
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
              Stop missing calls while you&apos;re on the mower.
            </p>
          </section>

          <section className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-5">
              You&apos;re getting:
            </h2>
            <ul className="space-y-3">
              {valuePoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="text-emerald-500 font-black mt-0.5">✓</span>
                  <span className="text-slate-700 font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-6">
              Your Booking Protection
            </h2>
            <p className="text-5xl md:text-6xl font-black text-emerald-600 tracking-tight">
              $197
              <span className="text-2xl md:text-3xl font-bold"> per month + GST</span>
            </p>
            <div className="my-7 mx-auto h-px w-12 bg-slate-200" />
            <div className="space-y-1">
              <p className="text-base md:text-lg font-semibold text-slate-800">
                One-time professional setup
              </p>
              <p className="text-3xl md:text-4xl font-bold text-slate-800">$597 + GST</p>
              <p className="text-sm text-slate-500 font-medium">
                Includes your first month
              </p>
            </div>
            <p className="mt-6 text-sm font-semibold text-slate-500">
              No lock-in contracts. Cancel anytime.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-base font-bold text-white hover:bg-emerald-600 transition-colors"
              >
                Proceed to activation →
              </button>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-4">
              What happens next
            </h2>
            <ul className="space-y-3">
              {nextSteps.map((step) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="text-emerald-500 font-black mt-0.5">✓</span>
                  <span className="text-slate-700 font-medium">{step}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="text-center">
            <p className="text-xs text-slate-500">
              Prefer to talk it through first?
            </p>
            <p className="text-xs text-slate-500 mt-1">Call us on 0431 847 833</p>
          </section>

          <section
            ref={formRef as React.RefObject<HTMLElement>}
            id="activation-form"
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 scroll-mt-28"
          >
            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                {error}
              </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit}>
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
                  placeholder="you@example.com"
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
                  minLength={8}
                  required
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                />
              </div>

              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Business Name
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  placeholder="Your lawn care business"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="0412 345 678"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    name="legal"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-300"
                  />
                  <span>
                    I agree to the{" "}
                    <a
                      href="https://lawnies.com.au/terms"
                      className="text-emerald-600 hover:text-emerald-700 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://lawnies.com.au/privacy"
                      className="text-emerald-600 hover:text-emerald-700 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-lg font-bold text-white hover:bg-emerald-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Redirecting to checkout…"
                  ) : (
                    <>
                      Activate My Receptionist
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-sm text-slate-500">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </form>
          </section>
        </div>
      </main>

      <footer className="bg-slate-950 py-7 text-center mt-14">
        <div className="flex items-center justify-center mb-4">
          <img
            src="/lawnies_logo.svg"
            alt="Lawnies"
            className="h-7 w-auto"
            style={{
              filter:
                "brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(110deg)",
            }}
          />
        </div>
        <p className="text-slate-500 text-xs">© 2026 Lawnies. All rights reserved.</p>
        <p className="text-slate-500 text-xs mt-2">
          <a
            href="https://lawnies.com.au/privacy"
            className="text-slate-400 underline hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          <span className="mx-2 text-slate-600">|</span>
          <a
            href="https://lawnies.com.au/terms"
            className="text-slate-400 underline hover:text-white transition-colors"
          >
            Terms of Service
          </a>
        </p>
      </footer>
    </div>
  );
}
