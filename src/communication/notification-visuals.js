/**
 * Visuales compartidos para toasts, banner, inbox y push.
 * Fase nativa (Live Activity / notch): reutilizar imageUrl, stage, kind, deepLink.
 */
import { COMM_CATEGORY_ICONS, COMM_CATEGORY_LABELS } from './categories';
import { getEventMeta } from '@/data/order-tracking-catalog';

export const NOTIF_KIND = {
  ORDER: 'order',
  CART: 'cart',
  SHIPMENT: 'shipment',
  TRACKING: 'tracking',
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
};

const KIND_CHIP = {
  order: 'Pedido',
  cart: 'Carrito',
  shipment: 'Envío',
  tracking: 'Seguimiento',
  info: 'Aviso',
  success: 'Listo',
  error: 'Alerta',
  warning: 'Importante',
};

const KIND_ACCENT = {
  order: 'urabapp-notif--order',
  cart: 'urabapp-notif--cart',
  shipment: 'urabapp-notif--shipment',
  tracking: 'urabapp-notif--tracking',
  info: 'urabapp-notif--info',
  success: 'urabapp-notif--success',
  error: 'urabapp-notif--error',
  warning: 'urabapp-notif--warning',
};

const KIND_ICON = {
  order: 'cart',
  cart: 'cart',
  shipment: 'envios',
  tracking: 'mensajeria',
  info: 'bell',
  success: 'check',
  error: 'alert',
  warning: 'map',
};

export function resolveNotifKind({ type, category, eventKey, kind, stage } = {}) {
  if (kind && KIND_CHIP[kind]) return kind;
  const key = String(eventKey || '');
  if (key.includes('cart')) return NOTIF_KIND.CART;
  if (key.includes('tracking') || stage) return NOTIF_KIND.TRACKING;
  if (key.includes('shipment') || category === 'shipment' || type === 'shipment') return NOTIF_KIND.SHIPMENT;
  if (
    key.includes('order')
    || category === 'orders'
    || type === 'order'
    || type === 'order_tracking'
  ) {
    return NOTIF_KIND.ORDER;
  }
  if (type === 'error' || category === 'errors') return NOTIF_KIND.ERROR;
  if (type === 'warning') return NOTIF_KIND.WARNING;
  if (type === 'success') return NOTIF_KIND.SUCCESS;
  return NOTIF_KIND.INFO;
}

export function notifChipLabel(kind, { category, stage, eventType } = {}) {
  if (stage || eventType) {
    const meta = getEventMeta(stage || eventType);
    if (meta?.label) return meta.label;
  }
  if (KIND_CHIP[kind]) return KIND_CHIP[kind];
  return COMM_CATEGORY_LABELS[category] || 'Urabapp';
}

export function notifAccentClass(kind) {
  return KIND_ACCENT[kind] || KIND_ACCENT.info;
}

export function notifFallbackIcon(kind, category) {
  return KIND_ICON[kind] || COMM_CATEGORY_ICONS[category] || 'bell';
}

/** Extrae URL de imagen desde payload / fila de notificación / items de carrito. */
export function resolveNotifImage(source = {}) {
  if (!source || typeof source !== 'object') return null;
  const direct =
    source.imageUrl
    || source.image_url
    || source.image
    || source.thumbnail
    || source.logoUrl
    || source.logo_url
    || source.businessLogo
    || source.business_logo
    || source.cover_url
    || source.coverUrl;
  if (typeof direct === 'string' && direct.startsWith('http')) return direct;
  if (typeof direct === 'string' && direct.startsWith('/')) return direct;

  const data = source.data && typeof source.data === 'object' ? source.data : source;
  const nested =
    data.imageUrl
    || data.image_url
    || data.image
    || data.thumbnail
    || data.logoUrl
    || data.logo_url
    || data.businessLogo
    || data.business_logo
    || data.cover_url
    || data.coverUrl;
  if (typeof nested === 'string' && (nested.startsWith('http') || nested.startsWith('/'))) {
    return nested;
  }

  const items = data.items || data.items_json || source.items_json || source.items;
  if (Array.isArray(items)) {
    for (const item of items) {
      const img = item?.image_url || item?.imageUrl || item?.image || item?.photo_url;
      if (typeof img === 'string' && (img.startsWith('http') || img.startsWith('/'))) return img;
    }
  }

  return null;
}

export function resolveNotifHref(source = {}) {
  const raw =
    source.href
    || source.deepLink
    || source.deep_link
    || source.url
    || source.data?.url
    || source.data?.deep_link
    || source.data?.deepLink;
  if (!raw || typeof raw !== 'string') return null;
  if (raw.startsWith('http')) {
    try {
      return new URL(raw).pathname + new URL(raw).search;
    } catch {
      return null;
    }
  }
  return raw.startsWith('/') ? raw : `/${raw}`;
}

/** Asset público de fallback por kind (siempre disponible en PWA). */
export function notifDefaultAsset(kind) {
  if (kind === NOTIF_KIND.CART) return '/app-icon.png';
  if (kind === NOTIF_KIND.TRACKING || kind === NOTIF_KIND.ORDER) return '/app-icon.png';
  if (kind === NOTIF_KIND.SHIPMENT) return '/app-icon.png';
  return '/app-icon.png';
}
