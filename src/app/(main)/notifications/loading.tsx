export default function NotificationsLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-2">
      <div className="h-7 w-36 bg-muted rounded animate-pulse mb-4" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-4 rounded-xl border bg-card animate-pulse"
        >
          <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-3.5 w-3/4 bg-muted rounded" />
            <div className="h-3 w-1/3 bg-muted rounded" />
          </div>
          <div className="w-12 h-12 rounded-lg bg-muted shrink-0" />
        </div>
      ))}
    </div>
  );
}
