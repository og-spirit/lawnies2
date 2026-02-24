import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveOnboardingResponse } from "@/lib/queries/onboarding";
import { getOperatorByCheckoutSession } from "@/lib/queries/operators";

const schema = z.object({
  session_id: z.string().optional().nullable(),
  responses: z.record(z.string(), z.string()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { session_id, responses } = parsed.data;

    let operatorId: string | null = null;
    if (session_id) {
      const operator = await getOperatorByCheckoutSession(session_id);
      if (operator) {
        operatorId = operator.id;
      }
    }

    await saveOnboardingResponse(operatorId, session_id || null, responses);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("welcome/survey error:", error);
    return NextResponse.json(
      { error: "Failed to save survey responses" },
      { status: 500 }
    );
  }
}
