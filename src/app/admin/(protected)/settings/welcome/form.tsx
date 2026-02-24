"use client";

import { useState } from "react";

export function WelcomeSettingsForm({
  initialTitle,
  initialContent,
  initialVideoUrl,
  initialShowVideo,
}: {
  initialTitle: string;
  initialContent: string;
  initialVideoUrl: string;
  initialShowVideo: boolean;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [showVideo, setShowVideo] = useState(initialShowVideo);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const res = await fetch("/api/admin/settings/welcome", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          video_url: videoUrl,
          show_video: String(showVideo),
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
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Page Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Welcome to Lawnies"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Welcome Text
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          placeholder="Let's set up your receptionist so you never miss a booking."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none"
        />
      </div>

      <div className="pt-2 border-t border-slate-100 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Gumlet Video Embed URL
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://play.gumlet.io/embed/your-video-id"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
          <p className="text-xs text-slate-400 mt-1">
            Paste the Gumlet embed URL (e.g. https://play.gumlet.io/embed/abc123)
          </p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showVideo}
            onChange={(e) => setShowVideo(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-300"
          />
          <span className="text-sm font-semibold text-slate-700">
            Show video on welcome page
          </span>
        </label>
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
        {saving ? "Saving…" : "Save welcome settings"}
      </button>
    </form>
  );
}
