import AppIcon from '@/design-system/icons/AppIcon';
import { getCourierLevel } from '../constants';
import { cn } from '@/lib/utils';

const MODE_LABELS = {
  available: { label: 'Disponible', className: 'bg-emerald-500/20 text-emerald-100 ring-emerald-400/30' },
  paused: { label: 'Pausado', className: 'bg-amber-500/20 text-amber-100 ring-amber-400/30' },
  offline: { label: 'Desconectado', className: 'bg-white/10 text-white/70 ring-white/20' },
};

export default function RiderPulseHeader({ driver, mode = 'offline', className }) {
  if (!driver) return null;

  const level = getCourierLevel(driver.total_deliveries ?? 0);
  const rating = Number(driver.rating ?? 5).toFixed(1);
  const status = MODE_LABELS[mode] ?? MODE_LABELS.offline;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D2B45] via-[#123A5C] to-[#0E6BA8] p-5 text-white shadow-[0_12px_40px_rgba(13,43,69,0.28)]',
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/5 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 left-1/3 h-24 w-24 rounded-full bg-sky-400/10 blur-2xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1',
                status.className,
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-90" />
              {status.label}
            </span>
            <span className="text-[10px] font-semibold text-white/50">{driver.municipio}</span>
          </div>

          <p className="font-display mt-3 truncate text-xl font-bold tracking-tight sm:text-2xl">
            {driver.name}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-white/75">
            <span className="inline-flex items-center gap-1">
              <AppIcon name="star" size="xs" className="text-amber-300" />
              {rating}
            </span>
            <span className="text-white/40">·</span>
            <span>Mensajero UrabApp</span>
          </p>
        </div>

        <div className="shrink-0 text-center">
          <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm sm:h-[4.5rem] sm:w-[4.5rem]">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/55">Nivel</p>
            <p className="font-display text-sm font-black leading-tight sm:text-base">{level.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
