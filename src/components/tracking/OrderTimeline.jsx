import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { getEventMeta, formatEventTime, isTimelineEvent, ACTOR_ROLE_LABELS } from '@/data/order-tracking-catalog';

/** Mapea eventos de envío intermunicipal al formato de timeline unificado */
export function mapShipmentEventsToTimeline(events = []) {
  return events.map((ev) => ({
    id: ev.id,
    event_type: ev.event_type || ev.status,
    description: ev.notes || ev.description,
    actor_role: 'system',
    created_at: ev.created_at,
  }));
}

function TimelineItem({ event, isLast }) {
  const meta = getEventMeta(event.event_type);
  const description = event.description || meta.label;

  return (
    <li className="relative flex gap-3 pb-5">
      {!isLast && (
        <span
          className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-0.5 bg-border/70"
          aria-hidden
        />
      )}
      <div
        className={cn(
          'relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-background',
          meta.bg,
        )}
      >
        <AppIcon name={meta.icon} size="xs" className={meta.color} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-foreground">{meta.label}</p>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {ACTOR_ROLE_LABELS[event.actor_role] || event.actor_role}
          </span>
        </div>
        {description !== meta.label && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {formatEventTime(event.created_at)}
        </p>
      </div>
    </li>
  );
}

export default function OrderTimeline({ events = [], compact = false, className }) {
  const visible = events.filter((e) => isTimelineEvent(e.event_type));

  if (!visible.length) {
    return (
      <SurfaceCard className={cn('text-center text-sm text-muted-foreground', className)}>
        El historial del pedido aparecerá aquí en tiempo real.
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className={className}>
      <h3 className={cn('font-display font-bold text-foreground', compact ? 'text-sm' : 'section-title mb-4')}>
        {compact ? 'Actividad' : 'Línea de tiempo'}
      </h3>
      <ol className={compact ? 'max-h-48 overflow-y-auto pr-1' : ''}>
        {visible.map((event, index) => (
          <TimelineItem
            key={event.id}
            event={event}
            isLast={index === visible.length - 1}
          />
        ))}
      </ol>
    </SurfaceCard>
  );
}
