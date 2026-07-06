/**
 * Terminología unificada Urabapp
 * ─────────────────────────────
 * En datos y backend: `businesses` (comercio registrado).
 * En la app para usuarios: siempre **tienda** — igual que Rappi/Uber/Didi.
 * No mezclar "comercio", "negocio" ni "tienda" en la misma pantalla.
 */

export const STORE = {
  /** Cliente */
  one: 'Tienda',
  many: 'Tiendas',
  oneLower: 'tienda',
  manyLower: 'tiendas',
  explore: 'Explorar tiendas',
  browse: 'Ver tiendas',
  browseNearby: 'Ver tiendas en mi zona',
  nearby: 'Tiendas cerca',
  nearbyOf: (municipio) => `Tiendas en ${municipio}`,
  readyCount: (n) => `${n} tienda${n === 1 ? '' : 's'} listas para pedir`,
  emptyHere: 'Aún no hay tiendas aquí',
  emptyIn: (place) => `Sin tiendas en ${place}`,
  verified: 'Tienda verificada',
  closed: 'Tienda cerrada',
  unavailable: 'Esta tienda no está disponible',
  notPublished: 'Esta tienda aún no está publicada',
  notFound: 'Tienda no encontrada',
  closedHours: 'La tienda está fuera de horario',
  noProducts: 'Esta tienda aún no tiene productos',
  waitingConfirm: 'Esperando que la tienda confirme tu pedido…',
  confirmedPreparing: 'Pedido confirmado. La tienda prepara tu orden; el mensajero sale cuando esté listo.',
  riderAssignedToStore: 'Mensajero asignado. Va a recoger tu pedido en la tienda.',
  preparingCancel: 'Si la tienda ya está preparando, puede que no sea posible cancelar.',
  promo: 'Promo de la tienda',
  partialFulfillment:
    'Si un producto está agotado, la tienda puede cancelar solo ese ítem y enviar el resto del pedido.',

  /** Dueño / panel */
  yours: 'Tu tienda',
  mine: 'Mi tienda',
  panel: 'Panel de tienda',
  open: 'Abrir tu tienda',
  register: 'Registrar tienda',
  registerCta: 'Empezar registro',
  ordersEmpty: 'Cuando un cliente compre en tu tienda, el pedido aparecerá aquí al instante.',

  /** Admin */
  adminTab: 'Tiendas',
  adminEmpty: 'Registra tiendas en onboarding o seed.',

  /** Barrio / catálogo */
  withStores: (n) => `${n} barrio${n === 1 ? '' : 's'} con tiendas`,
  noStoresByBarrio: 'Aún no hay tiendas registradas por barrio. Elige «Todo el municipio» para ver el catálogo.',
  allMunicipio: 'Todas las tiendas del municipio',
  barrioWithStores: 'Con tiendas',
};

/** Alias corto para imports */
export const MC = STORE;
