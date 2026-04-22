import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NotificationPreferencesForm } from "@/components/settings/NotificationPreferencesForm";
import type { NotificationPreferences } from "@/types/app";

export const metadata = { title: "Notifications — Fork'd" };

export default async function NotificationSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: prefs } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Notification Preferences</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose which notifications you want to receive.
        </p>
      </div>

      <NotificationPreferencesForm initialPrefs={prefs as NotificationPreferences | null} />
    </div>
  );
}
