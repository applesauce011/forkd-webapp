import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Separator } from "@/components/ui/separator";
import { AccountSettingsForm } from "@/components/settings/AccountSettingsForm";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { DeleteAccountSection } from "@/components/settings/DeleteAccountSection";
import type { Database } from "@/types/database";

type ProfileVisible = Database["public"]["Views"]["profiles_visible"]["Row"];

export const metadata = { title: "Account Settings — Fork'd" };

export default async function AccountSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles_visible")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  return (
    <div className="space-y-10">
      {/* Profile section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Update how you appear to other cooks on Fork'd.
          </p>
        </div>
        <AccountSettingsForm profile={profile as ProfileVisible} />
      </section>

      <Separator />

      {/* Account section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Account</h2>
          <p className="text-sm text-muted-foreground">
            Manage your email and password.
          </p>
        </div>

        {/* Email (read-only) */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Email</p>
          <p className="text-sm text-muted-foreground rounded-md border bg-muted/40 px-3 py-2">
            {user.email}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Change Password</p>
          <ChangePasswordForm />
        </div>
      </section>

      <Separator />

      {/* Danger zone */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">
            Irreversible account actions.
          </p>
        </div>
        <DeleteAccountSection />
      </section>
    </div>
  );
}
