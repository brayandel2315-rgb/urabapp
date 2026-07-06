export default function OffersSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-border/60" />
        <div className="h-8 w-3/4 max-w-sm rounded bg-border/60" />
      </div>
      <div className="h-[220px] rounded-2xl bg-border/50" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-20 shrink-0 rounded-full bg-border/50" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[4/3] rounded-2xl bg-border/50" />
            <div className="h-4 w-full rounded bg-border/40" />
            <div className="h-3 w-2/3 rounded bg-border/30" />
          </div>
        ))}
      </div>
    </div>
  );
}
