"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/utils/image";
import { cn } from "@/lib/utils/cn";

interface UserAvatarProps {
  profile: {
    avatar_source: string | null;
    avatar_placeholder_key: string | null;
    avatar_custom_path: string | null;
    display_name: string | null;
    username: string | null;
  } | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-lg",
};

export function UserAvatar({ profile, size = "md", className }: UserAvatarProps) {
  const avatarUrl = profile ? getAvatarUrl(profile) : null;
  const name = profile?.display_name || profile?.username || "?";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={cn(sizeMap[size], className)}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
      <AvatarFallback className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
