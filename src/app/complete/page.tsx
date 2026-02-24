"use client";

import { useEffect, useRef, useState } from "react";

interface CompleteConfig {
  subheadline: string;
  reinforcement_1: string;
  reinforcement_2: string;
  logistics_title: string;
  logistics_content: string;
  calendar_url: string;
  calendar_label: string;
}

function renderWithLinks(text: string) {
  const result: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) result.push(text.slice(lastIndex, match.index));
    result.push(
      <a key={match.index} href={match[2]} className="text-emerald-600 underline hover:text-emerald-700">
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) result.push(text.slice(lastIndex));
  return result;
}

export default function CompletePage() {
  const [config, setConfig] = useState<CompleteConfig | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/complete/config")
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch(() => {});
  }, []);

  // Load Google Calendar scheduling button once config is ready
  useEffect(() => {
    if (!config?.calendar_url || !calendarRef.current) return;

    const link = document.createElement("link");
    link.href = "https://calendar.google.com/calendar/scheduling-button-script.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://calendar.google.com/calendar/scheduling-button-script.js";
    script.async = true;
    script.onload = () => {
      const cal = (window as Window & { calendar?: { schedulingButton: { load: (opts: object) => void } } }).calendar;
      if (calendarRef.current && cal?.schedulingButton) {
        cal.schedulingButton.load({
          url: config.calendar_url,
          color: "#10b981",
          label: config.calendar_label || "Book your setup session",
          target: calendarRef.current,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, [config]);

  const logisticsLines = config?.logistics_content
    ? config.logistics_content.split("\n").filter((l) => l.trim() !== "")
    : [];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-50">
        <img src="/lawnies_logo.svg" alt="Lawnies" className="h-9 w-auto" />
        <span className="text-sm text-slate-500">Complete page</span>
      </nav>

      <main className="px-6 py-12 md:py-16">
        <div className="w-full max-w-xl mx-auto space-y-8">

          {/* Header */}
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Step 2 of 2: Finalise Your Setup
            </p>
            {config?.subheadline && (
              <p className="text-lg text-slate-700 max-w-md mx-auto mb-6">
                {renderWithLinks(config.subheadline)}
              </p>
            )}
            {config?.reinforcement_1 && (
              <p className="text-sm font-semibold text-slate-600">
                {config.reinforcement_1}
              </p>
            )}
            {config?.reinforcement_2 && (
              <p className="text-sm text-slate-500 mt-1">
                {config.reinforcement_2}
              </p>
            )}
          </div>

          {/* Logistics */}
          {(config?.logistics_title || logisticsLines.length > 0) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              {config?.logistics_title && (
                <h2 className="text-base font-black text-slate-900 mb-4">
                  {config.logistics_title}
                </h2>
              )}
              {logisticsLines.length > 0 && (
                <ul className="space-y-3">
                  {logisticsLines.map((line, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-emerald-500 font-black mt-0.5">•</span>
                      <span className="text-sm text-slate-600">{renderWithLinks(line)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Google Calendar scheduling button */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <p className="text-sm font-semibold text-slate-500 mb-4">
              Pick a time that suits you:
            </p>
            <div ref={calendarRef} />
          </div>

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
