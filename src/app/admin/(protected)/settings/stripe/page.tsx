import { getSettingsByCategory } from "@/lib/queries/settings";
import { StripeSettingsForm } from "./form";

export default async function StripeSettingsPage() {
  const settings = await getSettingsByCategory("stripe");

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Stripe Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Configure Stripe price IDs for checkout. Changes take effect immediately — no redeploy needed.
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <StripeSettingsForm
          initialSetupPriceId={settings.price_setup || ""}
          initialMonthlyPriceId={settings.price_monthly || ""}
          initialTaxRateId={settings.tax_rate || ""}
        />
      </div>
    </div>
  );
}
