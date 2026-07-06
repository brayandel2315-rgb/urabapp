/**
 * Event Bus centralizado — toda comunicación pasa por aquí.
 * Patrón pub/sub en cliente; el dispatch persiste en Supabase.
 */

const listeners = new Map();
let middlewares = [];

/** @typedef {Object} CommBusEvent
 * @property {string} key
 * @property {string} [recipientId]
 * @property {string} [actorId]
 * @property {object} [payload]
 * @property {object} [meta]
 */

export function registerCommMiddleware(fn) {
  middlewares.push(fn);
  return () => {
    middlewares = middlewares.filter((m) => m !== fn);
  };
}

export function onCommEvent(eventKey, handler) {
  const set = listeners.get(eventKey) || new Set();
  set.add(handler);
  listeners.set(eventKey, set);
  return () => set.delete(handler);
}

export function onAnyCommEvent(handler) {
  return onCommEvent('*', handler);
}

function notifyListeners(event) {
  const specific = listeners.get(event.key);
  const wild = listeners.get('*');
  [...(specific || []), ...(wild || [])].forEach((fn) => {
    try {
      fn(event);
    } catch (err) {
      console.warn('[comm-bus]', event.key, err);
    }
  });
}

/**
 * Emite evento al bus (síncrono) y devuelve promesa del dispatch completo.
 * @param {string} eventKey
 * @param {object} options
 */
export async function emitCommEvent(eventKey, options = {}) {
  const event = {
    key: eventKey,
    recipientId: options.recipientId ?? null,
    actorId: options.actorId ?? null,
    payload: options.payload ?? {},
    meta: { timestamp: new Date().toISOString(), ...options.meta },
  };

  for (const mw of middlewares) {
    await mw(event);
  }

  notifyListeners(event);

  const { dispatchCommunication } = await import('./dispatch.service');
  return dispatchCommunication(event);
}

export function getCommBusStats() {
  return {
    eventTypes: listeners.size,
    middlewareCount: middlewares.length,
  };
}
