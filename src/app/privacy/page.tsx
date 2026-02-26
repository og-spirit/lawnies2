import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Lawnies",
  description: "Privacy Policy for Lawnies.",
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: 16 February 2026</p>

        <div className="text-gray-700 space-y-6 leading-relaxed">

          <p><em>By using Lawnies.com.au and voice agents, you agree to our privacy policy and our terms and conditions.</em></p>
          <p>For questions about data privacy, please contact us at <a href="mailto:info@lawnies.com.au" className="text-emerald-600 underline hover:text-emerald-700">info@lawnies.com.au</a></p>

          <p>This Privacy Policy explains how Spirit I.T. PTY LTD atf Spirit Unit Trust t/a Automator AU (ABN 52997416428) ("Lawnies", "we", "us", "our") collects, uses, discloses, and protects personal information when you use lawnies.com.au and related services (the "Services").</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">1. Scope</h2>
          <p>This Policy applies to personal information we handle through the Services, including when you:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>visit our website;</li>
            <li>create an account or subscribe;</li>
            <li>use estimate, booking, and call-handling features; or</li>
            <li>contact us for support or sales.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-2">2. The Personal Information We Collect</h2>
          <p>Depending on how you use Lawnies, we may collect:</p>

          <h3 className="text-lg font-semibold text-gray-900">2.1 Account And Business Details</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>name, business name, and role;</li>
            <li>email address and phone number;</li>
            <li>billing address and related account details.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900">2.2 Service Data</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>service settings (pricing rules, service areas, scripts, workflows);</li>
            <li>customer/lead data you input or connect (for example names, phone numbers, email addresses, addresses, booking details, and notes);</li>
            <li>call, messaging, and booking records generated through the Services.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900">2.3 Technical And Usage Data</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>device and browser data;</li>
            <li>IP address and approximate location;</li>
            <li>pages viewed, actions taken, and timestamps;</li>
            <li>cookies and analytics data.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900">2.4 Support And Communications</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>information you provide in support requests, demos, forms, or correspondence.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-2">3. Payments And Stripe</h2>
          <p>Payments are processed by Stripe. We do not store full payment card details on our own systems.</p>
          <p>When you make a payment, Stripe collects and processes payment data according to Stripe's privacy policy and terms. We may receive limited billing information from Stripe (for example payment status, last 4 digits, card brand, country, and billing identifiers) for invoicing, fraud prevention, and support.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">4. How We Collect Information</h2>
          <p>We collect personal information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>directly from you;</li>
            <li>from your use of the Services;</li>
            <li>from integrations you connect (for example CRM, telephony, calendar, messaging, payment providers); and</li>
            <li>from service providers that support our business operations.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-2">5. Why We Use Personal Information</h2>
          <p>We use personal information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>provide, operate, and maintain the Services;</li>
            <li>set up and manage your account and subscription;</li>
            <li>process payments and prevent fraud;</li>
            <li>deliver features such as lead capture, booking, and call handling;</li>
            <li>communicate service updates, invoices, and support responses;</li>
            <li>improve service performance, reliability, and security;</li>
            <li>send product updates or marketing (where permitted); and</li>
            <li>comply with legal obligations.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-2">6. Disclosure Of Personal Information</h2>
          <p>We may disclose personal information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>payment processors (including Stripe);</li>
            <li>cloud hosting, analytics, support, communications, and infrastructure providers;</li>
            <li>telephony, email/SMS, calendar, and CRM integration partners you enable;</li>
            <li>professional advisers (legal, accounting, audit);</li>
            <li>regulators, law enforcement, or courts where legally required; and</li>
            <li>successors in connection with a merger, acquisition, or business transfer.</li>
          </ul>
          <p>We require service providers to protect personal information and use it only for authorized purposes.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">7. Cross-Border Disclosure</h2>
          <p>Some service providers may store or process personal information outside Australia. Where this occurs, we take reasonable steps to ensure appropriate safeguards are in place.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">8. Data Retention</h2>
          <p>We retain personal information only as long as reasonably necessary for business and legal purposes, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>account administration;</li>
            <li>service delivery;</li>
            <li>dispute resolution;</li>
            <li>compliance with tax, accounting, and legal record-keeping obligations.</li>
          </ul>
          <p>When no longer needed, we delete or de-identify personal information where practical.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">9. Security</h2>
          <p>We use technical and organizational safeguards designed to protect personal information, including access controls, encryption in transit where applicable, and monitoring of systems.</p>
          <p>No system is completely secure. You are responsible for maintaining the confidentiality of your account credentials.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">10. Marketing Communications</h2>
          <p>If you receive marketing emails from us, you can unsubscribe at any time using the unsubscribe link or by contacting us at <a href="mailto:info@automator.au" className="text-emerald-600 underline hover:text-emerald-700">info@automator.au</a>.</p>
          <p>Service and billing messages are still sent where necessary to provide the Services.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">11. Cookies And Analytics</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>keep the website and Services functioning;</li>
            <li>understand usage patterns; and</li>
            <li>improve performance and user experience.</li>
          </ul>
          <p>You can adjust browser settings to block some cookies, but parts of the Services may not work properly.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">12. Access And Correction</h2>
          <p>You may request access to personal information we hold about you, and request correction if it is inaccurate, out of date, incomplete, irrelevant, or misleading.</p>
          <p>To make a request, contact us at <a href="mailto:info@automator.au" className="text-emerald-600 underline hover:text-emerald-700">info@automator.au</a>.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">13. Complaints</h2>
          <p>If you believe we have mishandled your personal information, contact us first at <a href="mailto:info@automator.au" className="text-emerald-600 underline hover:text-emerald-700">info@automator.au</a> so we can investigate.</p>
          <p>If you are not satisfied with our response, you may contact the Office of the Australian Information Commissioner (OAIC): <a href="https://www.oaic.gov.au/" className="text-emerald-600 underline hover:text-emerald-700" target="_blank" rel="noopener noreferrer">www.oaic.gov.au</a>.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">14. Children's Privacy</h2>
          <p>The Services are intended for business use and are not directed to children under 18. We do not knowingly collect personal information from children.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">15. Changes To This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will post the updated version with a revised "Last updated" date.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">16. Contact</h2>
          <p>Privacy contact details:</p>
          <p>Spirit I.T. PTY LTD atf Spirit Unit Trust t/a Automator AU<br />
          <a href="mailto:info@automator.au" className="text-emerald-600 underline hover:text-emerald-700">info@automator.au</a></p>

        </div>
      </main>
    </div>
  );
}
