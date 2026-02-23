"use client";

import { useState } from "react";
import type { EmailSettings } from "@/lib/queries/settings";

export function EmailSettingsForm({
  initialSettings,
}: {
  initialSettings: EmailSettings | null;
}) {
  const [provider, setProvider] = useState<"smtp" | "sendgrid">(
    initialSettings?.provider || "smtp"
  );
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

    let settings: EmailSettings;
    if (provider === "smtp") {
      settings = {
        provider: "smtp",
        smtp_host: getValue("smtp_host"),
        smtp_port: getValue("smtp_port"),
        smtp_username: getValue("smtp_username"),
        smtp_password: getValue("smtp_password"),
        smtp_use_tls: getValue("smtp_use_tls") || "true",
        from_email: getValue("from_email"),
        from_name: getValue("from_name"),
      };
    } else {
      settings = {
        provider: "sendgrid",
        sendgrid_api_key: getValue("sendgrid_api_key"),
        from_email: getValue("from_email"),
        from_name: getValue("from_name"),
      };
    }

    try {
      const res = await fetch("/api/admin/settings/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
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

  const s = initialSettings;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Provider selector */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Email Provider
        </label>
        <div className="flex gap-3">
          {(["smtp", "sendgrid"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProvider(p)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                provider === p
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
              }`}
            >
              {p === "smtp" ? "SMTP" : "SendGrid"}
            </button>
          ))}
        </div>
      </div>

      {provider === "smtp" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                SMTP Host
              </label>
              <input
                name="smtp_host"
                type="text"
                defaultValue={s?.smtp_host || ""}
                placeholder="smtp.example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Port
              </label>
              <input
                name="smtp_port"
                type="text"
                defaultValue={s?.smtp_port || "587"}
                placeholder="587"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              SMTP Username
            </label>
            <input
              name="smtp_username"
              type="text"
              defaultValue={s?.smtp_username || ""}
              placeholder="user@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              SMTP Password
            </label>
            <input
              name="smtp_password"
              type="password"
              defaultValue={s?.smtp_password || ""}
              placeholder={s?.smtp_password ? "••••••••" : "Enter password"}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Use TLS
            </label>
            <select
              name="smtp_use_tls"
              defaultValue={s?.smtp_use_tls || "true"}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            >
              <option value="true">Yes (recommended)</option>
              <option value="false">No</option>
            </select>
          </div>
        </>
      )}

      {provider === "sendgrid" && (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            SendGrid API Key
          </label>
          <input
            name="sendgrid_api_key"
            type="password"
            defaultValue={s?.sendgrid_api_key || ""}
            placeholder={s?.sendgrid_api_key ? "••••••••" : "SG.xxxxxxxx"}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            From Email
          </label>
          <input
            name="from_email"
            type="email"
            defaultValue={s?.from_email || ""}
            placeholder="noreply@lawnies.com.au"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            From Name
          </label>
          <input
            name="from_name"
            type="text"
            defaultValue={s?.from_name || ""}
            placeholder="Lawnies"
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
        {saving ? "Saving…" : "Save email settings"}
      </button>
    </form>
  );
}
