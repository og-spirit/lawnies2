import { NextResponse } from "next/server";
import { getSettingsByCategory } from "@/lib/queries/settings";

export async function GET() {
  try {
    const settings = await getSettingsByCategory("complete");

    return NextResponse.json({
      subheadline: settings.subheadline || "To activate your receptionist, we'll run through your details together and confirm everything is configured correctly.",
      reinforcement_1: settings.reinforcement_1 || "This session usually takes 20–30 minutes.",
      reinforcement_2: settings.reinforcement_2 || "By the end of the call, you'll know exactly how your receptionist will handle incoming jobs.",
      logistics_title: settings.logistics_title || "How we'll run the session",
      logistics_content: settings.logistics_content || "Google Meet is preferred.\nIf you choose a phone call, I'll call you at your booked time from 0431 847 833.\nPlease include the best number to reach you when booking, even if it's the same as your account number.",
      calendar_url: settings.calendar_url || "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1Z5SY7eihMhvz4Otn_vLuti9CSA2OQ0-i9kuDCpAjmDMINRq_uQuYEubpDlAsnpap-00hmacwy?gv=true",
      calendar_label: settings.calendar_label || "Book your setup session",
    });
  } catch (error) {
    console.error("complete/config error:", error);
    return NextResponse.json(
      { error: "Failed to load complete config" },
      { status: 500 }
    );
  }
}
