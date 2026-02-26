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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: 16 February 2026</p>

        <div className="text-gray-700 space-y-6 leading-relaxed">

          <p><em>By using Lawnies.com.au and voice agents, you agree to our terms and conditions.</em></p>
          <p>For questions, please contact us at <a href="mailto:legal@lawnies.com.au" className="text-emerald-600 underline hover:text-emerald-700">legal@lawnies.com.au</a></p>

          <p>These Terms of Service ("Terms") govern your access to and use of the Lawnies platform at lawnies.com.au and related services (the "Services"). The Services are provided by Spirit I.T. PTY LTD atf Spirit Unit Trust t/a Automator AU (ABN 52997416428) ("Lawnies", "we", "us", "our").</p>

          <p>By creating an account, starting a trial, purchasing a plan, or otherwise using the Services, you agree to these Terms.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">1. Who The Services Are For</h2>
          <p>The Services are intended for lawn care and related home service operators and their authorized staff.</p>
          <p>You must:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>be at least 18 years old; and</li>
            <li>have authority to bind your business if using the Services for a company or other entity.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-2">2. Service Description</h2>
          <p>Lawnies provides software tools that may include:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>instant estimate pages;</li>
            <li>online booking workflows;</li>
            <li>call handling and AI receptionist features; and</li>
            <li>related communications, lead capture, and notifications.</li>
          </ul>
          <p>Features vary by plan and may change over time.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">3. Accounts And Security</h2>
          <p>You are responsible for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>keeping your login credentials secure;</li>
            <li>all activity under your account; and</li>
            <li>ensuring account information remains accurate and current.</li>
          </ul>
          <p>You must notify us promptly if you suspect unauthorized access.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">4. Fees, Billing, And Stripe Payments</h2>

          <h3 className="text-lg font-semibold text-gray-900">4.1 Subscription Fees</h3>
          <p>Paid plans are billed in advance on a recurring basis (for example, monthly), unless otherwise stated at checkout.</p>

          <h3 className="text-lg font-semibold text-gray-900">4.2 Payment Processor</h3>
          <p>Payments are processed by Stripe. By paying through Lawnies, you also agree to applicable Stripe services terms and policies.</p>

          <h3 className="text-lg font-semibold text-gray-900">4.3 Taxes</h3>
          <p>Fees may be shown exclusive or inclusive of GST (as indicated at checkout). You are responsible for applicable taxes unless expressly stated otherwise.</p>

          <h3 className="text-lg font-semibold text-gray-900">4.4 Failed Payments</h3>
          <p>If a payment fails, we may retry the charge and/or suspend access to paid features until payment is received.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">5. Trials, Renewals, Cancellations, And Refunds</h2>

          <h3 className="text-lg font-semibold text-gray-900">5.1 Trials</h3>
          <p>If a free trial is offered, billing begins when the trial ends unless you cancel beforehand.</p>

          <h3 className="text-lg font-semibold text-gray-900">5.2 Renewals</h3>
          <p>Paid subscriptions renew automatically until canceled.</p>

          <h3 className="text-lg font-semibold text-gray-900">5.3 Cancellation</h3>
          <p>You can cancel from your account settings or by contacting us at <a href="mailto:info@automator.au" className="text-emerald-600 underline hover:text-emerald-700">info@automator.au</a>. Unless we state otherwise, cancellation takes effect at the end of the current billing period.</p>

          <h3 className="text-lg font-semibold text-gray-900">5.4 Refunds</h3>
          <p>Unless required by law, fees are non-refundable for partial billing periods or change-of-mind.</p>
          <p>Nothing in these Terms excludes, restricts, or modifies consumer rights you may have under the Australian Consumer Law (ACL).</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">6. Acceptable Use</h2>
          <p>You must not:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>use the Services for unlawful, misleading, or fraudulent activity;</li>
            <li>upload or transmit malicious code;</li>
            <li>interfere with platform performance or security;</li>
            <li>attempt unauthorized access to systems or data;</li>
            <li>use the Services to send spam or non-compliant marketing messages; or</li>
            <li>use AI/call tools in ways that violate telecommunications, privacy, spam, or consumer law.</li>
          </ul>
          <p>You are responsible for your scripts, automations, messaging content, and customer communications.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">7. Your Data And Content</h2>
          <p>You retain ownership of data and content you submit to the Services ("Customer Data").</p>
          <p>You grant us a non-exclusive license to host, process, and use Customer Data only as needed to provide, secure, and improve the Services and comply with law.</p>
          <p>You represent that you have all rights and permissions needed for Customer Data, including permissions to contact your leads/customers.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">8. Intellectual Property</h2>
          <p>We own all rights, title, and interest in the Services, software, branding, and related intellectual property, excluding your Customer Data.</p>
          <p>You may not copy, modify, reverse engineer, or create derivative works from the Services except as permitted by law.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">9. Third-Party Services</h2>
          <p>The Services may integrate with third-party tools (including Stripe, telephony, email/SMS, analytics, and CRM platforms). Your use of third-party services is governed by their terms and privacy policies.</p>
          <p>We are not responsible for third-party services we do not control.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">10. Availability And Changes</h2>
          <p>We aim for reliable service but do not guarantee uninterrupted or error-free operation.</p>
          <p>We may modify features, plans, or pricing from time to time. If required, we will provide notice before material changes take effect.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">11. Disclaimer</h2>
          <p>To the extent permitted by law, the Services are provided "as is" and "as available" without warranties of any kind, express or implied, including fitness for a particular purpose, merchantability, and non-infringement.</p>
          <p>We do not guarantee business outcomes (for example, number of leads, bookings, or revenue).</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">12. Limitation Of Liability</h2>
          <p>To the maximum extent permitted by law:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>we are not liable for indirect, incidental, special, consequential, or punitive damages, or loss of profits, revenue, goodwill, data, or business opportunities; and</li>
            <li>our aggregate liability arising out of or relating to the Services is limited to the total fees you paid us in the 12 months before the event giving rise to the claim.</li>
          </ul>
          <p>If a law implies guarantees that cannot be excluded, our liability is limited (where permitted) to re-supplying the Services or paying the cost of re-supply.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">13. Indemnity</h2>
          <p>You agree to indemnify and hold harmless Lawnies and its officers, employees, and contractors against claims, losses, and costs arising from:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>your misuse of the Services;</li>
            <li>your breach of these Terms; or</li>
            <li>your violation of law or third-party rights.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-2">14. Suspension And Termination</h2>
          <p>We may suspend or terminate access immediately if we reasonably believe you have:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>materially breached these Terms;</li>
            <li>created legal or security risk; or</li>
            <li>used the Services unlawfully.</li>
          </ul>
          <p>You may stop using the Services at any time.</p>
          <p>Sections intended to survive termination (including payment obligations, IP, disclaimers, liability limits, indemnity, and dispute terms) survive.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">15. Governing Law</h2>
          <p>These Terms are governed by the laws of Western Australia and the Commonwealth of Australia. You submit to the non-exclusive jurisdiction of the courts of Western Australia.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">16. Changes To These Terms</h2>
          <p>We may update these Terms from time to time. The updated version will be posted with a revised "Last updated" date. Continued use of the Services after changes take effect means you accept the updated Terms.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">17. Contact</h2>
          <p>For questions about these Terms, contact:</p>
          <p>Spirit I.T. PTY LTD atf Spirit Unit Trust t/a Automator AU<br />
          <a href="mailto:info@automator.au" className="text-emerald-600 underline hover:text-emerald-700">info@automator.au</a></p>

        </div>
      </main>
    </div>
  );
}
