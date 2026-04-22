"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ReportModal } from "@/components/shared/ReportModal";
import { formatRelativeTime } from "@/lib/utils/format";
import { ROUTES } from "@/lib/constants/routes";
import type { Profile } from "@/types/app";

interface RecipeHeroProps {
  recipe: {
    id: string;
    title: string;
    recipe_photos?: { id: string; url: string; position: number }[] | null;
    created_at: string;
    author_id: string;
    parent_id?: string | null;
  };
  author: Profile | null;
  userId?: string;
}

export function RecipeHero({ recipe, author, userId }: RecipeHeroProps) {
  const router = useRouter();
  const [reportOpen, setReportOpen] = useState(false);
  const photoUrl =
    recipe.recipe_photos && recipe.recipe_photos.length > 0
      ? [...recipe.recipe_photos].sort((a, b) => a.position - b.position)[0].url
      : null;
  const isOwn = userId && userId === recipe.author_id;

  return (
    <div className="relative">
      {/* Cover photo */}
      {photoUrl ? (
        <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-muted rounded-2xl overflow-hidden mx-0">
          <Image src={photoUrl} alt={recipe.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl" />
        </div>
      ) : (
        <div className="w-full aspect-[4/3] md:aspect-[16/9] bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl" />
      )}

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {/* Overflow menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isOwn ? (
            <>
              <DropdownMenuItem asChild>
                <Link href={ROUTES.RECIPE_EDIT(recipe.id)}>Edit Recipe</Link>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => setReportOpen(true)}>
                Report Recipe
              </DropdownMenuItem>
            </>
          )}
          {recipe.parent_id === null && !isOwn && (
            <DropdownMenuItem asChild>
              <Link href={`${ROUTES.RECIPE_NEW}?remix=${recipe.id}`}>Remix This</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Title + author overlay (if photo exists) */}
      {photoUrl && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl font-bold text-white mb-2 leading-tight">{recipe.title}</h1>
          {author && (
            <Link href={ROUTES.PROFILE(author.username ?? "")} className="flex items-center gap-2">
              <UserAvatar profile={author} size="sm" />
              <div>
                <p className="text-sm font-medium text-white">{author.display_name || author.username}</p>
                <p className="text-xs text-white/70">{formatRelativeTime(recipe.created_at)}</p>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Title (no photo) */}
      {!photoUrl && (
        <div className="px-4 pt-4">
          <h1 className="text-2xl font-bold leading-tight mb-2">{recipe.title}</h1>
          {author && (
            <Link href={ROUTES.PROFILE(author.username ?? "")} className="flex items-center gap-2">
              <UserAvatar profile={author} size="sm" />
              <div>
                <p className="text-sm font-medium">{author.display_name || author.username}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(recipe.created_at)}</p>
              </div>
            </Link>
          )}
        </div>
      )}

      <ReportModal
        open={reportOpen}
        onOpenChange={setReportOpen}
        targetType="recipe"
        targetId={recipe.id}
      />
    </div>
  );
}
