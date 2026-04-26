"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { formatCount, formatRating } from "@/lib/utils/format";
import type { CreatorStatsFull } from "./types";

interface ShareProfile {
  display_name: string | null;
  username: string | null;
  avatar_source: string | null;
  avatar_placeholder_key: string | null;
  avatar_custom_path: string | null;
}

interface ShareStatCardProps {
  stats: CreatorStatsFull;
  profile: ShareProfile;
}

export function ShareStatCard({ stats, profile }: ShareStatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  async function handleShare() {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });

      // Convert dataUrl to File for Web Share API
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "forkd-stats.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Fork'd Stats",
        });
      } else {
        // Desktop fallback: trigger download
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "forkd-stats.png";
        link.click();
      }
    } catch (err) {
      // User cancelled or share failed — silently ignore
      if (process.env.NODE_ENV === 'development') console.warn("Share failed:", err);
    } finally {
      setExporting(false);
    }
  }

  const displayName = profile.display_name || profile.username || "Chef";

  return (
    <div className="space-y-3">
      {/* The card that gets exported */}
      <div
        ref={cardRef}
        className="rounded-2xl p-6 bg-gradient-to-br from-orange-500 to-amber-400 text-white w-full max-w-sm mx-auto shadow-lg"
        style={{ fontFamily: "sans-serif" }}
      >
        <div className="flex items-center gap-3 mb-5">
          <UserAvatar profile={profile} size="lg" />
          <div>
            <div className="font-bold text-lg leading-tight">{displayName}</div>
            {profile.username && (
              <div className="text-orange-100 text-sm">@{profile.username}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatBubble label="Recipes" value={formatCount(stats.total_recipes)} />
          <StatBubble label="Likes" value={formatCount(stats.total_likes)} />
          <StatBubble label="Cooks" value={formatCount(stats.total_cooks)} />
          <StatBubble label="Avg Rating" value={formatRating(stats.avg_rating)} />
        </div>

        <div className="text-center text-xs text-orange-100 font-medium tracking-wide">
          Powered by Fork'd 🍴
        </div>
      </div>

      <Button
        onClick={handleShare}
        disabled={exporting}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        size="sm"
      >
        {exporting ? (
          <>Exporting…</>
        ) : (
          <>
            <Share2 className="h-4 w-4 mr-2" />
            Share my stats
          </>
        )}
      </Button>
    </div>
  );
}

function StatBubble({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/20 rounded-xl p-3 text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-orange-100">{label}</div>
    </div>
  );
}
