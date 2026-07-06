import { Link } from 'react-router-dom';
import { Badge } from '@/design-system/ui/badge';
import AppIcon from '@/design-system/icons/AppIcon';
import { SHIPMENT_STATUS } from '@/data/shipment-catalog';
import { formatCOP } from '@/utils/currency';

const STATUS_VARIANT = {
  created: 'warning',
  searching_carrier: 'warning',
  accepted: 'secondary',
  pickup: 'success',
  at_hub: 'success',
  in_transit: 'success',
  arriving: 'success',
  delivered: 'muted',
  completed: 'muted',
  cancelled: 'destructive',
};

export default function ShipmentCard({ shipment }) {
  const variant = STATUS_VARIANT[shipment.status] || 'muted';

  return (
    <Link
      to={`/envios/${shipment.id}`}
      className="block overflow-hidden rounded-2xl border border-[#D5E3EF] bg-white p-4 shadow-card transition-all hover:shadow-lift active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="warning">Envío</Badge>
          <p className="text-xs font-bold uppercase tracking-wide text-[#4A6278]">
            {shipment.shipment_number || `#${String(shipment.id).slice(0, 8)}`}
          </p>
        </div>
        <Badge variant={variant}>{SHIPMENT_STATUS[shipment.status] || shipment.status}</Badge>
      </div>
      <p className="mt-2 font-display text-xl font-bold text-[#0D2B45]">
        {formatCOP(shipment.total_cop)}
      </p>
      <p className="mt-1 text-sm text-[#4A6278]">
        {shipment.origin_municipio} → {shipment.dest_municipio}
      </p>
      <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
        Ver seguimiento
        <AppIcon name="link" size="xs" />
      </p>
    </Link>
  );
}
