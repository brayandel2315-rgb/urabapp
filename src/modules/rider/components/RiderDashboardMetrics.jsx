import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';
import { formatCOP } from '@/utils/currency';
import { cn } from '@/lib/utils';
import { COURIER_LEVELS, getCourierLevel, formatOnlineTime } from '../constants';
import { spring } from '@/design-system/motion/presets';

const TONES = {
  emerald: {
    icon: 'bg-primary/10 text-primary ring-primary/20',
    value: 'text-primary',
    cell: 'lg:bg-gradient-to-br lg:from-primary/5 lg:to-card',
  },
  sky: {
    icon: 'bg-info/10 text-info ring-info/20',
    value: 'text-info',
    cell: '',
  },
  slate: {
    icon: 'bg-muted text-muted-foreground ring-border',
    value: 'text-foreground',
    cell: '',
  },
  amber: {
    icon: 'bg-amber-500/12 text-amber-700 ring-amber-500/20',
    value: 'text-amber-800',
    cell: 'lg:bg-gradient-to-br lg:from-amber-50/80 lg:to-card',
  },
};

function getLevelProgress(totalDeliveries = 0) {
  const level = getCourierLevel(totalDeliveries);
  const idx = COURIER_LEVELS.findIndex((l) => l.name === level.name);
  const next = COURIER_LEVELS[idx + 1];
  if (!next) {
    return { level, next: null, progress: 100, remaining: 0 };
  }
  const span = next.minDeliveries - level.minDeliveries;
  const done = totalDeliveries - level.minDeliveries;
  return {
    level,
    next,
    progress: Math.min(100, Math.round((done / span) * 100)),
    remaining: Math.max(0, next.minDeliveries - totalDeliveries),
  };
}

function KpiCell({ metric, className }) {
  const tone = TONES[metric.tone] ?? TONES.slate;

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1',
            tone.icon,
          )}
        >
          <AppIcon name={metric.icon} size="sm" />
        </div>
        {metric.badge && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            {metric.badge}
          </span>
        )}
      </div>

      <div className="mt-3 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {metric.label}
        </p>
        <p
          className={cn(
            'rider-kpi__value mt-1 font-display font-black tabular-nums tracking-tight',
            metric.featured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl',
            tone.value,
          )}
        >
          {metric.value}
        </p>
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
          {metric.hint}
        </p>
      </div>

      {metric.progress != null && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
            <span>{metric.progressLabel}</span>
            <span>{metric.progress}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
              initial={false}
              animate={{ width: `${metric.progress}%` }}
              transition={spring}
            />
          </div>
        </div>
      )}
    </>
  );

  const cellClass = cn(
    'rider-kpi__cell flex h-full min-h-[7.5rem] flex-col bg-card p-4 sm:min-h-[8rem] sm:p-5',
    tone.cell,
    metric.featured && 'rider-kpi__cell--featured sm:col-span-2 lg:col-span-1',
    metric.emphasize && 'ring-2 ring-inset ring-info/25',
    className,
  );

  if (metric.href) {
    return (
      <Link to={metric.href} className={cn(cellClass, 'transition-colors hover:bg-muted/40')}>
        {inner}
      </Link>
    );
  }

  return <div className={cellClass}>{inner}</div>;
}

export default function RiderDashboardMetrics({ stats, wallet, driver }) {
  const deliveries = driver?.total_deliveries ?? stats?.deliveries ?? 0;
  const levelInfo = getLevelProgress(deliveries);
  const onlineToday = formatOnlineTime(Number(driver?.total_online_seconds ?? 0));
  const activeOrders = stats?.activeOrders ?? 0;
  const earnedToday = wallet?.today ?? 0;
  const pending = wallet?.wallet?.balance_pending ?? 0;
  const available = wallet?.wallet?.balance_available ?? 0;
  const nextSettlement = wallet?.next_settlement_date;

  const metrics = [
    {
      id: 'earnings',
      label: 'Ganado hoy',
      value: formatCOP(earnedToday),
      hint: pending > 0
        ? `${formatCOP(pending)} pendiente · ${formatCOP(available)} disponible`
        : earnedToday > 0 ? 'Domicilios completados hoy' : 'Conéctate para empezar a ganar',
      icon: 'money',
      tone: 'emerald',
      featured: true,
      href: '/domiciliario/ganancias',
      badge: earnedToday > 0 ? 'Hoy' : null,
    },
    {
      id: 'active',
      label: 'Activos',
      value: activeOrders,
      hint: activeOrders === 1 ? 'Pedido en curso' : 'Pedidos en curso ahora',
      icon: 'package',
      tone: 'sky',
      badge: activeOrders > 0 ? 'En ruta' : null,
      emphasize: activeOrders > 0,
    },
    {
      id: 'deliveries',
      label: 'Entregas',
      value: deliveries,
      hint: 'Total completadas en UrabApp',
      icon: 'check',
      tone: 'slate',
    },
    {
      id: 'online',
      label: 'En línea',
      value: onlineToday,
      hint: levelInfo.next
        ? `${levelInfo.remaining} entregas para ${levelInfo.next.name}`
        : `Nivel máximo · ${levelInfo.level.name}`,
      icon: 'clock',
      tone: 'amber',
      badge: levelInfo.level.name,
      progress: levelInfo.next ? levelInfo.progress : 100,
      progressLabel: levelInfo.next ? `Hacia ${levelInfo.next.name}` : 'Nivel Platino',
    },
  ];

  return (
    <section className="rider-kpi" aria-label="Resumen de jornada">
      <div className="rider-kpi__shell overflow-hidden rounded-[var(--radius-component)] border border-border/60 bg-card shadow-soft">
        <div className="flex items-center justify-between gap-3 border-b border-border/50 bg-gradient-to-r from-muted/40 to-card px-4 py-3 sm:px-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-info">
              Resumen
            </p>
            <h2 className="font-display text-base font-bold text-foreground sm:text-lg">
              Tu jornada
            </h2>
            {nextSettlement && (
              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                Próxima liquidación: {new Date(nextSettlement).toLocaleDateString('es-CO')}
              </p>
            )}
          </div>
          <Link
            to="/domiciliario/ganancias"
            className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-info/10 px-3 py-1.5 text-xs font-bold text-info ring-1 ring-info/15 transition hover:bg-info/15"
          >
            Ver ganancias
            <AppIcon name="back" size={12} className="rotate-180" />
          </Link>
        </div>

        <div className="rider-kpi__grid grid grid-cols-2 gap-px bg-border/60 lg:grid-cols-4">
          {metrics.map((metric) => (
            <KpiCell key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
