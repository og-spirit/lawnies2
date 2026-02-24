import { NextRequest, NextResponse } from "next/server";
import { getSettingsByCategory } from "@/lib/queries/settings";
import { getOperatorByCheckoutSession } from "@/lib/queries/operators";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    const settings = await getSettingsByCategory("welcome");

    let operator: { email: string; business_name: string; phone: string } | null = null;
    if (sessionId) {
      const op = await getOperatorByCheckoutSession(sessionId);
      if (op) {
        operator = { email: op.email, business_name: op.business_name, phone: op.phone };
      }
    }

    return NextResponse.json({
      title: settings.title || "Welcome to Lawnies",
      content: settings.content || "",
      video_url: settings.video_url || "",
      show_video: settings.show_video !== "false",
      operator,
    });
  } catch (error) {
    console.error("welcome/config error:", error);
    return NextResponse.json(
      { error: "Failed to load welcome config" },
      { status: 500 }
    );
  }
}
