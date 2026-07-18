import { cn } from '@/lib/utils';
import { SurfaceCard } from './SurfaceCard';
import AppIcon from '@/design-system/icons/AppIcon';

export function PriceRow({ label, value, highlight, muted, accent, className }) {
  return (
    <div className={cn('flex items-center justify-between gap-3 text-sm', className)}>
      <span
        className={cn(
          highlight ? 'font-bold text-foreground' : 'text-muted-foreground',
          muted && 'text-muted-foreground',
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          'font-semibold tabular-nums',
          highlight && 'font-display text-lg font-black text-primary',
          accent && 'font-bold text-primary',
          !highlight && !accent && 'text-foreground',
        )}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Desglose de precios — fees transparentes, total destacado, ETA opcional.
 */
export default function PriceSummary({
  rows,
  totalLabel = 'Total',
  totalValue,
  footnote,
  etaLabel,
  className,
}) {
  return (
    <SurfaceCard className={cn('space-y-2.5 rounded-[var(--radius-component)]', className)}>
      {rows?.map((row) => (
        <PriceRow
          key={row.label}
          label={row.label}
          value={row.value}
          accent={row.accent}
          muted={row.muted}
        />
      ))}
      {totalValue != null && (
        <div className="border-t border-border pt-2.5">
          <PriceRow label={totalLabel} value={totalValue} highlight />
        </div>
      )}
      {(etaLabel || footnote) && (
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {etaLabel ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
              <AppIcon name="pending" size={12} aria-hidden />
              {etaLabel}
            </span>
          ) : null}
          {footnote ? (
            <p className="text-[11px] leading-relaxed text-muted-foreground">{footnote}</p>
          ) : null}
        </div>
      )}
    </SurfaceCard>
  );
}
