import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { formatCOP } from '@/utils/currency';
import { STORE } from '@/utils/marketplace-copy';
import { cn } from '@/lib/utils';

/** Resumen compacto — visible en desktop durante todo el flujo */
export default function CheckoutOrderSummary({
  businessName,
  items,
  itemSavings,
  total,
  etaMinutes,
  allowPartialFulfillment,
  subtotal,
  deliveryFee,
  deliveryFeeNote,
  className = '',
}) {
  return (
    <SurfaceCard className={cn('space-y-3 rounded-[var(--radius-component)] lg:sticky lg:top-20', className)}>
      <SectionTitle>{businessName || 'Tu pedido'}</SectionTitle>
      <div className="max-h-48 space-y-2 overflow-y-auto">
        {items.map((item) => (
          <div key={item.lineId || item.productId} className="flex justify-between gap-2 text-sm">
            <span className="min-w-0 truncate text-muted-foreground">{item.quantity}× {item.name}</span>
            <span className="shrink-0 font-semibold tabular-nums text-foreground">
              {formatCOP(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 border-t border-border/60 pt-3 text-sm">
        {subtotal != null && (
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold tabular-nums">{formatCOP(subtotal)}</span>
          </div>
        )}
        {deliveryFee != null && (
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">
              Domicilio{deliveryFeeNote ? ` · ${deliveryFeeNote}` : ''}
            </span>
            <span className="font-semibold tabular-nums">
              {deliveryFee === 0 ? 'Gratis' : formatCOP(deliveryFee)}
            </span>
          </div>
        )}
        {itemSavings > 0 && (
          <p className="text-xs font-semibold text-primary">Ahorras {formatCOP(itemSavings)}</p>
        )}
      </div>

      {allowPartialFulfillment !== false && (
        <p className="text-[11px] leading-snug text-muted-foreground">
          {STORE.partialFulfillment}
        </p>
      )}

      <div className="border-t border-border/50 pt-3">
        <div className="flex items-end justify-between gap-2">
          <span className="text-sm font-medium text-muted-foreground">Total</span>
          <span className="font-display text-2xl font-black tabular-nums text-foreground">
            {formatCOP(total)}
          </span>
        </div>
        {etaMinutes != null && (
          <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
            <AppIcon name="pending" size={12} aria-hidden />
            ~{etaMinutes} min
          </p>
        )}
      </div>
    </SurfaceCard>
  );
}
