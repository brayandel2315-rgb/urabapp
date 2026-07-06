import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PaymentMethodsPanel from '@/components/payments/PaymentMethodsPanel';
import TipSelector from '@/components/checkout/TipSelector';
import { formatCOP } from '@/utils/currency';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function CheckoutPaymentStep({
  paymentMethod,
  setPaymentMethod,
  cashChange,
  setCashChange,
  tipAmount,
  setTipAmount,
  couponInput,
  setCouponInput,
  appliedCoupon,
  couponLoading,
  onApplyCoupon,
  onRemoveCoupon,
  total,
  fieldErrors,
  setFieldErrors,
}) {
  return (
    <div className="space-y-4">
      <SurfaceCard padding={false}>
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <SectionTitle>Método de pago</SectionTitle>
              <p className="text-sm text-muted-foreground">Efectivo, Nequi, Daviplata o tarjeta vía Wompi.</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">Seguro</span>
          </div>
          <PaymentMethodsPanel
            variant="selectable"
            selectedId={paymentMethod}
            onSelect={setPaymentMethod}
            embedded
          />
          {paymentMethod === 'cash' && (
            <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-3">
              <Input
                label="¿Con cuánto pagas? (opcional, para el cambio)"
                placeholder="Ej: 50.000"
                value={cashChange}
                onChange={(e) => {
                  setCashChange(e.target.value);
                  setFieldErrors((err) => ({ ...err, cashChange: undefined }));
                }}
              />
              {fieldErrors.cashChange && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.cashChange}</p>
              )}
            </div>
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard className="p-4">
        <TipSelector value={tipAmount} onChange={setTipAmount} />
      </SurfaceCard>

      {isSupabaseConfigured && (
        <SurfaceCard className="space-y-3">
          <SectionTitle>Código promocional</SectionTitle>
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[140px] flex-1">
              <Input
                label="Cupón"
                placeholder="Ej: URABA10"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                disabled={!!appliedCoupon}
              />
            </div>
            {appliedCoupon ? (
              <Button type="button" variant="outline" onClick={onRemoveCoupon}>
                Quitar
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                disabled={couponLoading || !couponInput.trim()}
                onClick={onApplyCoupon}
              >
                {couponLoading ? 'Validando…' : 'Aplicar'}
              </Button>
            )}
          </div>
          {appliedCoupon && (
            <p className="text-sm text-primary">
              Cupón <strong>{appliedCoupon.code}</strong> — {formatCOP(appliedCoupon.discount)} de descuento
            </p>
          )}
        </SurfaceCard>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Total a pagar: <strong className="text-foreground">{formatCOP(total)}</strong>
      </p>
    </div>
  );
}
