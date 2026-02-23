import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import {
  getEmailSettingsMasked,
  saveEmailSettings,
  type EmailSettings,
} from "@/lib/queries/settings";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getEmailSettingsMasked();
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error("admin/settings/email GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: EmailSettings = await request.json();

    if (!body.provider) {
      return NextResponse.json(
        { error: "Email provider is required" },
        { status: 400 }
      );
    }

    await saveEmailSettings(body, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("admin/settings/email PUT error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
