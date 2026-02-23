import { NextResponse } from "next/server";
import { getSettingsByCategory } from "@/lib/queries/settings";

export async function GET() {
  try {
    const settings = await getSettingsByCategory("welcome");

    let onboarding_questions: string[] = [];
    if (settings.onboarding_questions) {
      try {
        onboarding_questions = JSON.parse(settings.onboarding_questions);
      } catch {
        onboarding_questions = [];
      }
    }

    return NextResponse.json({
      title: settings.title || "Welcome to Lawnies",
      content: settings.content || "",
      video_url: settings.video_url || "",
      onboarding_questions,
    });
  } catch (error) {
    console.error("welcome/config error:", error);
    return NextResponse.json(
      { error: "Failed to load welcome config" },
      { status: 500 }
    );
  }
}
