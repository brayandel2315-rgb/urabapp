import Button from '../../../components/ui/Button';
import OrderIncidentReport from '@/components/tracking/OrderIncidentReport';
import { ORDER_STATUS } from '../../../utils/constants';
import { cn } from '@/lib/utils';

function getStatusActions(order) {
  const isMandado = !order.business_id;

  switch (order.status) {
    case ORDER_STATUS.PENDING:
      return [{ status: ORDER_STATUS.ACCEPTED, label: 'Aceptar' }];
    case ORDER_STATUS.ACCEPTED:
      return isMandado
        ? [{ status: ORDER_STATUS.ON_THE_WAY, label: 'En camino' }]
        : [{ status: ORDER_STATUS.PREPARING, label: 'Preparando' }];
    case ORDER_STATUS.PREPARING:
      return [{ status: ORDER_STATUS.ON_THE_WAY, label: 'En camino' }];
    case ORDER_STATUS.ON_THE_WAY:
      return [{ status: ORDER_STATUS.DELIVERED, label: 'Entregado' }];
    default:
      return [];
  }
}

export default function AdminOrderActions({
  order,
  drivers = [],
  onStatus,
  onAssign,
  onAutoAssign,
  onWhatsApp,
  compact = false,
}) {
  const isMandado = !order.business_id;
  const actions = getStatusActions(order);
  const canCancel = !['delivered', 'cancelled'].includes(order.status);

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? '' : 'mt-2'}`}>
      {!order.driver_id && canCancel && onAutoAssign && (
        <Button size="sm" variant="primary" onClick={() => onAutoAssign(order.id)}>
          Buscar mensajero
        </Button>
      )}
      {drivers.length > 0 && canCancel && (
        <select
          className={cn(
            'h-8 rounded-xl border border-input bg-background px-2 text-xs font-medium text-foreground',
            'outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
          )}
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              onAssign(order.id, e.target.value);
              e.target.value = '';
            }
          }}
        >
          <option value="">{order.driver_id ? 'Reasignar mensajero' : 'Asignar mensajero'}</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}{d.is_online ? ' · en línea' : ''}
            </option>
          ))}
        </select>
      )}
      {onWhatsApp && (
        <Button size="sm" variant="outline" onClick={() => onWhatsApp(order)}>
          WA
        </Button>
      )}
      {isMandado && (
        <span className="self-center rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-secondary">
          Mandado
        </span>
      )}
      {actions.map((action) => (
        <Button
          key={action.status}
          size="sm"
          variant={action.status === ORDER_STATUS.ACCEPTED ? 'primary' : 'outline'}
          onClick={() => onStatus(order.id, action.status)}
        >
          {action.label}
        </Button>
      ))}
      {canCancel && (
        <Button
          size="sm"
          variant="ghost"
          className="text-red-600"
          onClick={() => onStatus(order.id, ORDER_STATUS.CANCELLED)}
        >
          Cancelar
        </Button>
      )}
      {canCancel && <OrderIncidentReport orderId={order.id} compact />}
    </div>
  );
}
