import { useEffect, useState } from 'react';
import { getCountdownParts } from '@/utils/offers-engine';
import { cn } from '@/lib/utils';

export function useCountdown(endsAt) {
  const [parts, setParts] = useState(() => getCountdownParts(endsAt));

  useEffect(() => {
    if (!endsAt) return undefined;
    const tick = () => setParts(getCountdownParts(endsAt));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return parts;
}

export default function OfferCountdown({
  endsAt,
  label = 'Termina en',
  className,
  compact = false,
  onExpire,
}) {
  const parts = useCountdown(endsAt);

  useEffect(() => {
    if (parts.total <= 0 && onExpire) onExpire();
  }, [parts.total, onExpire]);

  if (!endsAt) return null;

  return (
    <div className={cn('font-mono', className)}>
      {!compact && (
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      )}
      <p className={cn(
        'font-black tabular-nums text-primary',
        compact ? 'text-xs' : 'text-lg sm:text-xl'
      )}>
        {parts.label}
      </p>
    </div>
  );
}
