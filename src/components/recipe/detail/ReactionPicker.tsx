"use client";

import { useState, useEffect } from "react";
import { Smile } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSupabaseContext } from "@/contexts/SupabaseContext";

const EMOJIS = ["😍", "🤤", "🔥", "👏", "😋", "❤️", "💯", "👌"];

interface ReactionPickerProps {
  recipeId: string;
  userId?: string;
}

interface ReactionCount {
  emoji: string;
  count: number;
}

export function ReactionPicker({ recipeId, userId }: ReactionPickerProps) {
  const { supabase } = useSupabaseContext();
  const [reactions, setReactions] = useState<ReactionCount[]>([]);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Load reactions
    supabase
      .from("recipe_reactions")
      .select("emoji")
      .eq("recipe_id", recipeId)
      .then(({ data }) => {
        const counts = (data ?? []).reduce<Record<string, number>>((acc, r) => {
          acc[r.emoji] = (acc[r.emoji] ?? 0) + 1;
          return acc;
        }, {});
        setReactions(Object.entries(counts).map(([emoji, count]) => ({ emoji, count })));
      });

    if (userId) {
      supabase
        .from("recipe_reactions")
        .select("emoji")
        .eq("recipe_id", recipeId)
        .eq("user_id", userId)
        .maybeSingle()
        .then(({ data }) => setUserReaction(data?.emoji ?? null));
    }
  }, [supabase, recipeId, userId]);

  async function react(emoji: string) {
    if (!userId) { toast.error("Sign in to react"); return; }

    setOpen(false);
    const prev = userReaction;

    if (userReaction === emoji) {
      // Remove reaction
      setUserReaction(null);
      setReactions((rs) => rs.map((r) => r.emoji === emoji ? { ...r, count: r.count - 1 } : r).filter((r) => r.count > 0));
      await supabase.from("recipe_reactions").delete().eq("recipe_id", recipeId).eq("user_id", userId);
    } else {
      // Add/change reaction
      setUserReaction(emoji);
      setReactions((rs) => {
        const updated = rs.filter((r) => r.emoji !== prev).map((r) => ({ ...r }));
        const existing = updated.find((r) => r.emoji === emoji);
        if (existing) existing.count++; else updated.push({ emoji, count: 1 });
        return updated;
      });
      await supabase.from("recipe_reactions").upsert({ recipe_id: recipeId, user_id: userId, emoji });
    }
  }

  return (
    <div className="flex items-center gap-1">
      {/* Existing reactions */}
      {reactions.slice(0, 3).map((r) => (
        <button
          key={r.emoji}
          onClick={() => react(r.emoji)}
          className={`flex items-center gap-0.5 px-2 py-1.5 rounded-full text-sm border transition-colors ${
            userReaction === r.emoji ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
          }`}
        >
          {r.emoji} <span className="text-xs text-muted-foreground">{r.count}</span>
        </button>
      ))}

      {/* Add reaction popover */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground">
            <Smile className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="grid grid-cols-4 gap-1">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => react(emoji)}
                className={`p-2 text-xl rounded-lg hover:bg-muted transition-colors ${
                  userReaction === emoji ? "bg-primary/10" : ""
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
