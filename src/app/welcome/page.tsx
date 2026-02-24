"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/7AWfKrsJ8yR6Hg3YR8UM/webhook-trigger/fbc7825f-af9d-4281-b930-5e35f2422f6c";

interface WelcomeConfig {
  title: string;
  content: string;
  video_url: string;
  onboarding_questions: string[];
}

function WelcomeContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [config, setConfig] = useState<WelcomeConfig | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const contactId = urlParams.get("cid");
    const opportunityId = urlParams.get("oid");

    if (contactId || opportunityId) {
      fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId,
          opportunityId,
          page: "welcome",
          timestamp: new Date().toISOString(),
        }),
      });
    }
  }, []);

  useEffect(() => {
    fetch("/api/welcome/config")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/welcome/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, responses }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitError("Something went wrong saving your responses. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="w-full px-6 py-4 flex items-center border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <img src="/lawnies_logo.svg" alt="Lawnies" className="h-9 w-auto" />
      </nav>

      <main className="px-6 py-12 md:py-16">
        <div className="w-full max-w-3xl mx-auto space-y-10">
          {/* Welcome header */}
          <section className="text-center">
            <div className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              You&apos;re in!
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              {config?.title || "Welcome to Lawnies"}
            </h1>
            {config?.content && (
              <p className="text-lg text-slate-600 max-w-xl mx-auto">
                {config.content}
              </p>
            )}
          </section>

          {/* Video */}
          {config?.video_url && (
            <section className="rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
              <iframe
                src={config.video_url}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </section>
          )}

          {/* Onboarding survey */}
          {config?.onboarding_questions &&
            config.onboarding_questions.length > 0 && (
              <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
                {!submitted ? (
                  <>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">
                      Quick setup questions
                    </h2>
                    <p className="text-slate-500 text-sm mb-6">
                      Help us configure your receptionist perfectly.
                    </p>

                    {submitError && (
                      <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                        {submitError}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {config.onboarding_questions.map((question, index) => (
                        <div key={index}>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {question}
                          </label>
                          <input
                            type="text"
                            value={responses[String(index)] || ""}
                            onChange={(e) =>
                              setResponses((prev) => ({
                                ...prev,
                                [String(index)]: e.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                            placeholder="Your answer…"
                          />
                        </div>
                      ))}

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-4 text-base font-bold text-white hover:bg-emerald-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {submitting ? "Saving…" : "Submit answers"}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">
                      Thanks! We&apos;ve got your answers.
                    </h3>
                    <p className="text-slate-500">
                      We&apos;ll be in touch within 48 hours to get you set up.
                    </p>
                  </div>
                )}
              </section>
            )}

          {/* Next steps */}
          <section className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-black text-slate-900 mb-4">
              What happens now
            </h2>
            <ul className="space-y-3">
              {[
                "Our team will contact you within 48 hours",
                "We'll configure your receptionist with your services and pricing",
                "You forward your business calls to us",
                "We go live — you stop missing jobs",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-black">
                    {i + 1}
                  </span>
                  <span className="text-slate-700 font-medium">{step}</span>
                </li>
              ))}
            </ul>
          </section>

          <p className="text-center text-slate-500 text-sm">
            Questions? Call us on{" "}
            <a
              href="tel:0431847833"
              className="text-emerald-600 font-semibold hover:underline"
            >
              0431 847 833
            </a>
          </p>
        </div>
      </main>

      <footer className="bg-slate-950 py-6 text-center mt-10">
        <p className="text-slate-500 text-xs">© 2026 Lawnies. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-slate-500">Loading…</div>
        </div>
      }
    >
      <WelcomeContent />
    </Suspense>
  );
}
