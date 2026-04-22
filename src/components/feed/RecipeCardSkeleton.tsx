import { Skeleton } from "@/components/ui/skeleton";

export function RecipeCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-1.5">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <div className="p-2 space-y-1.5">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
        <div className="flex items-center gap-2 pt-0.5">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-10 ml-auto" />
        </div>
      </div>
    </div>
  );
}

export function RecipeCardSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}
