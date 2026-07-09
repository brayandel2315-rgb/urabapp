import { cn } from '@/lib/utils';
import { SurfaceCard } from './SurfaceCard';

export function PriceRow({ label, value, highlight, className }) {
  return (
    <div className={cn('flex items-center justify-between text-sm', className)}>
      <span className={highlight ? 'font-bold text-foreground' : 'text-muted'}>{label}</span>
      <span className={cn('font-semibold', highlight ? 'text-lg font-bold text-primary' : 'text-foreground')}>
        {value}
      </span>
    </div>
  );
}

export default function PriceSummary({ rows, totalLabel = 'Total', totalValue, footnote, className }) {
  return (
    <SurfaceCard className={cn('space-y-2', className)}>
      {rows?.map((row) => (
        <PriceRow key={row.label} label={row.label} value={row.value} />
      ))}
      {totalValue != null && (
        <div className="border-t border-border pt-2">
          <PriceRow label={totalLabel} value={totalValue} highlight />
        </div>
      )}
      {footnote && (
        <p className="text-[11px] leading-relaxed text-muted-foreground">{footnote}</p>
      )}
    </SurfaceCard>
  );
}
