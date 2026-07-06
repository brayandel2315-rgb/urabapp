import { ORDER_STATUS_LABELS } from './constants';

function isCourierOrder(order) {
  return order?.order_type === 'courier';
}

/** Pedidos de tienda: ofertas a mensajeros solo en preparación */
export function canDispatchRiders(order) {
  if (!order) return false;
  if (isCourierOrder(order)) {
    return ['pending', 'accepted'].includes(order.status) && !order.driver_id;
  }
  if (order.business_id) {
    return order.status === 'preparing' && !order.driver_id;
  }
  return ['pending', 'accepted', 'preparing'].includes(order.status) && !order.driver_id;
}

export function getStoreOrderPhase(order) {
  if (!order?.business_id || isCourierOrder(order)) return null;
  if (order.status === 'pending') return 'awaiting_store_accept';
  if (order.status === 'accepted') return 'awaiting_store_prep';
  if (order.status === 'preparing' && !order.driver_id) return 'seeking_rider';
  if (order.status === 'preparing' && order.driver_id) return 'rider_to_store';
  if (order.status === 'on_the_way') return 'delivering';
  if (order.status === 'delivered') return 'done';
  return order.status;
}

export function getClientFulfillmentMessage(order) {
  const phase = getStoreOrderPhase(order);
  if (!phase) return null;
  switch (phase) {
    case 'awaiting_store_accept':
      return 'La tienda está revisando tu pedido…';
    case 'awaiting_store_prep':
      return 'Pedido confirmado. La tienda prepara tu orden antes de enviar el mensajero.';
    case 'seeking_rider':
      return 'Tu pedido está en preparación. Buscando mensajero disponible…';
    case 'rider_to_store':
      return 'Mensajero asignado. Va a recoger tu pedido en la tienda.';
    case 'delivering':
      return 'Tu pedido va en camino.';
    default:
      return ORDER_STATUS_LABELS[order.status] || null;
  }
}

export function getRiderStoreAction(order) {
  if (!order?.driver_id || isCourierOrder(order)) return null;
  if (order.status === 'preparing') {
    return {
      key: 'pickup',
      label: 'Confirmar recogida en tienda',
      nextStatus: 'on_the_way',
      hint: 'Marca cuando tengas el pedido en mano',
    };
  }
  if (order.status === 'on_the_way') {
    return {
      key: 'deliver',
      label: 'Confirmar entrega',
      nextStatus: 'delivered',
      hint: 'Entrega al cliente con el código si aplica',
    };
  }
  return null;
}
