"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { unblockUser } from "@/actions/social";

interface BlockedUser {
  blocked_id: string;
  blocked: {
    username: string | null;
    display_name: string | null;
    avatar_source: string | null;
    avatar_placeholder_key: string | null;
    avatar_custom_path: string | null;
  } | null;
}

interface BlockedUsersListProps {
  initialBlocks: BlockedUser[];
}

export function BlockedUsersList({ initialBlocks }: BlockedUsersListProps) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [unblocking, setUnblocking] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUnblock(blockedId: string) {
    setUnblocking(blockedId);
    startTransition(async () => {
      const result = await unblockUser(blockedId);
      if (result?.error) {
        toast.error("Failed to unblock user. Please try again.");
      } else {
        setBlocks((prev) => prev.filter((b) => b.blocked_id !== blockedId));
        toast.success("User unblocked");
      }
      setUnblocking(null);
    });
  }

  if (blocks.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">You haven't blocked anyone.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card divide-y">
      {blocks.map((block) => {
        const profile = block.blocked;
        const displayName = profile?.display_name || profile?.username || "Unknown user";
        const username = profile?.username;

        return (
          <div key={block.blocked_id} className="flex items-center gap-3 px-4 py-3">
            <UserAvatar
              profile={
                profile
                  ? {
                      avatar_source: profile.avatar_source,
                      avatar_placeholder_key: profile.avatar_placeholder_key,
                      avatar_custom_path: profile.avatar_custom_path,
                      display_name: profile.display_name,
                      username: profile.username,
                    }
                  : null
              }
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              {username && (
                <p className="text-xs text-muted-foreground truncate">@{username}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUnblock(block.blocked_id)}
              disabled={isPending && unblocking === block.blocked_id}
            >
              {isPending && unblocking === block.blocked_id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Unblock"
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
