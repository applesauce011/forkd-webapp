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
  percentile?: number;
}

function percentileLabel(p: number): string {
  if (p >= 99) return "Top 1%";
  if (p >= 95) return "Top 5%";
  if (p >= 90) return "Top 10%";
  if (p >= 75) return "Top 25%";
  if (p >= 50) return "Top 50%";
  return "Rising cook";
}

export function ShareStatCard({ stats, profile, percentile = 0 }: ShareStatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  async function handleShare() {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "forkd-stats.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "My Fork'd Stats" });
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "forkd-stats.png";
        link.click();
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.warn("Share failed:", err);
    } finally {
      setExporting(false);
    }
  }

  const displayName = profile.display_name || profile.username || "Chef";
  const streak = stats.current_streak ?? 0;
  const rank = percentile > 0 ? percentileLabel(percentile) : null;

  return (
    <div className="space-y-3">
      {/* Card that gets exported */}
      <div
        ref={cardRef}
        style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: "linear-gradient(135deg, #ea580c 0%, #d97706 60%, #b45309 100%)" }}
        className="rounded-2xl p-5 text-white w-full max-w-sm mx-auto shadow-xl overflow-hidden relative"
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", bottom: -30, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative">
          <div className="flex items-center gap-2.5">
            <UserAvatar profile={profile} size="md" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>{displayName}</div>
              {profile.username && (
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>@{profile.username}</div>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.05em" }}>FORK&apos;D</div>
            {rank && (
              <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 600, marginTop: 3 }}>
                {rank}
              </div>
            )}
          </div>
        </div>

        {/* Primary stats — 2×2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <StatTile label="Recipes" value={formatCount(stats.total_recipes)} accent />
          <StatTile label="Likes" value={formatCount(stats.total_likes)} />
          <StatTile label="Times Cooked" value={formatCount(stats.total_cooks)} />
          <StatTile label="Avg Rating" value={formatRating(stats.avg_rating)} />
        </div>

        {/* Secondary strip */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          <StatTile label="Saves" value={formatCount(stats.total_bookmarks)} small />
          <StatTile label={streak === 1 ? "Day Streak 🔥" : "Day Streak 🔥"} value={`${streak}`} small />
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1C3.686 1 1 3.686 1 7s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 2a4 4 0 110 8A4 4 0 017 3zm0 1.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" fill="rgba(255,255,255,0.6)" />
          </svg>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 500, letterSpacing: "0.03em" }}>
            forkd.app • My Creator Stats
          </span>
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

interface StatTileProps {
  label: string;
  value: string;
  accent?: boolean;
  small?: boolean;
}

function StatTile({ label, value, accent, small }: StatTileProps) {
  return (
    <div
      style={{
        background: accent ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.13)",
        borderRadius: 12,
        padding: small ? "8px 10px" : "10px 12px",
        textAlign: "center",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: small ? 18 : 22, lineHeight: 1.1 }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,0.75)", fontSize: small ? 10 : 11, marginTop: 2, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}
