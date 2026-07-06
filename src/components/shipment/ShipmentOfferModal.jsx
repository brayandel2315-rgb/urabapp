import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCOP } from '@/utils/currency';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const OFFER_TTL_SEC = 480;

export default function ShipmentOfferModal({ offer, onAccept, onReject, loading }) {
  const [secondsLeft, setSecondsLeft] = useState(OFFER_TTL_SEC);
  const shipment = offer?.shipment_orders;

  useEffect(() => {
    if (!offer?.expires_at) return undefined;
    const tick = () => {
      const left = Math.max(0, Math.ceil((new Date(offer.expires_at) - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0) onReject?.(offer, true);
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [offer?.expires_at, offer, onReject]);

  if (!offer || !shipment) return null;

  const payout = shipment.price_breakdown?.riderPayout
    ?? Math.round((shipment.total_cop || 0) * 0.72);

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
          <div className="bg-gradient-to-br from-teal-500/20 to-teal-500/5 px-5 py-4">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-bold text-foreground">Envío intermunicipal</p>
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 font-mono text-sm font-bold',
                  secondsLeft <= 30 ? 'bg-destructive text-destructive-foreground' : 'bg-teal-600 text-white',
                )}
              >
                {secondsLeft > 60 ? `${Math.ceil(secondsLeft / 60)}m` : `${secondsLeft}s`}
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-teal-700 dark:text-teal-300">{formatCOP(payout)}</p>
            <p className="text-xs text-muted-foreground">Ganancia estimada · {shipment.shipment_number}</p>
          </div>

          <div className="space-y-3 p-5 text-sm">
            <p className="font-semibold text-primary">
              {shipment.origin_municipio} → {shipment.dest_municipio}
            </p>
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Recoger</p>
              <p className="font-semibold text-foreground">{shipment.pickup_address || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Entregar</p>
              <p className="font-semibold text-foreground">{shipment.delivery_address}</p>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              {shipment.distance_km != null && <span>{shipment.distance_km} km</span>}
              {shipment.eta_hours != null && <span>~{shipment.eta_hours}h</span>}
              <span>Score {Number(offer.rank_score || 0).toFixed(0)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-border/50 p-4">
            <Button variant="outline" disabled={loading} onClick={() => onReject(offer, false)}>
              Rechazar
            </Button>
            <Button disabled={loading || secondsLeft <= 0} onClick={() => onAccept(offer)}>
              {loading ? 'Aceptando...' : 'Aceptar envío'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
