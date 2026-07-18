import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Badge } from '@/design-system/ui/badge';
import AppIcon from '@/design-system/icons/AppIcon';
import { isSocketEnabled } from '@/services/socket.service';
import { formatEtaLabel } from '@/utils/routing';
import { getTransition } from '@/design-system/motion/presets';

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
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  if (!isActive) return null;

  const live = isLocationLive(location?.updatedAt, now);
  const transport = isSocketEnabled() ? 'Socket.IO' : 'Realtime';
  const etaLabel = route ? formatEtaLabel(route) : null;

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={getTransition(reduceMotion)}
      className="overflow-hidden rounded-[var(--radius-component)] bg-gradient-to-br from-brand-charcoal via-[#0a1622] to-emerald-950 p-4 text-white shadow-float"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-foreground/80">
            <span className="text-emerald-300/90">{title}</span>
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
            className="relative border-0 bg-white/10 text-[10px] font-bold uppercase tracking-wide text-white"
          >
            <span className="relative mr-1.5 inline-flex h-2 w-2">
              {live && (
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" aria-hidden />
              )}
              <span
                className={`relative inline-block h-2 w-2 rounded-full ${live ? 'bg-emerald-400' : 'bg-amber-400'}`}
              />
            </span>
            {freshnessLabel(location?.updatedAt, now)}
          </Badge>
          <span className="text-[10px] text-white/50">{transport}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {etaLabel ? (
          <motion.div
            key={etaLabel}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={getTransition(reduceMotion, { type: 'spring' })}
            className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/15">
              <AppIcon name="mensajeria" size="sm" className="text-emerald-300" />
            </span>
            <div>
              <p className="text-sm font-bold">Llegada {etaLabel}</p>
              {route.km != null && (
                <p className="text-xs text-white/70">{route.km} km restantes</p>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
