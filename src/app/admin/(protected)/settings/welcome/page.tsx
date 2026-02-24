import { getSettingsByCategory } from "@/lib/queries/settings";
import { WelcomeSettingsForm } from "./form";
import { DEFAULT_FORM_SECTIONS, type FormSection } from "@/lib/welcome-sections";

export default async function WelcomeSettingsPage() {
  const settings = await getSettingsByCategory("welcome");

  let formSections: FormSection[] = DEFAULT_FORM_SECTIONS;
  if (settings.form_sections) {
    try {
      formSections = JSON.parse(settings.form_sections);
    } catch {
      formSections = DEFAULT_FORM_SECTIONS;
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Welcome Page Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Configure the post-payment welcome page.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <WelcomeSettingsForm
          initialTitle={settings.title || ""}
          initialContent={settings.content || ""}
          initialVideoUrl={settings.video_url || ""}
          initialShowVideo={settings.show_video !== "false"}
          initialSections={formSections}
        />
      </div>
    </div>
  );
}
