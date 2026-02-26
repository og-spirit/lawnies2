import React, { useState } from 'react';

const LandingPage = () => {
  const [jobValue, setJobValue] = useState(150);
  const [missedCalls, setMissedCalls] = useState(2);
  const lostPerMonth = jobValue * missedCalls * 4;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* ─── NAV BAR ─────────────────────────────────────────────────── */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center">
          <img
            src="/lawnies_logo.svg"
            alt="Lawnies"
            className="h-9 w-auto"
          />
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white">
        <div
          className="pointer-events-none absolute top-[-20%] right-[-20%] h-[500px] w-[500px]"
          style={{
            background: 'radial-gradient(circle at center, rgba(52,211,153,0.35), transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="pointer-events-none absolute bottom-[-20%] left-[-20%] h-[500px] w-[500px]"
          style={{
            background: 'radial-gradient(circle at center, rgba(16,185,129,0.35), transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            Built for Australian lawn operators
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
            Stop losing lawn jobs<br />
            <span className="text-emerald-500">when you're on the mower.</span>
          </h1>
          <p className="text-2xl md:text-3xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Get every call answered while you work.
          </p>
          <div className="flex flex-col items-center gap-2">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white text-lg font-bold rounded-xl hover:bg-emerald-600 hover:-translate-y-0.5 transition-all shadow-md hover:shadow-xl"
            >
              Install my Receptionist
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <p className="text-slate-400 text-sm">Setup in 4 business days. No tech skills needed.</p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 1 – MISSED CALL CALCULATOR ─────────────────────── */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="w-full max-w-lg mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 text-center">
            How much are missed calls costing you?
          </h2>
          <p className="text-slate-500 text-center mb-10 text-sm">Move the sliders to see your real number.</p>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-8">

            {/* Slider 1 – Job Value */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Your average lawn job value
                </label>
                <span className="text-2xl font-black text-emerald-500">${jobValue}</span>
              </div>
              <input
                type="range"
                min={50}
                max={600}
                step={10}
                value={jobValue}
                onChange={(e) => setJobValue(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>$50</span>
                <span>$600</span>
              </div>
            </div>

            {/* Slider 2 – Missed Calls */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Calls you miss each week
                </label>
                <span className="text-2xl font-black text-emerald-500">
                  {missedCalls} {missedCalls === 1 ? 'call' : 'calls'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={1}
                value={missedCalls}
                onChange={(e) => setMissedCalls(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1</span>
                <span>15</span>
              </div>
            </div>

            {/* Result */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
              <p className="text-sm font-semibold text-slate-500 mb-1">
                You could be losing
              </p>
              <p className="text-5xl font-black text-red-600 tabular-nums">
                ${lostPerMonth.toLocaleString()}
              </p>
              <p className="text-slate-500 text-xs mt-1 font-semibold">per month</p>
              <p className="text-slate-400 text-xs mt-2">Based on your numbers.</p>
            </div>

          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-3xl font-semibold mb-1" style={{ color: '#1a1a1a' }}>Stop the loss.</p>

            <div className="mb-5">
              <div className="space-y-1">
                <p className="text-[#10b982] text-2xl font-bold">$197/month +GST</p>
              </div>
              <div className="my-5 flex justify-center">
                <hr className="w-[30px] border-slate-300" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium" style={{ color: '#222' }}>One-time professional setup</p>
                <p className="text-slate-900/70 text-2xl font-bold">$597 +GST</p>
                <p className="text-slate-500 text-base font-normal">Includes your first month</p>
              </div>
            </div>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-5 bg-emerald-500 text-white text-lg font-bold rounded-xl hover:bg-emerald-600 hover:-translate-y-0.5 transition-all shadow-md hover:shadow-xl"
            >
              Install My Receptionist
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <p className="text-slate-500 text-sm font-medium mt-4">No lock-in contracts. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2 – HOW IT WORKS ────────────────────────────────── */}
      <section className="bg-[#defce8] py-16">
        <div className="w-full max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center text-slate-900 mb-12">
            Simple. Controlled. Done.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              {
                step: '1',
                heading: 'We answer your calls.',
                body: "When you're busy, we pick up.",
              },
              {
                step: '2',
                heading: 'We secure the job.',
                body: "The customer chooses their preferred time. We lock it in so they don't call someone else.",
              },
              {
                step: '3',
                heading: 'You confirm when free.',
                body: 'Call them back between jobs and finalise the details.',
              },
            ].map(({ step, heading, body }) => (
              <div key={step} className="relative bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black text-lg mb-4">
                  {step}
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-2">{heading}</h3>
                <p className="text-slate-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-700 font-semibold text-lg">
            You get the lead. You keep control of your schedule.
          </p>
        </div>
      </section>

      {/* ─── SECTION 2B – IT WORKS WITH YOUR SERVICES ───────────────── */}
      <section className="bg-[#f8fafc] border-y border-slate-100 py-16">
        <div className="w-full max-w-lg mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 text-center">
            Set up for you
          </h2>
          <p className="text-slate-500 text-center mb-8">
            Your Receptionist runs on:
          </p>
          <ul className="space-y-3 mb-8">
            {[
              'Your service types',
              'Your pricing rules',
              'Your service areas',
              'Your working hours',
            ].map((item) => (
              <li key={item} className="flex justify-center items-center bg-emerald-100 border border-emerald-300 rounded-xl px-5 py-4">
                <div className="flex items-center gap-3 w-56">
                  <span className="text-emerald-500 font-black text-lg">✔</span>
                  <span className="text-slate-800 font-semibold">{item}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="text-center space-y-1">
            <p className="text-slate-800 font-bold">It only offers times that make sense for you.</p>
            <p className="text-slate-500">You stay in control.</p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3 – WHAT'S INCLUDED ─────────────────────────────── */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="w-full max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-10">
            What's included
          </h2>
          <ul className="space-y-4 text-left max-w-md mx-auto">
            {[
              '24/7 call answering',
              'Customer details sent to your phone instantly',
              'No calendar software needed',
              'Works while you\'re on the mower',
              'A shareable booking link for web and Facebook leads',
              'You stay in control',
            ].map((item) => (
              <li key={item} className="flex justify-center items-start bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-4">
                <div className="flex items-start gap-3 w-72">
                  <span className="text-emerald-500 font-black text-lg mt-0.5">✔</span>
                  <span className="text-slate-800 font-semibold">{item}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── SECTION 4 – PRICING ─────────────────────────────────────── */}
      <section id="pricing" className="bg-[#defce8] py-16">
        <div className="w-full max-w-lg mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 whitespace-nowrap">
            Ready to stop missing calls?
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="bg-emerald-500 px-6 pt-7 pb-6 border-b border-emerald-400">
              <p className="text-white font-black whitespace-nowrap">
                <span className="text-4xl md:text-5xl">$197</span>
                <span className="text-lg md:text-2xl">/month +GST</span>
              </p>
              <p className="text-white text-base font-semibold mt-4">
                24/7 call answering and job requests secured
              </p>
            </div>
            <div className="px-6 pt-[30px] pb-2 text-center">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
                One-time professional setup
              </p>
              <p className="text-slate-900 text-lg font-bold">
                $597 + GST
                <span className="block text-slate-500 text-base font-medium">(includes your first month)</span>
              </p>
            </div>
            <div className="px-6 py-6 flex flex-col gap-3">
              <a
                href="/signup"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 text-white text-lg font-bold rounded-xl hover:bg-emerald-600 hover:-translate-y-0.5 transition-all shadow-md hover:shadow-xl"
              >
                Get my calls covered
              </a>
              <p className="text-slate-500 text-sm font-medium">No lock-in contracts. Cancel anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5 – GUARANTEE ───────────────────────────────────── */}
      <section className="bg-slate-900 py-14">
        <div className="w-full max-w-2xl mx-auto px-6 text-center">
          <div className="text-emerald-400 text-3xl mb-4">🤝</div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
            Simple promise
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-xl mx-auto">
            If it doesn't help you capture more calls, we'll work with you to fix it.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 py-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <img
            src="/lawnies_logo.svg"
            alt="Lawnies"
            className="h-7 w-auto"
            style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(110deg)' }}
          />
        </div>
        <p className="text-slate-600 text-xs">
          Need something simpler?{' '}
          <a href="mailto:stefan@lawnies.com.au?subject=Basic%20Web%20Link%20Option%20Enquiry&body=Hi%20Lawnies%20team%2C%0A%0AI%27m%20interested%20in%20the%20basic%20web%20link%20option.%20I%27m%20currently%20not%20using%20a%20call%20answering%20solution.%0A%0AMy%20name%3A%20%0AMy%20business%20name%3A%20%0AMy%20phone%3A%20%0A%0ACan%20you%20send%20me%20more%20details%3F%0A%0AThanks" className="text-slate-400 underline hover:text-white transition-colors">
            Ask us about our basic web link option.
          </a>
        </p>
        <p className="text-slate-600 text-xs mt-3">
          Proudly built in Oz by{' '}
          <a href="https://automator.au" className="text-slate-400 underline hover:text-white transition-colors">
            Automator AU
          </a>
        </p>
        <p className="text-slate-500 text-xs mt-4">© 2026 Lawnies</p>
        <p className="text-slate-500 text-xs mt-1">
          <a href="/privacy" className="text-slate-400 underline hover:text-white transition-colors">
            Privacy Policy
          </a>
          <span className="mx-2 text-slate-600">|</span>
          <a href="/terms" className="text-slate-400 underline hover:text-white transition-colors">
            Terms of Service
          </a>
        </p>
      </footer>

    </div>
  );
};

export default LandingPage;
