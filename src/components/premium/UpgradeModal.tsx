"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { BarChart2, BookmarkCheck, Search, ChefHat, Star, Flame } from "lucide-react";

const FEATURE_BULLETS: Record<string, { icon: React.ReactNode; text: string }[]> = {
  "Creator Stats": [
    { icon: <BarChart2 className="h-4 w-4 text-orange-500" />, text: "Full activity heatmap calendar" },
    { icon: <Star className="h-4 w-4 text-orange-500" />, text: "Rating distribution across all recipes" },
    { icon: <Flame className="h-4 w-4 text-orange-500" />, text: "Cooking streak tracking" },
    { icon: <ChefHat className="h-4 w-4 text-orange-500" />, text: "Cook percentile leaderboard" },
  ],
};

const DEFAULT_BULLETS = [
  { icon: <BookmarkCheck className="h-4 w-4 text-orange-500" />, text: "Unlimited bookmarks" },
  { icon: <Search className="h-4 w-4 text-orange-500" />, text: "Advanced search filters" },
  { icon: <BarChart2 className="h-4 w-4 text-orange-500" />, text: "Creator Stats dashboard" },
  { icon: <ChefHat className="h-4 w-4 text-orange-500" />, text: "Unlimited Cook Mode sessions" },
];

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

export function UpgradeModal({ open, onOpenChange, feature = "Premium" }: UpgradeModalProps) {
  const router = useRouter();
  const bullets = FEATURE_BULLETS[feature] ?? DEFAULT_BULLETS;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Unlock {feature}</DialogTitle>
          <DialogDescription>
            Get access to {feature} and all premium features with Fork'd Premium.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-3 my-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              {b.icon}
              <span>{b.text}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 mt-2">
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => {
              onOpenChange(false);
              router.push(ROUTES.UPGRADE);
            }}
          >
            Upgrade to Premium
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
