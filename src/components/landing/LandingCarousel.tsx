"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselRecipe {
  id: string;
  title: string | null;
  photoUrl: string | null;
  authorName: string | null;
  cuisinePrimary: string | null;
}

export function LandingCarousel({ recipes }: { recipes: CarouselRecipe[] }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    ref.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  }

  return (
    <div className="relative group">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 rounded-full bg-background border shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipe/${recipe.id}`}
            className="flex-none w-48 rounded-xl border bg-card hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="relative aspect-square bg-muted">
              {recipe.photoUrl ? (
                <Image
                  src={recipe.photoUrl}
                  alt={recipe.title ?? "Recipe"}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-3xl">🍴</div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm leading-tight line-clamp-2 mb-1">
                {recipe.title}
              </h3>
              {recipe.authorName && (
                <p className="text-xs text-muted-foreground truncate">by {recipe.authorName}</p>
              )}
              {recipe.cuisinePrimary && (
                <span className="mt-1.5 inline-block text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                  {recipe.cuisinePrimary}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 rounded-full bg-background border shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
