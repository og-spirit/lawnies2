import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Lawnies",
  description: "Terms of Service for Lawnies.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <img src="/lawnies_logo.svg" alt="Lawnies" className="h-9 w-auto" />
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
          <p><em>Terms of Service coming soon.</em></p>
          <p>By using Lawnies, you agree to our terms and conditions. Full legal terms will be published here shortly.</p>
          <p>
            For questions, please contact us at{" "}
            <a href="mailto:legal@lawnies.com.au" className="text-emerald-600 underline hover:text-emerald-700">
              legal@lawnies.com.au
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
