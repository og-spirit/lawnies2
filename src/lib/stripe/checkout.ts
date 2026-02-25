import { getSettingsByCategory } from "@/lib/queries/settings";
import { stripe, STRIPE_PRICE_SETUP_ID, STRIPE_PRICE_MONTHLY_ID, STRIPE_TAX_RATE_ID } from "./config";

export async function createCheckoutSession({
  email,
  pendingSignupId,
}: {
  email: string;
  pendingSignupId: string;
}) {
  const stripeSettings = await getSettingsByCategory("stripe");
  const setupPriceId = stripeSettings.price_setup || STRIPE_PRICE_SETUP_ID;
  const monthlyPriceId = stripeSettings.price_monthly || STRIPE_PRICE_MONTHLY_ID;
  const taxRateId = stripeSettings.tax_rate || STRIPE_TAX_RATE_ID;

  if (!setupPriceId || !monthlyPriceId) {
    throw new Error(
      "Stripe price IDs are not configured. Set them in Admin > Stripe Settings or via env vars."
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const buildLineItem = (price: string) =>
    taxRateId
      ? { price, quantity: 1, tax_rates: [taxRateId] }
      : { price, quantity: 1 };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [buildLineItem(setupPriceId), buildLineItem(monthlyPriceId)],
    mode: "subscription",
    success_url: `${appUrl}/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/signup`,
    customer_email: email,
    metadata: {
      pending_signup_id: pendingSignupId,
    },
  });

  return session;
}
