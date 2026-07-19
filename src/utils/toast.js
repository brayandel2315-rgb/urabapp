import { createElement } from 'react';
import { toast as sonnerToast } from 'sonner';
import { UrabappToast } from '@/design-system/patterns/UrabappToast';
import { resolveNotifImage, resolveNotifHref } from '@/communication/notification-visuals';

const DEFAULT_DURATION = 5_000;
const ERROR_DURATION = 7_000;
const TRUST_DURATION = 6_000;
const ORDER_DURATION = 7_500;

function splitLegacyMessage(message) {
  if (!message || typeof message !== 'string') {
    return { title: 'Urabapp', description: null };
  }
  const dash = message.split(' — ');
  if (dash.length >= 2) {
    return { title: dash[0].trim(), description: dash.slice(1).join(' — ').trim() };
  }
  const dot = message.match(/^(.{4,72}?)[.:]\s+(.+)$/);
  if (dot) {
    return { title: dot[1].trim(), description: dot[2].trim() };
  }
  return { title: message.trim(), description: null };
}

function showRich({
  title,
  description = null,
  type = 'info',
  trust = null,
  action = null,
  duration,
  id,
  image = null,
  href = null,
  kind = null,
  stage = null,
  category = null,
  eventKey = null,
  eventType = null,
  ...rest
}) {
  const imageUrl = image || resolveNotifImage(rest) || null;
  const link = href || resolveNotifHref(rest) || null;
  const ms = duration
    ?? (type === 'error'
      ? ERROR_DURATION
      : type === 'trust' || kind === 'order' || kind === 'tracking' || kind === 'cart'
        ? ORDER_DURATION
        : type === 'trust'
          ? TRUST_DURATION
          : DEFAULT_DURATION);

  return sonnerToast.custom(
    (toastId) => createElement(UrabappToast, {
      toastId,
      title,
      description,
      type,
      trust,
      action,
      image: imageUrl,
      href: link,
      kind,
      stage,
      category,
      eventKey,
      eventType,
    }),
    { duration: ms, id },
  );
}

function fromLegacy(message, type = 'info', options = {}) {
  const parsed = splitLegacyMessage(message);
  return showRich({
    title: options.title || parsed.title,
    description: options.description ?? parsed.description,
    type: options.type || type,
    trust: options.trust,
    action: options.action,
    duration: options.duration,
    id: options.id,
    image: options.image,
    href: options.href,
    kind: options.kind,
    stage: options.stage,
    category: options.category,
    eventKey: options.eventKey,
    eventType: options.eventType,
  });
}

export function toast(messageOrOptions, type = 'info', options = {}) {
  if (messageOrOptions && typeof messageOrOptions === 'object') {
    return showRich(messageOrOptions);
  }
  return fromLegacy(messageOrOptions, type, options);
}

toast.show = showRich;

toast.success = (message, options = {}) => fromLegacy(message, 'success', { ...options, kind: options.kind || 'success' });
toast.error = (message, options = {}) => fromLegacy(message, 'error', { ...options, kind: options.kind || 'error' });
toast.info = (message, options = {}) => fromLegacy(message, 'info', options);
toast.warning = (message, options = {}) => fromLegacy(message, 'warning', { ...options, kind: options.kind || 'warning' });
toast.trust = (message, options = {}) => fromLegacy(message, 'trust', { ...options, type: 'trust', kind: options.kind || 'order' });

toast.location = ({
  approximate = false,
  title,
  description,
  ...rest
} = {}) => showRich({
  title: title || (approximate ? 'Ubicación aproximada' : 'Ubicación confirmada'),
  description: description || (approximate
    ? 'Detectamos tu zona. Ajusta el pin en el mapa para que el repartidor llegue exacto.'
    : 'Señal GPS precisa. Tu pedido llegará al punto que marques en el mapa.'),
  type: approximate ? 'warning' : 'trust',
  trust: approximate ? 'GPS activo' : 'Ubicación verificada',
  kind: approximate ? 'warning' : 'info',
  ...rest,
});

toast.order = (message, options = {}) => fromLegacy(message, 'trust', {
  trust: options.trust || 'Pedido Urabapp',
  kind: options.kind || 'order',
  ...options,
});

toast.cart = (message, options = {}) => fromLegacy(message, 'info', {
  trust: options.trust || 'Carrito',
  kind: 'cart',
  ...options,
});

toast.tracking = (message, options = {}) => fromLegacy(message, 'trust', {
  trust: options.trust || 'Seguimiento',
  kind: 'tracking',
  ...options,
});

toast.dismiss = sonnerToast.dismiss;
toast.promise = sonnerToast.promise;

export { sonnerToast };
