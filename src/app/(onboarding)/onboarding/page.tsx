import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClaimProfileForm } from "@/components/onboarding/ClaimProfileForm";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // If already has username, skip to follow step
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profile?.username) redirect("/onboarding/follow");

  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Set up your profile</h1>
        <p className="text-muted-foreground">Tell the Fork&apos;d community who you are</p>
      </div>
      <ClaimProfileForm userId={user.id} />
    </div>
  );
}
