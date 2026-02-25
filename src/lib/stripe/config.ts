import Stripe from "stripe";

// Use APP_ENV to distinguish staging from production
// (both run with NODE_ENV=production in Docker)
const isProduction = process.env.APP_ENV === "production";

const stripeSecretKey = isProduction
  ? process.env.STRIPE_SECRET_KEY_LIVE
  : process.env.STRIPE_SECRET_KEY_TEST;

const stripePublishableKey = isProduction
  ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE
  : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST;

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;

export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    if (!stripeInstance) {
      if (!stripeSecretKey) {
        throw new Error(
          `Stripe secret key is not defined. Expected ${
            isProduction ? "STRIPE_SECRET_KEY_LIVE" : "STRIPE_SECRET_KEY_TEST"
          } in environment variables`
        );
      }
      stripeInstance = new Stripe(stripeSecretKey, {
        apiVersion: "2026-01-28.clover",
        typescript: true,
      });
      console.log(
        `✅ Stripe initialized in ${isProduction ? "LIVE" : "TEST"} mode`
      );
    }
    return (stripeInstance as any)[prop];
  },
});

const stripeWebhookSecret = isProduction
  ? process.env.STRIPE_WEBHOOK_SECRET_LIVE
  : process.env.STRIPE_WEBHOOK_SECRET_TEST;

export const STRIPE_PRICE_SETUP_ID = isProduction
  ? process.env.STRIPE_PRICE_SETUP_LIVE
  : process.env.STRIPE_PRICE_SETUP_TEST;

export const STRIPE_PRICE_MONTHLY_ID = isProduction
  ? process.env.STRIPE_PRICE_MONTHLY_LIVE
  : process.env.STRIPE_PRICE_MONTHLY_TEST;

export const STRIPE_TAX_RATE_ID = isProduction
  ? process.env.STRIPE_TAX_RATE_LIVE
  : process.env.STRIPE_TAX_RATE_TEST;

export const STRIPE_CONFIG = {
  publishableKey: stripePublishableKey || "",
  webhookSecret: stripeWebhookSecret || "",
  currency: "aud",
  isProduction,
};
