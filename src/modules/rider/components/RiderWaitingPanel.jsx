import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import { formatCOP } from '@/utils/currency';
import { STORE } from '@/utils/marketplace-copy';

const TIPS = [
  `Mantente en zonas con más ${STORE.manyLower} abiertas`,
  'Las horas pico (12–2 pm y 6–9 pm) traen más pedidos',
  'Acepta rápido: los mejores repartidores responden en segundos',
];

function offerTitle(offer) {
  const order = offer?.orders;
  if (!order) return 'Nueva entrega';
  if (order.business_id && order.businesses?.name) {
    return `${order.businesses.name} → entrega`;
  }
  return order.order_number || 'Nueva entrega';
}

export default function RiderWaitingPanel({ municipio, offers = [], onSelectOffer }) {
  if (offers.length > 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-bold text-primary">¡{offers.length} entrega{offers.length > 1 ? 's' : ''} disponible{offers.length > 1 ? 's' : ''}!</p>
        {offers.map((offer) => {
          const order = offer.orders;
          const payout = offer.payout_estimate || order?.rider_payout;
          return (
            <SurfaceCard key={offer.id} className="rounded-[var(--radius-component)] border-primary/25 ring-1 ring-primary/15">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-bold text-foreground">{offerTitle(offer)}</p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{order?.dest_address}</p>
                  <p className="mt-2 text-lg font-black tabular-nums text-primary">{formatCOP(payout)}</p>
                </div>
                <Button className="min-h-11 shrink-0" onClick={() => onSelectOffer?.(offer)}>
                  Ver
                </Button>
              </div>
            </SurfaceCard>
          );
        })}
      </div>
    );
  }

  return (
    <SurfaceCard className="relative overflow-hidden rounded-[var(--radius-component)] text-center">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.08]">
        <span className="h-36 w-36 animate-ping rounded-full bg-primary" />
      </div>
      <div className="relative py-6">
        <AppIcon name="mensajeria" size="3xl" className="mx-auto text-primary" />
        <p className="font-display mt-4 text-lg font-bold text-foreground">Buscando pedidos…</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Estás en línea en {municipio}. Te avisamos cuando llegue una oferta.
        </p>
        <ul className="mx-auto mt-5 max-w-sm space-y-2 text-left text-xs text-muted-foreground">
          {TIPS.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span className="text-primary">·</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </SurfaceCard>
  );
}
