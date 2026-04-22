"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Camera } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { updateProfile } from "@/actions/profile";
import { useSupabaseContext } from "@/contexts/SupabaseContext";
import { getPublicUrl } from "@/lib/utils/image";
import type { Database } from "@/types/database";

type ProfileVisible = Database["public"]["Views"]["profiles_visible"]["Row"];

interface AccountSettingsFormProps {
  profile: ProfileVisible;
}

export function AccountSettingsForm({ profile }: AccountSettingsFormProps) {
  const router = useRouter();
  const { supabase, user } = useSupabaseContext();

  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarPath, setAvatarPath] = useState<string | null>(
    profile.avatar_source === "custom" ? (profile.avatar_custom_path ?? null) : null
  );
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setUploading(true);
    const path = `${user.id}/${uuidv4()}.jpg`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    setUploading(false);
    if (error) {
      toast.error("Upload failed. Please try again.");
      return;
    }
    setAvatarPath(path);
    setAvatarPreviewUrl(getPublicUrl("avatars", path));
    toast.success("Avatar uploaded");
  }

  function handleSave() {
    startTransition(async () => {
      const payload: Parameters<typeof updateProfile>[0] = {
        display_name: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
      };
      if (avatarPath) {
        payload.avatar_source = "custom";
        payload.avatar_custom_path = avatarPath;
      }
      const result = await updateProfile(payload);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile saved");
        router.refresh();
      }
    });
  }

  const canSave = !isPending && !uploading && displayName.trim().length > 0;

  // Determine displayed avatar
  const currentAvatarProfile = avatarPath
    ? { ...profile, avatar_source: "custom" as const, avatar_custom_path: avatarPath }
    : profile;

  return (
    <div className="space-y-8">
      {/* Avatar */}
      <div className="space-y-2">
        <Label>Avatar</Label>
        <div className="flex items-center gap-4">
          {avatarPreviewUrl ? (
            <div className="relative h-20 w-20 rounded-full overflow-hidden border">
              <Image src={avatarPreviewUrl} alt="avatar" fill className="object-cover" />
            </div>
          ) : (
            <UserAvatar profile={currentAvatarProfile} size="xl" />
          )}
          <div className="flex flex-col gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Camera className="h-4 w-4 mr-2" />
              )}
              {uploading ? "Uploading…" : "Change Avatar"}
            </Button>
            <p className="text-xs text-muted-foreground">JPG, PNG or GIF · max 5 MB</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleAvatarUpload}
          />
        </div>
      </div>

      <Separator />

      {/* Display name */}
      <div className="space-y-1.5">
        <Label htmlFor="display-name">Display Name</Label>
        <Input
          id="display-name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
          maxLength={50}
        />
      </div>

      {/* Username (read-only) */}
      <div className="space-y-1.5">
        <Label>Username</Label>
        <p className="text-sm text-muted-foreground rounded-md border bg-muted/40 px-3 py-2">
          @{profile.username}
        </p>
        <p className="text-xs text-muted-foreground">Username cannot be changed.</p>
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <Label htmlFor="bio">
          Bio{" "}
          <span className="text-muted-foreground font-normal">({bio.length}/160)</span>
        </Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 160))}
          placeholder="Tell the world about your cooking…"
          rows={4}
          maxLength={160}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!canSave}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Profile
        </Button>
      </div>
    </div>
  );
}
