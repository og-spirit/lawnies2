import React from 'react';

const PaymentPage = () => {
  const stripeCheckoutUrl = import.meta.env.VITE_STRIPE_CHECKOUT_URL || '/checkout';

  const handleCheckout = () => {
    window.location.assign(stripeCheckoutUrl);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <img src="/lawnies_logo.svg" alt="Lawnies" className="h-9 w-auto" />
        <a href="/signup" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
          Back to signup
        </a>
      </nav>

      <main className="px-6 py-12 md:py-16">
        <div className="w-full max-w-2xl mx-auto">
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">Complete your payment</h1>
            <p className="text-base md:text-lg text-slate-600 mb-8">
              Your signup details are done. Continue to secure checkout to activate your receptionist.
            </p>
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-lg font-bold text-white hover:bg-emerald-600 transition-colors"
            >
              Continue to secure payment
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="mt-3 text-center text-sm text-slate-500">Secure checkout powered by Stripe</p>
          </section>
        </div>
      </main>

      <footer className="bg-slate-950 py-7 text-center mt-14">
        <div className="flex items-center justify-center mb-4">
          <img
            src="/lawnies_logo.svg"
            alt="Lawnies"
            className="h-7 w-auto"
            style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(110deg)' }}
          />
        </div>
        <p className="text-slate-500 text-xs">© 2026 Lawnies. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PaymentPage;
