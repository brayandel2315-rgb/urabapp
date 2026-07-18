import { cn } from '@/lib/utils';

function StoreSkeletonRow() {
  return (
    <div className="flex gap-3 rounded-[var(--radius-component)] border border-border bg-card p-3 shadow-soft">
      <div className="h-[104px] w-[104px] shrink-0 animate-pulse rounded-xl bg-muted" />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-1">
        <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-muted/80" />
        <div className="h-3 w-2/5 animate-pulse rounded bg-muted/70" />
      </div>
    </div>
  );
}

function StoreSkeletonGrid() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-component)] border border-border bg-card shadow-soft">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted/80" />
      </div>
    </div>
  );
}

/** Skeleton premium para search / vertical discovery — evita pantalla de carga genérica. */
export default function DiscoverCatalogSkeleton({ rows = 5, className }) {
  return (
    <div className={cn('mt-6 space-y-6', className)} aria-busy="true" aria-label="Cargando resultados">
      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      <div className="space-y-3 lg:hidden">
        {Array.from({ length: rows }).map((_, i) => (
          <StoreSkeletonRow key={`list-${i}`} />
        ))}
      </div>
      <div className="hidden grid-cols-2 gap-4 lg:grid xl:grid-cols-3">
        {Array.from({ length: Math.min(rows, 6) }).map((_, i) => (
          <StoreSkeletonGrid key={`grid-${i}`} />
        ))}
      </div>
    </div>
  );
}
