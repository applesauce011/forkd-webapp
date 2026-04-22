import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ManageSubscriptionButton } from "@/components/settings/ManageSubscriptionButton";
import { ROUTES } from "@/lib/constants/routes";

export const metadata = { title: "Subscription — Fork'd" };

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch entitlements (returns Json — access as any)
  const { data: ent } = await supabase.rpc("get_my_entitlements");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entData = ent as any;

  const isPremium: boolean = entData?.is_premium ?? false;
  const trialActive: boolean = entData?.trial_active ?? false;
  const trialEnd: string | null = entData?.trial_end ?? null;

  // Founding Cook status lives on profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_founding_cook")
    .eq("id", user.id)
    .single();
  const isFoundingCook: boolean = profile?.is_founding_cook ?? false;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Subscription</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your Fork'd plan and billing.
        </p>
      </div>

      {/* Current plan card */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground">Current plan</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="font-semibold text-lg">
                {isPremium ? "Premium" : "Free"}
              </p>
              {isPremium && (
                <Badge className="bg-orange-500 text-white">Premium</Badge>
              )}
              {isFoundingCook && (
                <Badge variant="outline" className="border-amber-500 text-amber-600">
                  Founding Cook
                </Badge>
              )}
            </div>
          </div>

          {isPremium ? (
            <ManageSubscriptionButton />
          ) : (
            <Button asChild>
              <Link href={ROUTES.UPGRADE}>Upgrade to Premium</Link>
            </Button>
          )}
        </div>

        {trialActive && trialEnd && (
          <>
            <Separator />
            <div className="text-sm">
              <p className="text-muted-foreground">Free trial active</p>
              <p className="font-medium mt-0.5">
                Trial ends on {formatDate(trialEnd)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Premium features list (shown only to free users) */}
      {!isPremium && (
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <p className="font-medium text-sm">What you get with Premium</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              Unlimited recipe views, saves, and follows
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              Private recipes
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              AI dictation for hands-free recipe entry
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              Unlimited Surprise Me suggestions
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
