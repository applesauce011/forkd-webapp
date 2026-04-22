export default function SearchLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Search bar skeleton */}
      <div className="h-11 w-full bg-muted rounded-lg animate-pulse" />

      {/* Filter chips skeleton */}
      <div className="flex gap-2 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-muted rounded-full" />
        ))}
      </div>

      {/* Results grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card overflow-hidden animate-pulse">
            <div className="w-full aspect-video bg-muted" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
