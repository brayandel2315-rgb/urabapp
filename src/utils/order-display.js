import { PAYMENT_METHOD_LABELS } from './constants';

export const ORDER_STATUS_VARIANT = {
  pending: 'warning',
  accepted: 'warning',
  preparing: 'warning',
  on_the_way: 'success',
  delivered: 'success',
  cancelled: 'muted',
};

export function formatOrderTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-CO', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function paymentMethodLabel(method) {
  return PAYMENT_METHOD_LABELS.find((p) => p.id === method)?.name || method || 'Efectivo';
}

export function parseCustomerPhoneFromNotes(notes) {
  if (!notes?.trim()) return null;
  const match = notes.match(/(?:\+57\s?)?3\d{9}/);
  return match ? match[0].replace(/\s/g, '') : null;
}

export function invalidateBusinessOrderQueries(queryClient, businessId) {
  if (!businessId) return;
  queryClient.invalidateQueries({ queryKey: ['business-orders', businessId] });
  queryClient.invalidateQueries({ queryKey: ['business-stats', businessId] });
  queryClient.invalidateQueries({ queryKey: ['business-finance', businessId] });
}
