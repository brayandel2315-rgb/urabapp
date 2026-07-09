import { Link } from 'react-router-dom';
import { Badge } from '@/design-system/ui/badge';
import { ORDER_STATUS_LABELS } from '../utils/constants';
import { ORDER_STATUS_VARIANT } from '../utils/order-display';
import { formatCOP } from '../utils/currency';
import { isCourierOrder } from '../services/courier.service';

const STATUS_VARIANT = ORDER_STATUS_VARIANT;

export default function OrderCard({ order }) {
  const isCourier = isCourierOrder(order);
  const variant = STATUS_VARIANT[order.status] || 'muted';

  return (
    <Link
      to={`/pedidos/${order.id}`}
      className="block overflow-hidden rounded-2xl border border-[#D5E3EF] bg-white p-4 shadow-card transition-all hover:shadow-lift active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isCourier && <Badge variant="success">Mensajería</Badge>}
          <p className="text-xs font-bold uppercase tracking-wide text-[#4A6278]">
            {order.order_number || `#${String(order.id).slice(0, 8)}`}
          </p>
        </div>
        <Badge variant={variant}>{ORDER_STATUS_LABELS[order.status] || order.status}</Badge>
      </div>
      <p className="mt-2 font-display text-lg font-bold text-[#0D2B45]">{formatCOP(order.total)}</p>
      <p className="mt-1 line-clamp-2 text-sm text-[#4A6278]">
        {isCourier ? `${order.pickup_address || 'Recogida'} → ${order.dest_address}` : order.dest_address}
      </p>
      <p className="mt-2 text-xs font-semibold text-[#0E6BA8]">Ver detalle →</p>
    </Link>
  );
}
