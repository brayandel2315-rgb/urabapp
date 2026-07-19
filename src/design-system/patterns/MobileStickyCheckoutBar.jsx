import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/design-system/ui/button';
import { formatCOP } from '@/utils/currency';

/**
 * Barra fija de conversión — total + CTA principal (estilo apps delivery).
 * Se posiciona sobre la bottom nav en móvil.
 */
export default function MobileStickyCheckoutBar({
  total,
  totalLabel = 'Total',
  actionLabel,
  disabled = false,
  loading = false,
  href,
  onAction,
  type = 'button',
  form,
  className,
  hint,
}) {
  const action = href ? (
    <Button asChild className="h-12 min-h-11 min-w-[9.5rem] rounded-[var(--radius-component)] px-5 text-base font-bold" disabled={disabled}>
      <Link to={href}>{actionLabel}</Link>
    </Button>
  ) : (
    <Button
      type={type}
      form={form}
      className="h-12 min-h-11 min-w-[9.5rem] rounded-[var(--radius-component)] px-5 text-base font-bold"
      disabled={disabled || loading}
      onClick={onAction}
    >
      {loading ? 'Procesando…' : actionLabel}
    </Button>
  );

  return (
    <div
      className={cn(
        'store-sticky-cart fixed left-0 right-0 z-40 border-t border-border/50 bg-white/96 backdrop-blur-xl lg:hidden',
        className
      )}
      style={{
        bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-2.5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{totalLabel}</p>
          <p className="font-display text-lg font-bold tabular-nums tracking-tight text-foreground">{formatCOP(total)}</p>
          {hint ? <p className="truncate text-[11px] font-medium text-primary">{hint}</p> : null}
        </div>
        {action}
      </div>
    </div>
  );
}
