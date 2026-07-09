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
    <Button asChild className="h-12 min-w-[9.5rem] rounded-2xl px-5 text-base font-bold shadow-glow" disabled={disabled}>
      <Link to={href}>{actionLabel}</Link>
    </Button>
  ) : (
    <Button
      type={type}
      form={form}
      className="h-12 min-w-[9.5rem] rounded-2xl px-5 text-base font-bold shadow-glow"
      disabled={disabled || loading}
      onClick={onAction}
    >
      {loading ? 'Procesando…' : actionLabel}
    </Button>
  );

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-40 border-t border-border/50 bg-background/95 shadow-lift backdrop-blur-xl lg:hidden',
        className
      )}
      style={{
        bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{totalLabel}</p>
          <p className="font-display text-xl font-black text-foreground">{formatCOP(total)}</p>
          {hint ? <p className="truncate text-[11px] text-muted-foreground">{hint}</p> : null}
        </div>
        {action}
      </div>
    </div>
  );
}
