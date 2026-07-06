import { formatCOP } from '@/utils/currency';
import { formatFareLines } from '@/utils/courier-fare';
import { cn } from '@/lib/utils';

export default function FareBreakdownCard({ fare, distanceKm, estimatedMinutes, className }) {
  if (!fare) return null;
  const lines = formatFareLines(fare);

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/20 bg-background/80 p-4 shadow-lift backdrop-blur-xl',
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tu envío</p>
        {distanceKm != null && (
          <p className="text-xs font-semibold text-foreground">
            {distanceKm} km · ~{estimatedMinutes} min
          </p>
        )}
      </div>
      <div className="space-y-2">
        {lines.map((line) => (
          <div
            key={line.label}
            className={cn(
              'flex items-center justify-between text-sm',
              line.highlight && 'border-t border-border/60 pt-2 font-display text-base font-bold text-foreground'
            )}
          >
            <span className={line.highlight ? 'text-foreground' : 'text-muted-foreground'}>
              {line.label}
            </span>
            <span className={line.highlight ? 'text-primary' : 'font-semibold text-foreground'}>
              {formatCOP(line.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
