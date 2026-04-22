import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FollowSuggestions } from "@/components/onboarding/FollowSuggestions";

export default async function OnboardingFollowPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Load onboarding suggestions
  const { data: suggestions } = await supabase.rpc("get_onboarding_suggestions", {
    p_user_id: user.id,
    p_limit: 8,
  });

  return (
    <div className="w-full max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Follow some cooks</h1>
        <p className="text-muted-foreground">
          Start building your feed by following cooks you like
        </p>
      </div>
      <FollowSuggestions userId={user.id} suggestions={suggestions ?? []} />
    </div>
  );
}
