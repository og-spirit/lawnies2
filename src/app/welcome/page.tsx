"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { FormSection } from "@/lib/welcome-sections";

const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/7AWfKrsJ8yR6Hg3YR8UM/webhook-trigger/fbc7825f-af9d-4281-b930-5e35f2422f6c";

interface WelcomeConfig {
  title: string;
  content: string;
  sub_text_1: string;
  sub_text_2: string;
  video_url: string;
  show_video: boolean;
  form_sections: FormSection[];
  operator: {
    email: string;
    business_name: string;
    phone: string;
  } | null;
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
    const url = sessionId
      ? `/api/welcome/config?session_id=${encodeURIComponent(sessionId)}`
      : "/api/welcome/config";
    fetch(url)
      .then((res) => res.json())
      .then((data: WelcomeConfig) => {
        setConfig(data);
        // Initialise response keys from sections
        const initial: Record<string, string> = {};
        data.form_sections?.forEach((section, si) => {
          section.fields.forEach((_, fi) => {
            initial[`s${si}_f${fi}`] = "";
          });
        });
        setResponses(initial);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sessionId]);

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponses((prev) => ({ ...prev, [key]: e.target.value }));
  };

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
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitError("Something went wrong saving your setup. Please try again.");
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-50">
          <img src="/lawnies_logo.svg" alt="Lawnies" className="h-9 w-auto" />
          <span className="text-sm text-slate-500">Welcome page</span>
        </nav>
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="text-5xl mb-6">✅</div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">Setup complete!</h1>
          <p className="text-slate-500 max-w-md">
            We&apos;ll personally configure your receptionist and confirm once everything is ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-50">
        <img src="/lawnies_logo.svg" alt="Lawnies" className="h-9 w-auto" />
        <span className="text-sm text-slate-500">Welcome page</span>
      </nav>

      <main className="px-6 py-12 md:py-16">
        <div className="w-full max-w-xl mx-auto space-y-8">

          {/* Header */}
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Step 1 of 1: Welcome
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
              {config?.title || "Welcome to Lawnies"}
            </h1>
            {config?.content && (
              <p className="text-lg text-slate-600 mb-4">{config.content}</p>
            )}
            {config?.sub_text_1 && (
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                {config.sub_text_1}
              </p>
            )}
            {config?.sub_text_2 && (
              <p className="text-sm text-slate-400 max-w-sm mx-auto mt-2">
                {config.sub_text_2}
              </p>
            )}
          </div>

          {/* Gumlet video */}
          {config?.show_video && config?.video_url && (
            <div className="rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
              <iframe
                src={config.video_url}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}

          {/* Account Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-base font-black text-slate-900 mb-1">Account Summary</h2>
            <p className="text-xs text-slate-400 mb-5">These details are already saved.</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  Account Email
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {config?.operator?.email || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  Business Name
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {config?.operator?.business_name || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  Phone Number
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {config?.operator?.phone || "—"}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Need to update these?{" "}
              <a href="mailto:stefan@lawnies.com.au" className="text-emerald-600 hover:underline">
                Contact support.
              </a>
            </p>
          </div>

          {/* Dynamic form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {config?.form_sections?.map((section, si) => (
              <div key={si} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                <h2 className="text-base font-black text-slate-900">{section.title}</h2>
                {section.fields.map((field, fi) => (
                  <div key={fi}>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      {field.label}
                    </label>
                    <textarea
                      rows={3}
                      value={responses[`s${si}_f${fi}`] || ""}
                      onChange={handleChange(`s${si}_f${fi}`)}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none bg-slate-50"
                    />
                  </div>
                ))}
              </div>
            ))}

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                {submitError}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-base font-bold text-white hover:bg-emerald-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving…" : "Complete My Setup →"}
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                We&apos;ll personally configure your receptionist and confirm once everything is ready.
              </p>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-slate-950 py-6 text-center mt-10">
        <div className="flex items-center justify-center mb-3">
          <img
            src="/lawnies_logo.svg"
            alt="Lawnies"
            className="h-7 w-auto"
            style={{
              filter: "brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(110deg)",
            }}
          />
        </div>
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
