import { invokeEdgeFunction } from './edge.service';
import { ORDER_STATUS_LABELS } from '../utils/constants';

export function isWhatsAppApiEnabled() {
  return import.meta.env.VITE_WHATSAPP_API_ENABLED === 'true';
}

const STATUS_TEMPLATES = {
  pending: 'order_confirmed',
  accepted: 'order_confirmed',
  preparing: 'order_preparing',
  on_the_way: 'order_on_the_way',
  delivered: 'order_delivered',
  cancelled: 'order_cancelled',
};

function buildOrderLink(orderId) {
  const base = import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base.replace(/\/$/, '')}/pedidos/${orderId}`;
}

/** Confirmaciones automáticas vía WhatsApp Business Cloud API (Edge Function send-whatsapp) */
export async function sendOrderWhatsAppUpdate({ phone, orderNumber, status, orderId }) {
  if (!isWhatsAppApiEnabled() || !phone) return { sent: false, reason: 'disabled' };

  const label = ORDER_STATUS_LABELS[status] || status;
  const orderUrl = buildOrderLink(orderId);

  return invokeEdgeFunction('send-whatsapp', {
    to: phone,
    template: STATUS_TEMPLATES[status] || 'order_update',
    variables: {
      order_number: orderNumber || orderId?.slice(0, 8),
      status: label,
      order_url: orderUrl,
    },
    text: `Urabapp: tu pedido ${orderNumber || ''} — ${label}. Seguimiento: ${orderUrl}`,
  }).catch(() => ({ sent: false }));
}

export async function sendOperatorWhatsAppAlert({ phone, message }) {
  if (!isWhatsAppApiEnabled() || !phone) return { sent: false };
  return invokeEdgeFunction('send-whatsapp', { to: phone, text: message }).catch(() => ({ sent: false }));
}

export async function sendCartRecoveryWhatsApp({ phone, businessName, subtotal }) {
  if (!isWhatsAppApiEnabled() || !phone) return { sent: false, reason: 'disabled' };
  const amount = typeof subtotal === 'number'
    ? subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
    : subtotal;
  return invokeEdgeFunction('send-whatsapp', {
    to: phone,
    text: `Hola, vimos que dejaste productos en ${businessName || 'tu carrito'} (${amount}). ¿Terminas tu pedido en Urabapp? ${import.meta.env.VITE_APP_URL || ''}/carrito`,
  }).catch(() => ({ sent: false }));
}
