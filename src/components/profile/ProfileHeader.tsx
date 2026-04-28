"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, UserCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { ReportModal } from "@/components/shared/ReportModal";
import { FoundingCookBadge } from "./FoundingCookBadge";
import { PremiumBadge } from "./PremiumBadge";
import { ProfileStats } from "./ProfileStats";
import { EditProfileForm } from "./EditProfileForm";
import { followUser, unfollowUser, blockUser } from "@/actions/social";
import type { Database } from "@/types/database";
import { useSupabaseContext } from "@/contexts/SupabaseContext";
import { ROUTES } from "@/lib/constants/routes";

type ProfileVisible = Database["public"]["Views"]["profiles_visible"]["Row"];
type ProfileCounters = Database["public"]["Views"]["profile_counters"]["Row"];

interface ProfileHeaderProps {
  profile: ProfileVisible;
  counters: ProfileCounters;
  isOwnProfile: boolean;
  initialIsFollowing: boolean;
  avgRating?: number | null;
}

export function ProfileHeader({
  profile,
  counters,
  isOwnProfile,
  initialIsFollowing,
  avgRating,
}: ProfileHeaderProps) {
  const router = useRouter();
  const { user } = useSupabaseContext();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followLoading, setFollowLoading] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const bioLines = profile.bio?.split("\n") ?? [];
  const bioLong = profile.bio && (profile.bio.length > 120 || bioLines.length > 3);

  async function handleFollowToggle() {
    if (!user) {
      toast.error("Sign in to follow users");
      return;
    }
    setFollowLoading(true);
    // Optimistic update
    setIsFollowing((prev) => !prev);
    const result = isFollowing
      ? await unfollowUser(profile.id!)
      : await followUser(profile.id!);
    if (result?.error) {
      // Revert on error
      setIsFollowing((prev) => !prev);
      toast.error(result.error);
    }
    setFollowLoading(false);
  }

  async function handleBlock() {
    if (!user) return;
    const result = await blockUser(profile.id!);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(`${profile.display_name || profile.username} has been blocked`);
      router.push(ROUTES.FEED);
    }
  }

  return (
    <div className="mb-6">
      {/* Top row: avatar + actions */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <UserAvatar profile={profile} size="xl" />

        <div className="flex items-center gap-2 mt-1">
          {isOwnProfile ? (
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant={isFollowing ? "outline" : "default"}
                onClick={handleFollowToggle}
                disabled={followLoading}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4 mr-1.5" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1.5" />
                    Follow
                  </>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setReportOpen(true)}>
                    Report
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleBlock}
                  >
                    Block
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {/* Name + badges */}
      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
        <h1 className="text-xl font-bold leading-tight">
          {profile.display_name || profile.username}
        </h1>
        {profile.is_founding_cook && <FoundingCookBadge />}
        {profile.is_premium && <PremiumBadge />}
      </div>

      {/* Username */}
      <p className="text-sm text-muted-foreground mb-3">@{profile.username}</p>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-3">
          <p
            className={`text-sm whitespace-pre-line ${!bioExpanded && bioLong ? "line-clamp-3" : ""}`}
          >
            {profile.bio}
          </p>
          {bioLong && (
            <button
              onClick={() => setBioExpanded((p) => !p)}
              className="text-xs text-primary mt-1"
            >
              {bioExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {/* Stats */}
      <ProfileStats counters={counters} avgRating={avgRating} />

      {/* Modals */}
      {isOwnProfile && (
        <EditProfileForm
          open={editOpen}
          onClose={() => setEditOpen(false)}
          profile={profile}
        />
      )}

      {!isOwnProfile && profile.id && (
        <ReportModal
          open={reportOpen}
          onOpenChange={setReportOpen}
          targetType="user"
          targetId={profile.id}
        />
      )}
    </div>
  );
}
