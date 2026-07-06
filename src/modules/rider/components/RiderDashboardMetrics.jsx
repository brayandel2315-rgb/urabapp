import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { formatCOP } from '@/utils/currency';
import { cn } from '@/lib/utils';
import { COURIER_LEVELS, getCourierLevel, formatOnlineTime } from '../constants';

const TONES = {
  emerald: {
    icon: 'bg-emerald-500/12 text-emerald-600 ring-emerald-500/20',
    value: 'text-emerald-700',
    cell: 'lg:bg-gradient-to-br lg:from-emerald-50/90 lg:to-white',
  },
  sky: {
    icon: 'bg-sky-500/12 text-sky-700 ring-sky-500/20',
    value: 'text-[#0E6BA8]',
    cell: '',
  },
  slate: {
    icon: 'bg-slate-500/10 text-slate-600 ring-slate-500/15',
    value: 'text-[#0D2B45]',
    cell: '',
  },
  amber: {
    icon: 'bg-amber-500/12 text-amber-700 ring-amber-500/20',
    value: 'text-amber-800',
    cell: 'lg:bg-gradient-to-br lg:from-amber-50/80 lg:to-white',
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
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4A6278]">
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
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-[#6B8499]">
          {metric.hint}
        </p>
      </div>

      {metric.progress != null && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] font-semibold text-[#6B8499]">
            <span>{metric.progressLabel}</span>
            <span>{metric.progress}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#E8EEF3]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
              style={{ width: `${metric.progress}%` }}
            />
          </div>
        </div>
      )}
    </>
  );

  const cellClass = cn(
    'rider-kpi__cell flex h-full min-h-[7.5rem] flex-col bg-white p-4 sm:min-h-[8rem] sm:p-5',
    tone.cell,
    metric.featured && 'rider-kpi__cell--featured sm:col-span-2 lg:col-span-1',
    className,
  );

  if (metric.href) {
    return (
      <Link to={metric.href} className={cn(cellClass, 'transition-colors hover:bg-[#F8FBFD]')}>
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

  const metrics = [
    {
      id: 'earnings',
      label: 'Ganado hoy',
      value: formatCOP(earnedToday),
      hint: earnedToday > 0 ? 'Domicilios completados hoy' : 'Conéctate para empezar a ganar',
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
      <div className="rider-kpi__shell overflow-hidden rounded-3xl border border-[#D5E3EF] bg-white shadow-[0_8px_32px_rgba(13,43,69,0.06)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#E8EEF3] bg-gradient-to-r from-[#F8FBFD] to-white px-4 py-3 sm:px-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0E6BA8]">
              Resumen
            </p>
            <h2 className="font-display text-base font-bold text-[#0D2B45] sm:text-lg">
              Tu jornada
            </h2>
          </div>
          <Link
            to="/domiciliario/ganancias"
            className="inline-flex items-center gap-1 rounded-xl bg-[#E6F4FF] px-3 py-1.5 text-xs font-bold text-[#0E6BA8] ring-1 ring-[#0E6BA8]/15 transition hover:bg-[#D6EBFA]"
          >
            Ver ganancias
            <AppIcon name="back" size={12} className="rotate-180" />
          </Link>
        </div>

        <div className="rider-kpi__grid grid grid-cols-2 gap-px bg-[#E8EEF3] lg:grid-cols-4">
          {metrics.map((metric) => (
            <KpiCell key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
