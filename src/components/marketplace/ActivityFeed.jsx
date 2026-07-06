import AppIcon from '@/design-system/icons/AppIcon';
import HomeSectionHeader from '../../modules/client/components/HomeSectionHeader';

import { formatDistanceToNow } from '../../utils/time';

function relativeTime(iso) {
  if (!iso) return '';
  try {
    return formatDistanceToNow(new Date(iso));
  } catch {
    return '';
  }
}

export default function ActivityFeed({ activities, isLoading }) {
  if (isLoading) {
    return (
      <section>
        <h2 className="section-title mb-3">Lo que está pasando</h2>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl bg-border/40" />
          ))}
        </div>
      </section>
    );
  }

  if (!activities?.length) {
    return null;
  }

  return (
    <section>
      <HomeSectionHeader
        title="Lo que está pasando"
        subtitle="Pedidos recientes en Urabá"
        aside={(
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            En vivo
          </span>
        )}
      />
      <div className="space-y-2">
        {activities.map((a) => (
          <div key={a.id} className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-2.5 shadow-card ring-1 ring-border/30">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
              <AppIcon name="check" size="sm" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-secondary">{a.label}</p>
              <p className="truncate text-xs text-muted">{a.detail} · {a.municipio}</p>
            </div>
            <span className="shrink-0 text-[10px] font-bold text-muted">{relativeTime(a.at)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
