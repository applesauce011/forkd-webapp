export default function FeedLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-card overflow-hidden animate-pulse">
          {/* Photo skeleton */}
          <div className="w-full aspect-video bg-muted" />
          <div className="p-4 space-y-3">
            {/* Author row */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-muted" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-28 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            </div>
            {/* Title */}
            <div className="h-5 w-3/4 bg-muted rounded" />
            {/* Tags row */}
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-6 w-20 bg-muted rounded-full" />
              <div className="h-6 w-14 bg-muted rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
