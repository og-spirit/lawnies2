import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getSettingsByCategory, setSettingsBulk } from "@/lib/queries/settings";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getSettingsByCategory("stripe");
    return NextResponse.json(settings);
  } catch (error) {
    console.error("admin/settings/stripe GET error:", error);
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
    const allowed = ["price_setup", "price_monthly", "tax_rate"];
    const settings: Record<string, string | null> = {};
    for (const key of allowed) {
      if (key in body) settings[key] = body[key] || null;
    }
    await setSettingsBulk("stripe", settings, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("admin/settings/stripe PUT error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
