import { formatCOP } from '@/utils/currency';
import { SHIPMENT_STATUS } from '@/data/shipment-catalog';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import OrderTimeline, { mapShipmentEventsToTimeline } from '@/components/tracking/OrderTimeline';

function formatEta(etaAt) {
  if (!etaAt) return 'Calculando...';
  const d = new Date(etaAt);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('es-CO', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function ShipmentTrackingPanel({ shipment, events = [], tracking = [] }) {
  if (!shipment) return null;

  const latest = tracking[0];
  const hasLocation = shipment.current_latitude != null && shipment.current_longitude != null;
  const driver = shipment.drivers;

  return (
    <div className="space-y-4">
      <UnifiedTrackingPanel type="shipment" shipment={shipment} viewer="client" />

      <SurfaceCard className="ring-1 ring-primary/15">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Estado actual</p>
            <p className="font-display text-xl font-bold text-foreground">{SHIPMENT_STATUS[shipment.status] || shipment.status}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {shipment.origin_municipio} → {shipment.dest_municipio}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Entrega estimada</p>
            <p className="text-sm font-bold text-primary">{formatEta(shipment.eta_at)}</p>
            <p className="mt-1 text-lg font-black text-foreground">{formatCOP(shipment.total_cop)}</p>
          </div>
        </div>

        {hasLocation && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2 text-sm">
            <AppIcon name="map" size="sm" className="text-primary" />
            <span className="text-muted-foreground">
              Ubicación en vivo
              {driver?.name ? ` · ${driver.name}` : ''}
            </span>
          </div>
        )}

        {latest && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            Última señal: {new Date(latest.recorded_at).toLocaleTimeString('es-CO')}
          </p>
        )}
      </SurfaceCard>

      {events.length > 0 && (
        <OrderTimeline events={mapShipmentEventsToTimeline(events)} />
      )}
    </div>
  );
}
