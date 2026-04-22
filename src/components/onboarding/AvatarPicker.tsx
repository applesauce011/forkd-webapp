"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getPublicUrl } from "@/lib/utils/image";
import { cn } from "@/lib/utils/cn";
import { v4 as uuidv4 } from "uuid";

interface Placeholder {
  id: number;
  path: string;
}

interface AvatarPickerProps {
  userId: string;
  placeholders: Placeholder[];
  avatarSource: "placeholder" | "custom";
  onSourceChange: (s: "placeholder" | "custom") => void;
  selectedPlaceholder: string;
  onPlaceholderSelect: (path: string) => void;
  onCustomUpload: (path: string) => void;
}

export function AvatarPicker({
  userId,
  placeholders,
  avatarSource,
  onSourceChange,
  selectedPlaceholder,
  onPlaceholderSelect,
  onCustomUpload,
}: AvatarPickerProps) {
  const supabase = getSupabaseBrowserClient();
  const [uploading, setUploading] = useState(false);
  const [customUrl, setCustomUrl] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setUploading(true);
    const path = `${userId}/${uuidv4()}.jpg`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    setUploading(false);
    if (error) {
      toast.error("Upload failed");
      return;
    }
    const url = getPublicUrl("avatars", path);
    setCustomUrl(url ?? "");
    onCustomUpload(path);
    onSourceChange("custom");
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Choose your avatar</p>

      {/* Placeholder grid */}
      <div className="grid grid-cols-4 gap-2">
        {placeholders.map((p) => {
          const url = getPublicUrl("avatar-placeholders", p.path);
          if (!url) return null;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => { onPlaceholderSelect(p.path); onSourceChange("placeholder"); }}
              className={cn(
                "relative rounded-full overflow-hidden w-14 h-14 border-2 transition-all",
                avatarSource === "placeholder" && selectedPlaceholder === p.path
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-primary/50"
              )}
            >
              <Image src={url} alt="avatar" fill className="object-cover" />
            </button>
          );
        })}

        {/* Upload button */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={cn(
            "relative rounded-full w-14 h-14 border-2 border-dashed flex items-center justify-center transition-all",
            avatarSource === "custom"
              ? "border-primary ring-2 ring-primary/30"
              : "border-muted-foreground/40 hover:border-primary/50"
          )}
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : customUrl ? (
            <Image src={customUrl} alt="custom avatar" fill className="object-cover rounded-full" />
          ) : (
            <Upload className="h-5 w-5 text-muted-foreground" />
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleUpload}
          />
        </button>
      </div>
    </div>
  );
}
