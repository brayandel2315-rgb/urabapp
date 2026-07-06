import { useEffect, useState } from 'react';
import { Badge } from '@/design-system/ui/badge';
import AppIcon from '@/design-system/icons/AppIcon';
import { isSocketEnabled } from '@/services/socket.service';
import { formatEtaLabel } from '@/utils/routing';

function freshnessLabel(updatedAt, now) {
  if (!updatedAt) return 'Esperando GPS…';
  const ageSec = Math.round((now - new Date(updatedAt).getTime()) / 1000);
  if (ageSec < 8) return 'En vivo';
  if (ageSec < 60) return `Última ubicación hace ${ageSec}s`;
  if (ageSec < 300) return `Última ubicación hace ${Math.round(ageSec / 60)} min`;
  return 'Señal débil — última ubicación antigua';
}

function isLocationLive(updatedAt, now) {
  if (!updatedAt) return false;
  return (now - new Date(updatedAt).getTime()) < 20_000;
}

export default function LiveTrackingHeader({
  title = 'Seguimiento en vivo',
  subtitle,
  riderName,
  location,
  route,
  isActive = true,
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  if (!isActive) return null;

  const live = isLocationLive(location?.updatedAt, now);
  const transport = isSocketEnabled() ? 'Socket.IO' : 'Realtime';

  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-4 text-white shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300/90">
            {title}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm text-white/80">{subtitle}</p>
          )}
          {riderName && (
            <p className="mt-2 text-sm font-semibold">
              {riderName}
              <span className="ml-2 font-normal text-white/70">en camino</span>
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Badge
            variant={live ? 'success' : 'muted'}
            className="border-0 bg-white/10 text-[10px] font-bold uppercase tracking-wide text-white"
          >
            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${live ? 'animate-pulse bg-emerald-400' : 'bg-amber-400'}`} />
            {freshnessLabel(location?.updatedAt, now)}
          </Badge>
          <span className="text-[10px] text-white/50">{transport}</span>
        </div>
      </div>

      {route && formatEtaLabel(route) && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
          <AppIcon name="mensajeria" size="sm" className="text-emerald-300" />
          <div>
            <p className="text-sm font-bold">Llegada {formatEtaLabel(route)}</p>
            {route.km != null && (
              <p className="text-xs text-white/70">{route.km} km restantes</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
