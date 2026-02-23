import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe/config";
import { getPendingSignupById } from "@/lib/queries/pending-signups";
import { deletePendingSignup } from "@/lib/queries/pending-signups";
import { createOperator, getOperatorByCheckoutSession } from "@/lib/queries/operators";
import { sendEmail } from "@/lib/email";
import type Stripe from "stripe";

// Disable Next.js body parsing — Stripe needs the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  if (!STRIPE_CONFIG.webhookSecret) {
    console.error("Stripe webhook secret is not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Idempotency: check if operator already exists for this session
    const existing = await getOperatorByCheckoutSession(session.id);
    if (existing) {
      console.log(`Operator already exists for session ${session.id}, skipping`);
      return NextResponse.json({ received: true });
    }

    const pendingSignupId = session.metadata?.pending_signup_id;
    if (!pendingSignupId) {
      console.error("No pending_signup_id in Stripe session metadata", session.id);
      return NextResponse.json(
        { error: "Missing pending_signup_id metadata" },
        { status: 400 }
      );
    }

    const pendingSignup = await getPendingSignupById(pendingSignupId);
    if (!pendingSignup) {
      // Could be expired or already processed
      console.warn(`Pending signup not found or expired: ${pendingSignupId}`);
      return NextResponse.json({ received: true });
    }

    // Create operator account
    const operator = await createOperator({
      email: pendingSignup.email,
      password_hash: pendingSignup.password_hash,
      business_name: pendingSignup.business_name,
      phone: pendingSignup.phone,
      stripe_customer_id: session.customer as string | null,
      stripe_subscription_id: session.subscription as string | null,
      stripe_checkout_session_id: session.id,
    });

    if (!operator) {
      // createOperator uses ON CONFLICT DO NOTHING — operator might already exist via another path
      console.warn(`Operator creation returned no result for ${pendingSignup.email}`);
      await deletePendingSignup(pendingSignupId);
      return NextResponse.json({ received: true });
    }

    // Send notification email to systems@automator.au
    try {
      const signupDate = new Date(operator.created_at).toLocaleString("en-AU", {
        timeZone: "Australia/Sydney",
        dateStyle: "medium",
        timeStyle: "short",
      });

      await sendEmail({
        to: "systems@automator.au",
        subject: `New Lawnies Operator Signup — ${operator.business_name}`,
        html: `
          <h2>New Operator Signup</h2>
          <table cellpadding="6" style="border-collapse:collapse;">
            <tr><td><strong>Business Name</strong></td><td>${operator.business_name}</td></tr>
            <tr><td><strong>Email</strong></td><td>${operator.email}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${operator.phone}</td></tr>
            <tr><td><strong>Signed Up</strong></td><td>${signupDate}</td></tr>
            <tr><td><strong>Stripe Customer ID</strong></td><td>${operator.stripe_customer_id || "—"}</td></tr>
            <tr><td><strong>Stripe Subscription ID</strong></td><td>${operator.stripe_subscription_id || "—"}</td></tr>
          </table>
        `,
        text: [
          "New Operator Signup",
          "",
          `Business Name: ${operator.business_name}`,
          `Email: ${operator.email}`,
          `Phone: ${operator.phone}`,
          `Signed Up: ${signupDate}`,
          `Stripe Customer ID: ${operator.stripe_customer_id || "—"}`,
          `Stripe Subscription ID: ${operator.stripe_subscription_id || "—"}`,
        ].join("\n"),
      });
    } catch (emailError) {
      // Log but don't fail the webhook — operator was already created
      console.error("Failed to send notification email:", emailError);
    }

    // Clean up pending signup
    await deletePendingSignup(pendingSignupId);

    console.log(`✅ Operator created: ${operator.email} (${operator.business_name})`);
  }

  return NextResponse.json({ received: true });
}
