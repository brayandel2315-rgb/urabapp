import { createElement } from 'react';
import { toast as sonnerToast } from 'sonner';
import { UrabappToast } from '@/design-system/patterns/UrabappToast';

const DEFAULT_DURATION = 4_500;
const ERROR_DURATION = 6_500;
const TRUST_DURATION = 5_500;

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
}) {
  const ms = duration ?? (type === 'error' ? ERROR_DURATION : type === 'trust' ? TRUST_DURATION : DEFAULT_DURATION);

  return sonnerToast.custom(
    (toastId) => createElement(UrabappToast, {
      toastId,
      title,
      description,
      type,
      trust,
      action,
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
  });
}

export function toast(messageOrOptions, type = 'info', options = {}) {
  if (messageOrOptions && typeof messageOrOptions === 'object') {
    return showRich(messageOrOptions);
  }
  return fromLegacy(messageOrOptions, type, options);
}

toast.show = showRich;

toast.success = (message, options = {}) => fromLegacy(message, 'success', options);
toast.error = (message, options = {}) => fromLegacy(message, 'error', options);
toast.info = (message, options = {}) => fromLegacy(message, 'info', options);
toast.warning = (message, options = {}) => fromLegacy(message, 'warning', options);
toast.trust = (message, options = {}) => fromLegacy(message, 'trust', { ...options, type: 'trust' });

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
  ...rest,
});

toast.order = (message, options = {}) => fromLegacy(message, 'trust', {
  trust: 'Pedido seguro',
  ...options,
});

toast.dismiss = sonnerToast.dismiss;
toast.promise = sonnerToast.promise;

export { sonnerToast };
