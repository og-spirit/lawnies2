import { stripe, STRIPE_PRICE_ID } from "./config";

export async function createCheckoutSession({
  email,
  pendingSignupId,
}: {
  email: string;
  pendingSignupId: string;
}) {
  if (!STRIPE_PRICE_ID) {
    throw new Error(
      "Stripe price ID is not configured. Set STRIPE_PRICE_ID_TEST or STRIPE_PRICE_ID_LIVE."
    );
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
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
