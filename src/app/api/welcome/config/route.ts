import { NextRequest, NextResponse } from "next/server";
import { getSettingsByCategory } from "@/lib/queries/settings";
import { getOperatorByCheckoutSession } from "@/lib/queries/operators";
import { DEFAULT_FORM_SECTIONS, type FormSection } from "@/lib/welcome-sections";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    const settings = await getSettingsByCategory("welcome");

    let form_sections: FormSection[] = DEFAULT_FORM_SECTIONS;
    if (settings.form_sections) {
      try {
        form_sections = JSON.parse(settings.form_sections);
      } catch {
        form_sections = DEFAULT_FORM_SECTIONS;
      }
    }

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
      sub_text_1: settings.sub_text_1 || "This takes about 5–10 minutes. The more detail you include, the better we can tailor everything to your business.",
      sub_text_2: settings.sub_text_2 || "You don't need to get this perfect. We'll review everything and fine-tune it with you if needed.",
      video_url: settings.video_url || "",
      show_video: settings.show_video !== "false",
      form_sections,
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
