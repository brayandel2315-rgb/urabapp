export const TERMINAL_ORDER_STATUSES = ['delivered', 'cancelled'];

export function isActiveOrder(order) {
  return order && !TERMINAL_ORDER_STATUSES.includes(order.status);
}

export function isHistoryOrder(order) {
  return order && TERMINAL_ORDER_STATUSES.includes(order.status);
}

export function isPendingOrder(order) {
  return order?.status === 'pending';
}

export function countPendingOrders(orders = []) {
  return orders.filter(isPendingOrder).length;
}

const PAYMENT_STATUS_LABELS = {
  paid: 'Pagado',
  pending: 'Pendiente',
  failed: 'Fallido',
  refunded: 'Reembolsado',
};

export function formatPaymentStatus(status) {
  if (!status) return 'Pendiente';
  return PAYMENT_STATUS_LABELS[status] || status;
}

import { parseCustomerPhoneFromNotes } from './order-display';

export { parseCustomerPhoneFromNotes };

/** @deprecated Usa parseCustomerPhoneFromNotes */
export function parseCustomerContactFromNotes(notes) {
  return parseCustomerPhoneFromNotes(notes);
}
