import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getSettingsByCategory, setSettingsBulk } from "@/lib/queries/settings";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getSettingsByCategory("welcome");
    return NextResponse.json(settings);
  } catch (error) {
    console.error("admin/settings/welcome GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const allowed = ["title", "content", "video_url", "show_video"];
    const settings: Record<string, string | null> = {};
    for (const key of allowed) {
      if (key in body) {
        settings[key] = body[key] ?? null;
      }
    }

    await setSettingsBulk("welcome", settings, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("admin/settings/welcome PUT error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
