/**
 * Biblioteca de eventos del sistema — cada acción debe mapear a una entrada aquí.
 */
import { COMM_CATEGORIES } from './categories';
import { COMM_PRIORITIES, COMM_CHANNELS } from './priorities';

const DEFAULT_CHANNELS = [COMM_CHANNELS.IN_APP, COMM_CHANNELS.PUSH, COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT];
const ORDER_CHANNELS = [...DEFAULT_CHANNELS, COMM_CHANNELS.WHATSAPP];

/** @type {Record<string, object>} */
export const EVENT_LIBRARY = {
  auth_sign_in: {
    key: 'auth_sign_in',
    category: COMM_CATEGORIES.SECURITY,
    priority: COMM_PRIORITIES.LOW,
    icon: 'profile',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
    deepLink: () => '/cuenta/perfil',
  },
  auth_sign_out: {
    key: 'auth_sign_out',
    category: COMM_CATEGORIES.SECURITY,
    priority: COMM_PRIORITIES.SILENT,
    icon: 'profile',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
  },
  auth_password_reset: {
    key: 'auth_password_reset',
    category: COMM_CATEGORIES.SECURITY,
    priority: COMM_PRIORITIES.HIGH,
    icon: 'shield',
    channels: [COMM_CHANNELS.IN_APP, COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
    deepLink: () => '/cuenta/seguridad',
    message: () => ({ title: 'Contraseña actualizada', body: 'Tu contraseña fue cambiada correctamente.' }),
  },
  auth_otp_sent: {
    key: 'auth_otp_sent',
    category: COMM_CATEGORIES.SECURITY,
    priority: COMM_PRIORITIES.SILENT,
    icon: 'shield',
    channels: [COMM_CHANNELS.SMS, COMM_CHANNELS.AUDIT, COMM_CHANNELS.ANALYTICS],
  },
  account_profile_updated: {
    key: 'account_profile_updated',
    category: COMM_CATEGORIES.ACCOUNT,
    priority: COMM_PRIORITIES.LOW,
    icon: 'profile',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
    deepLink: () => '/cuenta/perfil',
  },
  account_address_added: {
    key: 'account_address_added',
    category: COMM_CATEGORIES.ACCOUNT,
    priority: COMM_PRIORITIES.LOW,
    icon: 'location',
    channels: DEFAULT_CHANNELS,
    deepLink: () => '/cuenta/direcciones',
    message: () => ({ title: 'Dirección guardada', body: 'Tu nueva dirección está lista para pedidos.' }),
  },
  order_created: {
    key: 'order_created',
    category: COMM_CATEGORIES.ORDERS,
    priority: COMM_PRIORITIES.HIGH,
    icon: 'cart',
    channels: ORDER_CHANNELS,
    deepLink: (p) => (p.orderId ? `/pedidos/${p.orderId}` : '/pedidos'),
    message: (p) => ({
      title: `Pedido ${p.orderNumber || 'confirmado'}`,
      body: p.body || 'Tu pedido fue recibido. La tienda lo confirmará pronto.',
    }),
  },
  order_status_changed: {
    key: 'order_status_changed',
    category: COMM_CATEGORIES.ORDERS,
    priority: COMM_PRIORITIES.HIGH,
    icon: 'cart',
    channels: ORDER_CHANNELS,
    deepLink: (p) => (p.orderId ? `/pedidos/${p.orderId}` : '/pedidos'),
    message: (p) => ({
      title: `Pedido ${p.orderNumber || ''}`.trim(),
      body: p.body || `Estado: ${p.statusLabel || p.status || 'actualizado'}`,
    }),
  },
  order_cancelled: {
    key: 'order_cancelled',
    category: COMM_CATEGORIES.ORDERS,
    priority: COMM_PRIORITIES.HIGH,
    icon: 'cart',
    channels: ORDER_CHANNELS,
    deepLink: (p) => (p.orderId ? `/pedidos/${p.orderId}` : '/pedidos'),
    message: (p) => ({
      title: 'Pedido cancelado',
      body: p.body || `Tu pedido ${p.orderNumber || ''} fue cancelado.`.trim(),
    }),
  },
  order_chat_message: {
    key: 'order_chat_message',
    category: COMM_CATEGORIES.MESSAGES,
    priority: COMM_PRIORITIES.MEDIUM,
    icon: 'chat',
    channels: DEFAULT_CHANNELS,
    deepLink: (p) => (p.orderId ? `/pedidos/${p.orderId}` : '/pedidos'),
    message: (p) => ({
      title: p.title || 'Nuevo mensaje en tu pedido',
      body: p.body || 'Tienes un mensaje nuevo.',
    }),
  },
  business_new_order: {
    key: 'business_new_order',
    category: COMM_CATEGORIES.BUSINESS,
    priority: COMM_PRIORITIES.CRITICAL,
    icon: 'store',
    channels: DEFAULT_CHANNELS,
    deepLink: () => '/comercio',
    message: (p) => ({
      title: `Nuevo pedido ${p.orderNumber || ''}`.trim(),
      body: `${p.businessName || 'Tu comercio'} — confirma y prepara.`,
    }),
  },
  rider_new_offer: {
    key: 'rider_new_offer',
    category: COMM_CATEGORIES.ORDERS,
    priority: COMM_PRIORITIES.CRITICAL,
    icon: 'mensajeria',
    channels: DEFAULT_CHANNELS,
    deepLink: () => '/domiciliario',
    message: (p) => ({
      title: 'Nueva entrega disponible',
      body: `Pedido ${p.orderNumber || ''} — acepta antes de que expire.`.trim(),
    }),
  },
  shipment_status_changed: {
    key: 'shipment_status_changed',
    category: COMM_CATEGORIES.ORDERS,
    priority: COMM_PRIORITIES.HIGH,
    icon: 'envios',
    channels: DEFAULT_CHANNELS,
    deepLink: (p) => (p.shipmentId ? `/envios/${p.shipmentId}` : '/envios'),
    message: (p) => ({
      title: p.title || `Envío ${p.shipmentNumber || ''}`.trim(),
      body: p.body || `Estado: ${p.status || 'actualizado'}`,
    }),
  },
  payment_approved: {
    key: 'payment_approved',
    category: COMM_CATEGORIES.PAYMENTS,
    priority: COMM_PRIORITIES.HIGH,
    icon: 'money',
    channels: DEFAULT_CHANNELS,
    deepLink: (p) => (p.orderId ? `/pedidos/${p.orderId}` : '/cuenta/pagos'),
    message: () => ({ title: 'Pago confirmado', body: 'Tu pago fue procesado correctamente.' }),
  },
  payment_failed: {
    key: 'payment_failed',
    category: COMM_CATEGORIES.PAYMENTS,
    priority: COMM_PRIORITIES.CRITICAL,
    icon: 'money',
    channels: DEFAULT_CHANNELS,
    deepLink: (p) => (p.orderId ? `/pedidos/${p.orderId}` : '/checkout'),
    message: () => ({ title: 'Pago no procesado', body: 'Intenta de nuevo o elige otro método.' }),
  },
  checkout_started: {
    key: 'checkout_started',
    category: COMM_CATEGORIES.MARKETPLACE,
    priority: COMM_PRIORITIES.SILENT,
    icon: 'cart',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
    deepLink: () => '/checkout',
  },
  checkout_confirmed: {
    key: 'checkout_confirmed',
    category: COMM_CATEGORIES.ORDERS,
    priority: COMM_PRIORITIES.SILENT,
    icon: 'cart',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
    deepLink: (p) => (p.orderId ? `/pedidos/${p.orderId}` : '/pedidos'),
  },
  support_ticket_created: {
    key: 'support_ticket_created',
    category: COMM_CATEGORIES.SUPPORT,
    priority: COMM_PRIORITIES.MEDIUM,
    icon: 'headset',
    channels: DEFAULT_CHANNELS,
    deepLink: () => '/soporte',
    message: (p) => ({
      title: 'Consulta enviada',
      body: p.subject || 'Te responderemos en la app.',
    }),
  },
  support_ticket_reply: {
    key: 'support_ticket_reply',
    category: COMM_CATEGORIES.SUPPORT,
    priority: COMM_PRIORITIES.HIGH,
    icon: 'headset',
    channels: DEFAULT_CHANNELS,
    deepLink: () => '/soporte',
    message: (p) => ({
      title: p.title || 'Respuesta de soporte',
      body: p.body || 'Tienes una nueva respuesta.',
    }),
  },
  promo_applied: {
    key: 'promo_applied',
    category: COMM_CATEGORIES.PROMOTIONS,
    priority: COMM_PRIORITIES.MEDIUM,
    icon: 'promo',
    channels: DEFAULT_CHANNELS,
    deepLink: () => '/carrito',
    message: (p) => ({
      title: 'Cupón aplicado',
      body: p.body || 'Descuento activo en tu pedido.',
    }),
  },
  cart_recovery: {
    key: 'cart_recovery',
    category: COMM_CATEGORIES.MARKETING,
    priority: COMM_PRIORITIES.LOW,
    icon: 'cart',
    channels: [COMM_CHANNELS.IN_APP, COMM_CHANNELS.PUSH, COMM_CHANNELS.ANALYTICS],
    deepLink: () => '/carrito',
    message: (p) => ({
      title: 'Tu carrito te espera',
      body: p.body || 'Completa tu pedido antes de que expire.',
    }),
  },
  business_registered: {
    key: 'business_registered',
    category: COMM_CATEGORIES.BUSINESS,
    priority: COMM_PRIORITIES.MEDIUM,
    icon: 'store',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT, COMM_CHANNELS.IN_APP],
    deepLink: () => '/negocio/onboarding',
    message: () => ({ title: 'Tienda registrada', body: 'Completa tu perfil para publicar.' }),
  },
  rider_registered: {
    key: 'rider_registered',
    category: COMM_CATEGORIES.BUSINESS,
    priority: COMM_PRIORITIES.MEDIUM,
    icon: 'mensajeria',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
    deepLink: () => '/domiciliario',
  },
  membership_activated: {
    key: 'membership_activated',
    category: COMM_CATEGORIES.ACCOUNT,
    priority: COMM_PRIORITIES.HIGH,
    icon: 'star',
    channels: DEFAULT_CHANNELS,
    deepLink: () => '/cuenta/membresia',
    message: () => ({
      title: 'UrabApp Pro activado',
      body: 'Tu membresía Pro está activa. Disfruta envíos reducidos y beneficios exclusivos.',
    }),
  },
  membership_cancelled: {
    key: 'membership_cancelled',
    category: COMM_CATEGORIES.ACCOUNT,
    priority: COMM_PRIORITIES.MEDIUM,
    icon: 'star',
    channels: [COMM_CHANNELS.IN_APP, COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
    deepLink: () => '/cuenta/membresia',
    message: () => ({
      title: 'Membresía cancelada',
      body: 'Tu plan Pro finalizará al terminar el período actual.',
    }),
  },
  account_favorite_added: {
    key: 'account_favorite_added',
    category: COMM_CATEGORIES.ACCOUNT,
    priority: COMM_PRIORITIES.SILENT,
    icon: 'star',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
    deepLink: (p) => (p.businessId ? `/tienda/${p.businessId}` : '/cuenta/favoritos'),
  },
  admin_action: {
    key: 'admin_action',
    category: COMM_CATEGORIES.ADMIN,
    priority: COMM_PRIORITIES.SILENT,
    icon: 'admin',
    channels: [COMM_CHANNELS.AUDIT, COMM_CHANNELS.ANALYTICS],
  },
  legal_consent_recorded: {
    key: 'legal_consent_recorded',
    category: COMM_CATEGORIES.SECURITY,
    priority: COMM_PRIORITIES.SILENT,
    icon: 'shield',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
    deepLink: () => '/cuenta/seguridad',
  },
  discovery_search: {
    key: 'discovery_search',
    category: COMM_CATEGORIES.MARKETPLACE,
    priority: COMM_PRIORITIES.SILENT,
    icon: 'search',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
    deepLink: () => '/search',
  },
  home_feedback: {
    key: 'home_feedback',
    category: COMM_CATEGORIES.MARKETPLACE,
    priority: COMM_PRIORITIES.SILENT,
    icon: 'star',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
    deepLink: () => '/',
  },
  marketplace_analytics: {
    key: 'marketplace_analytics',
    category: COMM_CATEGORIES.MARKETPLACE,
    priority: COMM_PRIORITIES.SILENT,
    icon: 'search',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
  },
  review_submitted: {
    key: 'review_submitted',
    category: COMM_CATEGORIES.ORDERS,
    priority: COMM_PRIORITIES.SILENT,
    icon: 'star',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT, COMM_CHANNELS.SNACKBAR],
    deepLink: (p) => (p.orderId ? `/pedidos/${p.orderId}` : '/pedidos'),
    message: () => ({ title: 'Gracias por tu reseña', body: 'Tu opinión ayuda a mejorar Urabá.' }),
  },
  referral_captured: {
    key: 'referral_captured',
    category: COMM_CATEGORIES.MARKETING,
    priority: COMM_PRIORITIES.SILENT,
    icon: 'megaphone',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
  },
  business_campaign_sent: {
    key: 'business_campaign_sent',
    category: COMM_CATEGORIES.MARKETING,
    priority: COMM_PRIORITIES.MEDIUM,
    icon: 'megaphone',
    channels: [COMM_CHANNELS.IN_APP, COMM_CHANNELS.PUSH, COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT, COMM_CHANNELS.WEBHOOK],
    deepLink: (p) => (p.storePath || '/'),
    message: (p) => ({
      title: p.title || 'Mensaje de tu tienda favorita',
      body: p.body || p.message || 'Tienes una novedad de un comercio en Urabá.',
    }),
  },
  daily_digest_sent: {
    key: 'daily_digest_sent',
    category: COMM_CATEGORIES.REMINDERS,
    priority: COMM_PRIORITIES.LOW,
    icon: 'mail',
    channels: [COMM_CHANNELS.IN_APP, COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
    deepLink: () => '/cuenta/notificaciones',
    message: (p) => ({
      title: 'Resumen diario enviado',
      body: p.body || `Te enviamos un resumen con ${p.digest_count || ''} notificaciones pendientes.`,
    }),
  },
  system_announcement: {
    key: 'system_announcement',
    category: COMM_CATEGORIES.SYSTEM,
    priority: COMM_PRIORITIES.MEDIUM,
    icon: 'bell',
    channels: [COMM_CHANNELS.IN_APP, COMM_CHANNELS.PUSH, COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
    deepLink: () => '/cuenta/notificaciones',
    message: (p) => ({
      title: p.title || 'Aviso de Urabapp',
      body: p.body || 'Tienes un nuevo aviso del sistema.',
    }),
  },
  scheduled_communication_sent: {
    key: 'scheduled_communication_sent',
    category: COMM_CATEGORIES.SYSTEM,
    priority: COMM_PRIORITIES.MEDIUM,
    icon: 'scheduled',
    channels: [COMM_CHANNELS.IN_APP, COMM_CHANNELS.PUSH, COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
    deepLink: () => '/cuenta/notificaciones',
    message: (p) => ({
      title: p.title || 'Mensaje programado',
      body: p.body || 'Recibiste un mensaje programado.',
    }),
  },
  communication_opened: {
    key: 'communication_opened',
    category: COMM_CATEGORIES.SYSTEM,
    priority: COMM_PRIORITIES.SILENT,
    icon: 'bell',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
  },
  communication_clicked: {
    key: 'communication_clicked',
    category: COMM_CATEGORIES.SYSTEM,
    priority: COMM_PRIORITIES.SILENT,
    icon: 'bell',
    channels: [COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
  },
  app_update_available: {
    key: 'app_update_available',
    category: COMM_CATEGORIES.UPDATES,
    priority: COMM_PRIORITIES.MEDIUM,
    icon: 'refresh',
    channels: [COMM_CHANNELS.IN_APP, COMM_CHANNELS.BANNER, COMM_CHANNELS.ANALYTICS],
    deepLink: () => '/',
    message: () => ({ title: 'Nueva versión', body: 'Actualiza Urabapp para la mejor experiencia.' }),
  },
  system_error: {
    key: 'system_error',
    category: COMM_CATEGORIES.ERRORS,
    priority: COMM_PRIORITIES.HIGH,
    icon: 'alert',
    channels: [COMM_CHANNELS.LOG, COMM_CHANNELS.ANALYTICS, COMM_CHANNELS.AUDIT],
  },
};

export function getEventDef(eventKey) {
  return EVENT_LIBRARY[eventKey] || null;
}

export function listEventKeys() {
  return Object.keys(EVENT_LIBRARY);
}

export function resolveEventMessage(eventKey, payload = {}) {
  const def = getEventDef(eventKey);
  if (!def?.message) return { title: payload.title, body: payload.body };
  return def.message(payload);
}

export function resolveDeepLink(eventKey, payload = {}) {
  const def = getEventDef(eventKey);
  if (payload.deepLink) return payload.deepLink;
  if (payload.url) return payload.url;
  if (!def?.deepLink) return payload.orderId ? `/pedidos/${payload.orderId}` : '/cuenta/notificaciones';
  return def.deepLink(payload);
}
