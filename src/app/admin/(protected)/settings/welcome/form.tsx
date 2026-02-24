"use client";

import { useState } from "react";
import type { FormSection } from "@/lib/welcome-sections";

export function WelcomeSettingsForm({
  initialTitle,
  initialContent,
  initialVideoUrl,
  initialShowVideo,
  initialSections,
  initialSubText1,
  initialSubText2,
}: {
  initialTitle: string;
  initialContent: string;
  initialVideoUrl: string;
  initialShowVideo: boolean;
  initialSections: FormSection[];
  initialSubText1: string;
  initialSubText2: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [subText1, setSubText1] = useState(initialSubText1);
  const [subText2, setSubText2] = useState(initialSubText2);
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [showVideo, setShowVideo] = useState(initialShowVideo);
  const [sections, setSections] = useState<FormSection[]>(initialSections);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Section helpers
  const updateSectionTitle = (si: number, value: string) => {
    setSections((prev) =>
      prev.map((s, i) => (i === si ? { ...s, title: value } : s))
    );
  };

  const removeSection = (si: number) => {
    setSections((prev) => prev.filter((_, i) => i !== si));
  };

  const addSection = () => {
    setSections((prev) => [...prev, { title: "", fields: [{ label: "", placeholder: "" }] }]);
  };

  // Field helpers
  const updateField = (
    si: number,
    fi: number,
    key: "label" | "placeholder",
    value: string
  ) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i !== si
          ? s
          : {
              ...s,
              fields: s.fields.map((f, j) =>
                j === fi ? { ...f, [key]: value } : f
              ),
            }
      )
    );
  };

  const removeField = (si: number, fi: number) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i !== si ? s : { ...s, fields: s.fields.filter((_, j) => j !== fi) }
      )
    );
  };

  const addField = (si: number) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i !== si
          ? s
          : { ...s, fields: [...s.fields, { label: "", placeholder: "" }] }
      )
    );
  };

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
          sub_text_1: subText1,
          sub_text_2: subText2,
          video_url: videoUrl,
          show_video: String(showVideo),
          form_sections: JSON.stringify(sections),
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
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Page content */}
      <div className="space-y-4">
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

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Sub-text line 1
          </label>
          <input
            type="text"
            value={subText1}
            onChange={(e) => setSubText1(e.target.value)}
            placeholder="This takes about 5–10 minutes…"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Sub-text line 2
          </label>
          <input
            type="text"
            value={subText2}
            onChange={(e) => setSubText2(e.target.value)}
            placeholder="You don't need to get this perfect…"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Video */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
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

      {/* Form sections editor */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-700">Form Sections</p>
            <p className="text-xs text-slate-400 mt-0.5">
              These sections and questions appear on the welcome page.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section, si) => (
            <div
              key={si}
              className="border border-slate-200 rounded-xl p-4 space-y-4 bg-slate-50"
            >
              {/* Section title row */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSectionTitle(si, e.target.value)}
                  placeholder="Section title"
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeSection(si)}
                  className="text-slate-400 hover:text-red-500 transition-colors text-xs px-2 py-1 rounded-lg border border-slate-200 bg-white hover:border-red-200 whitespace-nowrap"
                >
                  Remove section
                </button>
              </div>

              {/* Fields */}
              <div className="space-y-3 pl-3 border-l-2 border-slate-200">
                {section.fields.map((field, fi) => (
                  <div key={fi} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(si, fi, "label", e.target.value)}
                        placeholder="Question label"
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeField(si, fi)}
                        disabled={section.fields.length === 1}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg border border-slate-200 bg-white hover:border-red-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Remove question"
                      >
                        ✕
                      </button>
                    </div>
                    <input
                      type="text"
                      value={field.placeholder}
                      onChange={(e) => updateField(si, fi, "placeholder", e.target.value)}
                      placeholder="Placeholder / example text"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 bg-white"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addField(si)}
                  className="text-xs text-emerald-600 font-semibold hover:text-emerald-700"
                >
                  + Add question
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSection}
          className="mt-4 w-full rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-semibold text-slate-500 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
        >
          + Add section
        </button>
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
