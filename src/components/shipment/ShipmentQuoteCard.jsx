import { formatCOP } from '@/utils/currency';
import Button from '@/components/ui/Button';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { isWompiEnabled } from '@/services/wompi.service';

export default function ShipmentQuoteCard({ quote, onContinue, loading, paymentMethod, onPaymentMethodChange, disabled = false }) {
  if (!quote) return null;
  const breakdown = quote.price_breakdown ?? quote.breakdown ?? {};
  const total = quote.total_cop ?? quote.totalCop;
  const eta = quote.eta_hours ?? quote.etaHours;

  return (
    <SurfaceCard className="space-y-4 ring-2 ring-primary/20">
      <div>
        <h2 className="section-title">Tu cotización</h2>
        <p className="text-sm text-muted-foreground">
          {quote.origin_municipio ?? quote.originMunicipio} → {quote.dest_municipio ?? quote.destMunicipio}
          {' · '}{quote.distance_km ?? quote.distanceKm} km · ~{eta}h
        </p>
      </div>

      <div className="space-y-2 rounded-2xl bg-muted/40 p-4 text-sm">
        <div className="flex justify-between"><span>Tarifa base</span><span>{formatCOP(breakdown.baseFee ?? 0)}</span></div>
        <div className="flex justify-between"><span>Distancia</span><span>{formatCOP(breakdown.distanceFee ?? 0)}</span></div>
        {(breakdown.weightFee ?? 0) > 0 && (
          <div className="flex justify-between"><span>Peso</span><span>{formatCOP(breakdown.weightFee)}</span></div>
        )}
        <div className="flex justify-between"><span>Protección</span><span>{formatCOP(breakdown.protectionFee ?? 1500)}</span></div>
        <div className="flex justify-between border-t border-border/50 pt-2 text-base font-bold text-foreground">
          <span>Total</span>
          <span className="text-primary">{formatCOP(total)}</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">Sin costos ocultos · elige cómo pagar</p>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onPaymentMethodChange?.('cash')}
          className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
            paymentMethod === 'cash' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
          }`}
        >
          Efectivo / contraentrega
        </button>
        {isWompiEnabled() && (
          <button
            type="button"
            onClick={() => onPaymentMethodChange?.('wompi')}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              paymentMethod === 'wompi' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
            }`}
          >
            Pagar con Wompi
          </button>
        )}
      </div>

      <Button type="button" className="w-full rounded-2xl py-3.5 font-bold shadow-glow" onClick={onContinue} disabled={loading || disabled}>
        {loading ? 'Creando envío...' : paymentMethod === 'wompi' ? 'Confirmar y pagar' : 'Continuar y confirmar'}
      </Button>
    </SurfaceCard>
  );
}
