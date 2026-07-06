import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { formatCOP } from '@/utils/currency';
import { STORE } from '@/utils/marketplace-copy';

/** Resumen compacto — visible en desktop durante todo el flujo */
export default function CheckoutOrderSummary({
  businessName,
  items,
  itemSavings,
  total,
  etaMinutes,
  allowPartialFulfillment,
  className = '',
}) {
  return (
    <SurfaceCard className={`space-y-3 lg:sticky lg:top-20 ${className}`}>
      <SectionTitle>{businessName || 'Tu pedido'}</SectionTitle>
      <div className="max-h-48 space-y-2 overflow-y-auto">
        {items.map((item) => (
          <div key={item.lineId || item.productId} className="flex justify-between gap-2 text-sm">
            <span className="min-w-0 truncate">{item.quantity}× {item.name}</span>
            <span className="shrink-0 font-semibold">{formatCOP(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      {itemSavings > 0 && (
        <p className="text-xs font-semibold text-primary">Ahorras {formatCOP(itemSavings)}</p>
      )}
      {allowPartialFulfillment !== false && (
        <p className="text-[11px] leading-snug text-muted-foreground">
          {STORE.partialFulfillment}
        </p>
      )}
      <div className="border-t border-border/50 pt-3">
        <div className="flex items-end justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-display text-2xl font-black text-foreground">{formatCOP(total)}</span>
        </div>
        {etaMinutes != null && (
          <p className="mt-1 text-xs text-muted-foreground">~{etaMinutes} min estimados</p>
        )}
      </div>
    </SurfaceCard>
  );
}
