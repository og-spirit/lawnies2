"use client";

import { useState } from "react";

export function StripeSettingsForm({
  initialSetupPriceId,
  initialMonthlyPriceId,
  initialTaxRateId,
}: {
  initialSetupPriceId: string;
  initialMonthlyPriceId: string;
  initialTaxRateId: string;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const form = e.currentTarget;
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value || "";

    const body = {
      price_setup: getValue("price_setup"),
      price_monthly: getValue("price_monthly"),
      tax_rate: getValue("tax_rate"),
    };

    try {
      const res = await fetch("/api/admin/settings/stripe", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Setup Fee Price ID
        </label>
        <p className="text-xs text-slate-500 mb-2">One-time charge (e.g. $400 setup fee)</p>
        <input
          name="price_setup"
          type="text"
          defaultValue={initialSetupPriceId}
          placeholder="price_..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Monthly Subscription Price ID
        </label>
        <p className="text-xs text-slate-500 mb-2">Recurring charge (e.g. $197/month)</p>
        <input
          name="price_monthly"
          type="text"
          defaultValue={initialMonthlyPriceId}
          placeholder="price_..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          GST Tax Rate ID <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <p className="text-xs text-slate-500 mb-2">Leave blank if tax is baked into prices or handled elsewhere</p>
        <input
          name="tax_rate"
          type="text"
          defaultValue={initialTaxRateId}
          placeholder="txr_... (optional)"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
        />
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
        {saving ? "Saving…" : "Save Stripe settings"}
      </button>
    </form>
  );
}
