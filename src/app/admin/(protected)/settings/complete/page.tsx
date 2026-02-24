import { getSettingsByCategory } from "@/lib/queries/settings";
import { CompleteSettingsForm } from "./form";

export default async function CompleteSettingsPage() {
  const settings = await getSettingsByCategory("complete");

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Complete Page Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Configure the booking / finalise setup page (Step 2 of 2).
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <CompleteSettingsForm
          initialSubheadline={settings.subheadline || ""}
          initialReinforcement1={settings.reinforcement_1 || ""}
          initialReinforcement2={settings.reinforcement_2 || ""}
          initialLogisticsTitle={settings.logistics_title || ""}
          initialLogisticsContent={settings.logistics_content || ""}
          initialCalendarUrl={settings.calendar_url || ""}
          initialCalendarLabel={settings.calendar_label || ""}
        />
      </div>
    </div>
  );
}
