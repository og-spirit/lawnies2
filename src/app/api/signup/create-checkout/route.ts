import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";
import {
  createPendingSignup,
  updatePendingSignupCheckoutSession,
} from "@/lib/queries/pending-signups";
import { getOperatorByEmail } from "@/lib/queries/operators";
import { createCheckoutSession } from "@/lib/stripe/checkout";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  businessName: z.string().min(1, "Business name is required"),
  phone: z.string().min(5, "Phone number is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password, businessName, phone } = parsed.data;

    // Check if already a registered operator
    const existingOperator = await getOperatorByEmail(email);
    if (existingOperator) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create pending signup (upserts on email conflict)
    const pendingSignup = await createPendingSignup({
      email,
      password_hash: passwordHash,
      business_name: businessName,
      phone,
    });

    // Create Stripe checkout session
    const checkoutSession = await createCheckoutSession({
      email,
      pendingSignupId: pendingSignup.id,
    });

    // Save checkout session ID on the pending signup
    await updatePendingSignupCheckoutSession(
      pendingSignup.id,
      checkoutSession.id
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("create-checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
