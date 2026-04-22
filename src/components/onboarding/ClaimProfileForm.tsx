"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AvatarPicker } from "@/components/onboarding/AvatarPicker";
import { claimProfile } from "@/actions/profile";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const schema = z.object({
  display_name: z.string().min(2, "Must be at least 2 characters").max(50),
  username: z
    .string()
    .min(3, "Username must be 3–32 characters")
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  bio: z.string().max(200).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Placeholder {
  id: number;
  path: string;
}

interface ClaimProfileFormProps {
  userId: string;
  placeholders: Placeholder[];
}

export function ClaimProfileForm({ userId, placeholders }: ClaimProfileFormProps) {
  const supabase = getSupabaseBrowserClient();
  const [loading, setLoading] = useState(false);
  const [avatarSource, setAvatarSource] = useState<"placeholder" | "custom">("placeholder");
  const [selectedPlaceholder, setSelectedPlaceholder] = useState<string>(placeholders[0]?.path ?? "");
  const [customAvatarPath, setCustomAvatarPath] = useState<string>("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const username = watch("username");

  // Debounced username availability check
  const checkUsername = useCallback(
    async (val: string) => {
      if (!val || val.length < 3) return;
      setUsernameStatus("checking");
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", val.toLowerCase())
        .maybeSingle();
      setUsernameStatus(data ? "taken" : "available");
    },
    [supabase]
  );

  useEffect(() => {
    if (!username) { setUsernameStatus("idle"); return; }
    const timer = setTimeout(() => checkUsername(username), 500);
    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  async function onSubmit(data: FormValues) {
    setLoading(true);
    const result = await claimProfile({
      display_name: data.display_name,
      username: data.username,
      bio: data.bio,
      avatar_source: avatarSource,
      avatar_placeholder_key: avatarSource === "placeholder" ? selectedPlaceholder : undefined,
      avatar_custom_path: avatarSource === "custom" ? customAvatarPath : undefined,
    });
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
    // On success, claimProfile redirects to /onboarding/follow
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white/90 dark:bg-stone-900/90 rounded-2xl p-6 shadow-lg border-0">
      {/* Avatar */}
      <AvatarPicker
        userId={userId}
        placeholders={placeholders}
        avatarSource={avatarSource}
        onSourceChange={setAvatarSource}
        selectedPlaceholder={selectedPlaceholder}
        onPlaceholderSelect={setSelectedPlaceholder}
        onCustomUpload={setCustomAvatarPath}
      />

      {/* Display Name */}
      <div className="space-y-2">
        <Label htmlFor="display_name">Display Name</Label>
        <Input id="display_name" placeholder="e.g. Maria Chen" {...register("display_name")} />
        {errors.display_name && <p className="text-sm text-destructive">{errors.display_name.message}</p>}
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
          <Input id="username" className="pl-7" placeholder="your_username" {...register("username")} />
          {usernameStatus === "checking" && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {usernameStatus === "available" && (
            <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
          {usernameStatus === "taken" && (
            <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
          )}
        </div>
        {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
        {usernameStatus === "taken" && !errors.username && (
          <p className="text-sm text-destructive">Username is already taken</p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio <span className="text-muted-foreground text-xs">(optional)</span></Label>
        <Textarea id="bio" placeholder="Tell us about your cooking style..." rows={3} {...register("bio")} />
        {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading || usernameStatus === "taken" || usernameStatus === "checking"}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Continue
      </Button>
    </form>
  );
}
