"use client";

import { useState } from "react";

export function WelcomeSettingsForm({
  initialTitle,
  initialContent,
  initialVideoUrl,
  initialQuestions,
}: {
  initialTitle: string;
  initialContent: string;
  initialVideoUrl: string;
  initialQuestions: string[];
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [questions, setQuestions] = useState<string[]>(initialQuestions);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addQuestion = () => setQuestions((q) => [...q, ""]);

  const updateQuestion = (index: number, value: string) => {
    setQuestions((q) => q.map((item, i) => (i === index ? value : item)));
  };

  const removeQuestion = (index: number) => {
    setQuestions((q) => q.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const filteredQuestions = questions.filter((q) => q.trim() !== "");

    try {
      const res = await fetch("/api/admin/settings/welcome", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          video_url: videoUrl,
          onboarding_questions: JSON.stringify(filteredQuestions),
        }),
      });

      if (res.ok) {
        setQuestions(filteredQuestions);
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
          rows={3}
          placeholder="Thanks for signing up! Here's what to expect…"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none"
        />
      </div>

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

      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">
            Onboarding Survey Questions
          </label>
          <button
            type="button"
            onClick={addQuestion}
            className="text-sm text-emerald-600 font-semibold hover:text-emerald-700"
          >
            + Add question
          </button>
        </div>

        {questions.length === 0 && (
          <p className="text-slate-400 text-sm italic">
            No questions yet. Click &quot;Add question&quot; to add one.
          </p>
        )}

        <div className="space-y-3">
          {questions.map((q, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={q}
                onChange={(e) => updateQuestion(index, e.target.value)}
                placeholder={`Question ${index + 1}`}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="text-slate-400 hover:text-red-500 transition-colors p-2"
                aria-label="Remove question"
              >
                ✕
              </button>
            </div>
          ))}
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
        {saving ? "Saving…" : "Save welcome settings"}
      </button>
    </form>
  );
}
