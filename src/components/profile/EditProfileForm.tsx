"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/actions/profile";
import type { Database } from "@/types/database";

type ProfileVisible = Database["public"]["Views"]["profiles_visible"]["Row"];

interface EditProfileFormProps {
  open: boolean;
  onClose: () => void;
  profile: ProfileVisible;
}

export function EditProfileForm({ open, onClose, profile }: EditProfileFormProps) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setDisplayName(profile.display_name ?? "");
      setBio(profile.bio ?? "");
    }
  }, [open, profile]);

  async function handleSave() {
    setSaving(true);
    const result = await updateProfile({
      display_name: displayName.trim() || undefined,
      bio: bio.trim() || undefined,
    });
    setSaving(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated");
      onClose();
      router.refresh();
    }
  }

  const canSave = !saving && displayName.trim().length > 0;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Edit Profile</SheetTitle>
        </SheetHeader>

        <div className="space-y-5">
          {/* Profile picture note */}
          <div className="rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
            To change your profile picture, use the{" "}
            <a
              href="https://apps.apple.com/app/forkd/id6757679956"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              Fork&apos;d iPhone app
            </a>
            .
          </div>

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
            <Label htmlFor="username">
              Username
              <span className="ml-2 text-xs font-normal text-muted-foreground">(cannot be changed)</span>
            </Label>
            <Input
              id="username"
              value={profile.username ?? ""}
              disabled
              className="text-muted-foreground bg-muted/50"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="bio">
              Bio{" "}
              <span className="text-muted-foreground font-normal">
                ({bio.length}/160)
              </span>
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 160))}
              placeholder="Tell the world about your cooking..."
              rows={4}
              maxLength={160}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={!canSave}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
