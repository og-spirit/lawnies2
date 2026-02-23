import { getSettingsByCategory } from "@/lib/queries/settings";
import { WelcomeSettingsForm } from "./form";

export default async function WelcomeSettingsPage() {
  const settings = await getSettingsByCategory("welcome");

  let questions: string[] = [];
  if (settings.onboarding_questions) {
    try {
      questions = JSON.parse(settings.onboarding_questions);
    } catch {
      questions = [];
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Welcome Page Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Configure the post-payment welcome page: video and onboarding questions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <WelcomeSettingsForm
          initialTitle={settings.title || ""}
          initialContent={settings.content || ""}
          initialVideoUrl={settings.video_url || ""}
          initialQuestions={questions}
        />
      </div>
    </div>
  );
}
