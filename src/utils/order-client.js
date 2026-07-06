/** Estados en los que el cliente aún puede cancelar (antes de que salga el mensajero). */
export const CUSTOMER_CANCELLABLE_STATUSES = ['pending', 'accepted', 'preparing'];

export const FULFILLMENT_STATUS_LABELS = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  unavailable: 'Agotado',
  substituted: 'Sustituido',
  cancelled: 'Cancelado',
};

/** Estados en los que el comercio puede cancelar el pedido. */
export const BUSINESS_CANCELLABLE_STATUSES = ['pending', 'accepted', 'preparing'];

export function canBusinessCancelOrder(order) {
  if (!order) return false;
  return BUSINESS_CANCELLABLE_STATUSES.includes(order.status);
}

export function canCustomerCancelOrder(order, customerId) {
  if (!order || !customerId || order.customer_id !== customerId) return false;
  return CUSTOMER_CANCELLABLE_STATUSES.includes(order.status);
}

export function orderItemsToCartLines(orderItems = []) {
  return orderItems.map((item) => ({
    lineId: crypto.randomUUID(),
    productId: item.product_id,
    name: item.name,
    emoji: item.emoji,
    basePrice: Number(item.unit_price) || 0,
    compareAtPrice: null,
    price: Number(item.unit_price) || 0,
    quantity: item.quantity || 1,
    modifiers: Array.isArray(item.modifiers_json) ? item.modifiers_json : [],
    modifierSummary: item.notes || '',
  }));
}

export function buildOrderNotes({ reference, cashChange, barrio }) {
  const parts = [];
  if (reference?.trim()) parts.push(reference.trim());
  if (cashChange?.trim()) parts.push(`Cambio: ${cashChange.trim()}`);
  if (barrio) parts.push(`[Barrio: ${barrio}]`);
  return parts.join(' | ') || null;
}
