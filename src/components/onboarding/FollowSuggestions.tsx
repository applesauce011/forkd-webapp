"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
interface Suggestion {
  user_id: string;
  username: string;
  display_name: string;
  avatar_source: string;
  avatar_placeholder_key: string;
  avatar_custom_path: string;
  is_founding_cook: boolean;
}

interface FollowSuggestionsProps {
  userId: string;
  suggestions: Suggestion[];
}

export function FollowSuggestions({ userId, suggestions }: FollowSuggestionsProps) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  async function toggleFollow(targetId: string) {
    setLoading(targetId);
    if (followed.has(targetId)) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", userId)
        .eq("followed_id", targetId);
      setFollowed((prev) => { const n = new Set(prev); n.delete(targetId); return n; });
    } else {
      const { error } = await supabase.from("follows").insert({ follower_id: userId, followed_id: targetId });
      if (!error) {
        setFollowed((prev) => new Set([...prev, targetId]));
      }
    }
    setLoading(null);
  }

  async function handleContinue() {
    router.push("/feed");
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {suggestions.map((cook) => {
          const isFollowed = followed.has(cook.user_id);
          return (
            <div key={cook.user_id} className="bg-white/90 dark:bg-stone-900/90 rounded-2xl p-4 border text-center space-y-2">
              <div className="flex justify-center">
                <UserAvatar profile={cook} size="lg" />
              </div>
              <div>
                <p className="font-semibold text-sm">{cook.display_name || cook.username}</p>
                <p className="text-xs text-muted-foreground">@{cook.username}</p>
                {cook.is_founding_cook && (
                  <p className="text-xs text-blue-500 font-medium">Founding Cook ✓</p>
                )}
              </div>
              <Button
                size="sm"
                variant={isFollowed ? "secondary" : "default"}
                className="w-full text-xs"
                onClick={() => toggleFollow(cook.user_id)}
                disabled={loading === cook.user_id}
              >
                {isFollowed ? (
                  <><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Following</>
                ) : (
                  "Follow"
                )}
              </Button>
            </div>
          );
        })}
      </div>

      {suggestions.length === 0 && (
        <p className="text-center text-muted-foreground py-4">No suggestions available right now.</p>
      )}

      <div className="flex flex-col gap-2 pt-4">
        <Button onClick={handleContinue} className="w-full">
          {followed.size > 0 ? `Continue with ${followed.size} followed` : "Skip for now"} →
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          You can always follow more cooks from the Search tab
        </p>
      </div>
    </div>
  );
}
