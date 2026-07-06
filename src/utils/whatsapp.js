import { BRAND } from './constants';
import { buildBusinessUrl, buildOrderUrl } from './app';
import { setReferralSource } from './referral';

const DEFAULT_NUMBER = '573001234567';

function getWhatsAppNumber() {
  return import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_NUMBER;
}

export function buildWhatsAppUrl(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${getWhatsAppNumber()}?text=${encoded}`;
}

export function openWhatsApp(message, { source } = {}) {
  if (source) setReferralSource(source);
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}

export function buildOrderWhatsAppMessage(order) {
  const items = (order.items || order.order_items || [])
    .map((item) => `• ${item.name} x${item.quantity}`)
    .join('\n');

  const link = buildOrderUrl(order.id);

  return [
    `Hola, soy cliente de ${BRAND.name}.`,
    `Pedido: ${order.order_number || order.id}`,
    `Estado: ${order.status}`,
    items ? `\n${items}` : '',
    `Total: $${Number(order.total || 0).toLocaleString('es-CO')}`,
    `Dirección: ${order.dest_address}`,
    `\nSeguimiento: ${link}`,
  ].filter(Boolean).join('\n');
}

export function buildSupportMessage() {
  return `Hola ${BRAND.name}, quiero hacer un pedido en Urabá.`;
}

export function buildInstagramWhatsAppMessage() {
  return [
    `Hola! Vi ${BRAND.name} en Instagram 👋`,
    `Quiero pedir en Urabá — ¿me compartes el menú o link?`,
  ].join('\n');
}

export function buildExpressShareMessage(business) {
  const link = buildBusinessUrl(business);
  return [
    `🚀 *${business.name}* ya está en ${BRAND.name}!`,
    `Pide aquí: ${link}`,
    `Domicilio local en Urabá.`,
  ].join('\n');
}

export function buildRiderRecruitMessage() {
  return [
    `Hola ${BRAND.name}!`,
    `Quiero unirme como mensajero en Urabá.`,
    `Ganancia fija + bonos por ranking semanal.`,
  ].join('\n');
}

export function buildBusinessWhatsAppMessage(business) {
  const link = buildBusinessUrl(business);
  return [
    `Hola! Quiero pedir de *${business.name}* en ${BRAND.name}.`,
    `Menú: ${link}`,
  ].join('\n');
}

export function buildOperatorNewOrderMessage(order, businessName) {
  const link = buildOrderUrl(order.id);
  return [
    `🆕 Nuevo pedido ${BRAND.name}`,
    `Tienda: ${businessName || '—'}`,
    `Pedido: ${order.order_number || order.id}`,
    `Total: $${Number(order.total || 0).toLocaleString('es-CO')}`,
    `Dirección: ${order.dest_address}`,
    `Pago: ${order.payment_method || 'cash'}`,
    `\nGestionar: ${link}`,
  ].join('\n');
}
