import { getEmailSettingsMasked } from "@/lib/queries/settings";
import { EmailSettingsForm } from "./form";

export default async function EmailSettingsPage() {
  const settings = await getEmailSettingsMasked();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Email Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Configure SMTP or SendGrid for notification emails.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <EmailSettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
