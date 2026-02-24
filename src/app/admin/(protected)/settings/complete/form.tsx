"use client";

import { useState } from "react";

export function CompleteSettingsForm({
  initialSubheadline,
  initialReinforcement1,
  initialReinforcement2,
  initialLogisticsTitle,
  initialLogisticsContent,
  initialCalendarUrl,
  initialCalendarLabel,
}: {
  initialSubheadline: string;
  initialReinforcement1: string;
  initialReinforcement2: string;
  initialLogisticsTitle: string;
  initialLogisticsContent: string;
  initialCalendarUrl: string;
  initialCalendarLabel: string;
}) {
  const [subheadline, setSubheadline] = useState(initialSubheadline);
  const [reinforcement1, setReinforcement1] = useState(initialReinforcement1);
  const [reinforcement2, setReinforcement2] = useState(initialReinforcement2);
  const [logisticsTitle, setLogisticsTitle] = useState(initialLogisticsTitle);
  const [logisticsContent, setLogisticsContent] = useState(initialLogisticsContent);
  const [calendarUrl, setCalendarUrl] = useState(initialCalendarUrl);
  const [calendarLabel, setCalendarLabel] = useState(initialCalendarLabel);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const res = await fetch("/api/admin/settings/complete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subheadline,
          reinforcement_1: reinforcement1,
          reinforcement_2: reinforcement2,
          logistics_title: logisticsTitle,
          logistics_content: logisticsContent,
          calendar_url: calendarUrl,
          calendar_label: calendarLabel,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const json = await res.json();
        setError(json.error || "Failed to save settings.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Header section */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Subheadline
        </label>
        <textarea
          value={subheadline}
          onChange={(e) => setSubheadline(e.target.value)}
          rows={2}
          placeholder="To activate your receptionist, we'll run through your details together…"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">Supports [text](url) for links.</p>
      </div>

      {/* Reinforcement texts */}
      <div className="pt-3 border-t border-slate-100 space-y-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Reinforcement text</p>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Line 1
          </label>
          <input
            type="text"
            value={reinforcement1}
            onChange={(e) => setReinforcement1(e.target.value)}
            placeholder="This session usually takes 20–30 minutes."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Line 2
          </label>
          <input
            type="text"
            value={reinforcement2}
            onChange={(e) => setReinforcement2(e.target.value)}
            placeholder="By the end of the call, you'll know exactly how your receptionist will handle incoming jobs."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Logistics section */}
      <div className="pt-3 border-t border-slate-100 space-y-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Logistics section</p>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Section title
          </label>
          <input
            type="text"
            value={logisticsTitle}
            onChange={(e) => setLogisticsTitle(e.target.value)}
            placeholder="How we'll run the session"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Content
          </label>
          <textarea
            value={logisticsContent}
            onChange={(e) => setLogisticsContent(e.target.value)}
            rows={5}
            placeholder={"Google Meet is preferred.\nIf you choose a phone call, I'll call you at your booked time from 0431 847 833.\nPlease include the best number to reach you when booking."}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">Each line renders as a separate bullet point.</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="pt-3 border-t border-slate-100 space-y-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Google Calendar</p>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Appointment scheduling URL
          </label>
          <input
            type="url"
            value={calendarUrl}
            onChange={(e) => setCalendarUrl(e.target.value)}
            placeholder="https://calendar.google.com/calendar/appointments/schedules/…"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Button label
          </label>
          <input
            type="text"
            value={calendarLabel}
            onChange={(e) => setCalendarLabel(e.target.value)}
            placeholder="Book your setup session"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
          ✓ Settings saved successfully.
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-slate-900 px-6 py-3 text-base font-bold text-white hover:bg-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? "Saving…" : "Save complete page settings"}
      </button>
    </form>
  );
}
