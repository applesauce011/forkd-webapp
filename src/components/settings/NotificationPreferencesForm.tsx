"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSupabaseContext } from "@/contexts/SupabaseContext";
import type { NotificationPreferences } from "@/types/app";

interface NotificationPreferencesFormProps {
  initialPrefs: NotificationPreferences | null;
}

const PREFERENCE_LABELS: Record<keyof Omit<NotificationPreferences, "user_id" | "updated_at">, { label: string; description: string }> = {
  new_from_followed: {
    label: "New recipes from people you follow",
    description: "Get notified when someone you follow posts a new recipe.",
  },
  cooked_your_recipe: {
    label: "Someone cooked your recipe",
    description: "Get notified when another user cooks one of your recipes.",
  },
  milestone_likes: {
    label: "Recipe like milestones",
    description: "Get notified when your recipes hit milestone like counts.",
  },
  milestone_cooked: {
    label: "Recipe cooked milestones",
    description: "Get notified when your recipes are cooked a milestone number of times.",
  },
  weekly_digest: {
    label: "Weekly digest",
    description: "A weekly summary of activity on your recipes.",
  },
  weekly_saves_digest: {
    label: "Weekly saves digest",
    description: "A weekly summary of recipes saved by people you follow.",
  },
  friday_inspiration: {
    label: "Friday inspiration",
    description: "Recipe inspiration delivered every Friday.",
  },
  trending: {
    label: "Trending recipes",
    description: "Notifications about trending recipes in your area of interest.",
  },
  re_engagement: {
    label: "Re-engagement nudges",
    description: "Occasional reminders if you haven't been active in a while.",
  },
  welcome: {
    label: "Welcome & onboarding",
    description: "Tips and guidance when you're getting started.",
  },
};

type PrefKey = keyof Omit<NotificationPreferences, "user_id" | "updated_at">;

const DEFAULT_PREFS: Omit<NotificationPreferences, "user_id" | "updated_at"> = {
  new_from_followed: true,
  cooked_your_recipe: true,
  milestone_likes: true,
  milestone_cooked: true,
  weekly_digest: true,
  weekly_saves_digest: false,
  friday_inspiration: true,
  trending: false,
  re_engagement: false,
  welcome: true,
};

export function NotificationPreferencesForm({
  initialPrefs,
}: NotificationPreferencesFormProps) {
  const { supabase, user } = useSupabaseContext();
  const [prefs, setPrefs] = useState<Omit<NotificationPreferences, "user_id" | "updated_at">>(
    initialPrefs
      ? {
          new_from_followed: initialPrefs.new_from_followed,
          cooked_your_recipe: initialPrefs.cooked_your_recipe,
          milestone_likes: initialPrefs.milestone_likes,
          milestone_cooked: initialPrefs.milestone_cooked,
          weekly_digest: initialPrefs.weekly_digest,
          weekly_saves_digest: initialPrefs.weekly_saves_digest,
          friday_inspiration: initialPrefs.friday_inspiration,
          trending: initialPrefs.trending,
          re_engagement: initialPrefs.re_engagement,
          welcome: initialPrefs.welcome,
        }
      : DEFAULT_PREFS
  );
  const [isPending, startTransition] = useTransition();

  function handleToggle(key: PrefKey) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSave() {
    if (!user) return;
    startTransition(async () => {
      const { error } = await supabase
        .from("notification_preferences")
        .upsert({ ...prefs, user_id: user.id, updated_at: new Date().toISOString() });

      if (error) {
        toast.error("Failed to save preferences. Please try again.");
      } else {
        toast.success("Notification preferences saved.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card divide-y">
        {(Object.entries(PREFERENCE_LABELS) as [PrefKey, { label: string; description: string }][]).map(
          ([key, { label, description }]) => (
            <div key={key} className="flex items-start justify-between gap-4 px-4 py-4">
              <div className="flex-1 min-w-0">
                <Label htmlFor={`pref-${key}`} className="font-medium cursor-pointer">
                  {label}
                </Label>
                <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
              </div>
              <Switch
                id={`pref-${key}`}
                checked={prefs[key]}
                onCheckedChange={() => handleToggle(key)}
                className="shrink-0 mt-0.5"
              />
            </div>
          )
        )}
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : "Save preferences"}
        </Button>
      </div>
    </div>
  );
}
