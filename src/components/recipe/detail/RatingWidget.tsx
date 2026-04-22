"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface RatingWidgetProps {
  currentRating: number;
  onRate: (stars: number) => void;
  onClose: () => void;
}

export function RatingWidget({ currentRating, onRate, onClose }: RatingWidgetProps) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(currentRating);

  const labels = ["", "Not great", "It was okay", "Pretty good!", "Really good!", "Amazing! ⭐"];

  return (
    <div className="mt-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium">How did it turn out?</p>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setSelected(star)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "h-7 w-7 transition-colors",
                star <= (hovered || selected)
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
      {(hovered || selected) > 0 && (
        <p className="text-xs text-muted-foreground mb-3">{labels[hovered || selected]}</p>
      )}
      <Button
        size="sm"
        onClick={() => selected > 0 && onRate(selected)}
        disabled={!selected}
        className="w-full"
      >
        Save Rating
      </Button>
    </div>
  );
}
