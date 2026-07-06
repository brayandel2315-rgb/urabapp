import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCOP } from '@/utils/currency';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { STORE } from '@/utils/marketplace-copy';
import { isCourierOfferActive, remainingOfferSeconds } from '@/utils/courier-offer-utils';

function isCommerceOffer(order) {
  return order?.order_type !== 'courier' && order?.business_id;
}

export default function CourierOfferModal({ offer, onAccept, onReject, onExpire, loading }) {
  const [secondsLeft, setSecondsLeft] = useState(() => remainingOfferSeconds(offer));
  const expiredNotified = useRef(false);
  const order = offer?.orders;
  const commerce = isCommerceOffer(order);
  const business = order?.businesses;
  const expired = !isCourierOfferActive(offer) || secondsLeft <= 0;

  useEffect(() => {
    expiredNotified.current = false;
    setSecondsLeft(remainingOfferSeconds(offer));
  }, [offer?.id, offer?.expires_at]);

  useEffect(() => {
    if (!offer?.expires_at) return undefined;

    const tick = () => {
      const left = remainingOfferSeconds(offer);
      setSecondsLeft(left);
      if (left <= 0 && !expiredNotified.current) {
        expiredNotified.current = true;
        onExpire?.(offer);
      }
    };

    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [offer, onExpire]);

  if (!offer) return null;

  const payout = offer.payout_estimate || order?.fare_breakdown?.riderPayout || order?.rider_payout;
  const pickupLabel = commerce
    ? `${business?.name || STORE.one} — ${business?.address || 'Recoger en tienda'}`
    : (order?.pickup_address || 'Punto de recogida');
  const destLabel = order?.dest_address || 'Dirección de entrega';
  const orderRef = order?.order_number || (offer.order_id ? offer.order_id.slice(0, 8).toUpperCase() : 'Pedido');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="w-full max-w-md overflow-hidden rounded-3xl border border-border/40 bg-card shadow-2xl"
        >
          <div className={cn(
            'px-5 py-4',
            expired ? 'bg-muted/40' : 'bg-gradient-to-br from-primary/15 to-primary/5',
          )}
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-bold text-foreground">
                {expired ? 'Oferta no disponible' : (commerce ? 'Nuevo pedido de comida' : 'Nuevo mandado')}
              </p>
              {!expired && (
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 font-mono text-sm font-bold',
                    secondsLeft <= 15 ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground',
                  )}
                >
                  {secondsLeft}s
                </span>
              )}
            </div>
            <p className="mt-1 text-2xl font-black text-primary">{formatCOP(payout)}</p>
            <p className="text-xs text-muted-foreground">
              {expired
                ? 'El tiempo para aceptar terminó. Te avisamos si hay una nueva ola.'
                : (commerce
                  ? 'La tienda ya inició preparación — recoge en el local y entrega al cliente'
                  : 'Ganancia estimada')}
            </p>
          </div>

          <div className="space-y-3 p-5 text-sm">
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Recoger</p>
              <p className="font-semibold text-foreground">{pickupLabel}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Entregar</p>
              <p className="font-semibold text-foreground">{destLabel}</p>
              {!order && (
                <p className="mt-1 text-xs text-muted-foreground">Ref. {orderRef}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {order?.distance_km != null && <span>{order.distance_km} km</span>}
              {order?.estimated_minutes != null && <span>~{order.estimated_minutes} min</span>}
              {order?.courier_package_type && <span>{order.courier_package_type}</span>}
              {offer.distance_to_pickup_km != null && (
                <span>A {Number(offer.distance_to_pickup_km).toFixed(1)} km de ti</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-border/50 p-4">
            {expired ? (
              <Button className="col-span-2" variant="outline" onClick={() => onReject?.(offer, true)}>
                Cerrar
              </Button>
            ) : (
              <>
                <Button variant="outline" disabled={loading} onClick={() => onReject(offer, false)}>
                  Rechazar
                </Button>
                <Button disabled={loading} onClick={() => onAccept(offer)}>
                  {loading ? 'Procesando…' : 'Aceptar entrega'}
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
