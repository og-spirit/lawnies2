import { NextRequest, NextResponse } from "next/server";
import { getSettingsByCategory } from "@/lib/queries/settings";
import { getOperatorByCheckoutSession } from "@/lib/queries/operators";

export interface FormField {
  label: string;
  placeholder: string;
}

export interface FormSection {
  title: string;
  fields: FormField[];
}

const DEFAULT_FORM_SECTIONS: FormSection[] = [
  {
    title: "Services & Pricing",
    fields: [
      {
        label: "Services you offer",
        placeholder: "Example: Lawn mowing, edging, weed control, green waste removal",
      },
      {
        label: "How you normally price jobs",
        placeholder:
          "Example: Minimum callout $120. Standard mow from $150 up to 400sqm. Add $40 for overgrown lawns.",
      },
    ],
  },
  {
    title: "Where & When You Work",
    fields: [
      {
        label: "Service areas / suburbs",
        placeholder: "Example: Perth, Fremantle, Joondalup, Midland, Rockingham",
      },
      {
        label: "Working hours",
        placeholder: "Example: Mon-Fri 7am-5pm, Sat 8am-12pm, Sun closed.",
      },
    ],
  },
  {
    title: "Booking Rules",
    fields: [
      {
        label: "Booking limits or rules",
        placeholder: "Example: Minimum 24 hr lead time.",
      },
      {
        label: "Details we should collect from callers",
        placeholder:
          "Example: Full name, address, mobile, service needed, preferred day/time, access details.",
      },
    ],
  },
  {
    title: "Escalations",
    fields: [
      {
        label: "When should we alert you immediately?",
        placeholder:
          "Example: Urgent cleanups or complaints should be SMSed to me immediately on 0400 123 456.",
      },
    ],
  },
];

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
