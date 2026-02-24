import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveOnboardingResponse } from "@/lib/queries/onboarding";
import { getOperatorByCheckoutSession } from "@/lib/queries/operators";
import { getSettingsByCategory } from "@/lib/queries/settings";
import { sendEmail } from "@/lib/email";
import { DEFAULT_FORM_SECTIONS, type FormSection } from "@/lib/welcome-sections";

const schema = z.object({
  session_id: z.string().optional().nullable(),
  responses: z.record(z.string(), z.string()),
});

function buildEmail(
  operator: { email: string; business_name: string; phone: string } | null,
  formSections: FormSection[],
  responses: Record<string, string>
): { html: string; text: string } {
  let html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b">
      <h2 style="color:#10b981">New Lawnies Setup Submission</h2>
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
        <tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#64748b;width:130px">Business</td><td style="padding:6px 0">${operator?.business_name || "—"}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#64748b">Email</td><td style="padding:6px 0">${operator?.email || "—"}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#64748b">Phone</td><td style="padding:6px 0">${operator?.phone || "—"}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin-bottom:24px">
  `;

  let text = `New Lawnies Setup Submission\n\nBusiness: ${operator?.business_name || "—"}\nEmail: ${operator?.email || "—"}\nPhone: ${operator?.phone || "—"}\n\n`;

  formSections.forEach((section, si) => {
    html += `<h3 style="color:#1e293b;margin:20px 0 10px">${section.title}</h3>`;
    text += `${section.title}\n${"─".repeat(section.title.length)}\n`;

    section.fields.forEach((field, fi) => {
      const value = responses[`s${si}_f${fi}`]?.trim() || "(not provided)";
      html += `<p style="margin:0 0 12px"><strong style="color:#475569">${field.label}</strong><br><span style="white-space:pre-wrap">${value.replace(/</g, "&lt;")}</span></p>`;
      text += `${field.label}:\n${value}\n\n`;
    });
  });

  html += `</div>`;
  return { html, text };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { session_id, responses } = parsed.data;

    let operator: { id: string; email: string; business_name: string; phone: string } | null = null;
    if (session_id) {
      operator = await getOperatorByCheckoutSession(session_id);
    }

    await saveOnboardingResponse(operator?.id ?? null, session_id || null, responses);

    // Send notification email (fire-and-forget)
    (async () => {
      try {
        const welcomeSettings = await getSettingsByCategory("welcome");
        let formSections: FormSection[] = DEFAULT_FORM_SECTIONS;
        if (welcomeSettings.form_sections) {
          try { formSections = JSON.parse(welcomeSettings.form_sections); } catch {}
        }

        const { html, text } = buildEmail(operator, formSections, responses);
        const businessName = operator?.business_name || "Unknown";

        await sendEmail({
          to: "systems@automator.au",
          subject: `New Lawnies Setup: ${businessName}`,
          html,
          text,
        });
      } catch (err) {
        console.error("Failed to send setup notification email:", err);
      }
    })();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("welcome/survey error:", error);
    return NextResponse.json(
      { error: "Failed to save survey responses" },
      { status: 500 }
    );
  }
}
