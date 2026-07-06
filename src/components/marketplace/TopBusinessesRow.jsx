import BusinessCard from '../BusinessCard';
import HomeSectionHeader from '../../modules/client/components/HomeSectionHeader';
import AppIcon from '@/design-system/icons/AppIcon';

export function BusinessListSkeleton({ count = 6, variant = 'grid' }) {
  if (variant === 'list') {
    return (
      <div className="app-mobile-card-list">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex animate-pulse gap-3 overflow-hidden rounded-2xl bg-card p-3 ring-1 ring-border/40">
            <div className="h-[104px] w-[104px] shrink-0 rounded-xl bg-muted" />
            <div className="flex flex-1 flex-col justify-center space-y-2 py-1">
              <div className="h-4 w-2/3 rounded-lg bg-muted" />
              <div className="h-3 w-full rounded-lg bg-muted/70" />
              <div className="h-3 w-1/2 rounded-lg bg-muted/50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl bg-card ring-1 ring-border/40">
          <div className="aspect-[4/3] bg-muted" />
          <div className="space-y-2 p-3">
            <div className="h-4 w-2/3 rounded-lg bg-muted" />
            <div className="h-3 w-full rounded-lg bg-muted/70" />
            <div className="h-3 w-1/2 rounded-lg bg-muted/50" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TopBusinessesRow({
  businesses,
  title = 'Mejor calificados',
  subtitle = 'Según la puntuación de clientes',
  showRank = true,
  limit = 3,
}) {
  const items = businesses.slice(0, limit);
  if (!items.length) return null;

  return (
    <section className="min-w-0">
      <HomeSectionHeader
        title={title}
        subtitle={subtitle}
        aside={(
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
            <AppIcon name="star" size="xs" />
            Top {items.length}
          </span>
        )}
      />
      <div className="app-responsive-catalog">
        {items.map((b, index) => (
          <BusinessCard
            key={b.id}
            business={b}
            layout="grid"
            rank={showRank ? index + 1 : undefined}
            className="h-full"
          />
        ))}
      </div>
    </section>
  );
}
