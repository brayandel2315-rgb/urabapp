/** Estados y opciones del módulo de mensajería UrabApp */

export const COURIER_PACKAGE_TYPES = [
  { id: 'document', label: 'Documento', icon: 'document' },
  { id: 'package', label: 'Paquete', icon: 'package' },
  { id: 'grocery', label: 'Mercado', icon: 'grocery' },
  { id: 'quick_buy', label: 'Compra rápida', icon: 'cart' },
  { id: 'other', label: 'Otro', icon: 'box' },
];

export const COURIER_WEIGHT_TIERS = [
  { id: '0-2', label: '0–2 kg', maxKg: 2 },
  { id: '2-5', label: '2–5 kg', maxKg: 5 },
  { id: '5-10', label: '5–10 kg', maxKg: 10 },
];

export const COURIER_PRIORITIES = [
  { id: 'normal', label: 'Normal', description: 'Entrega estándar' },
  { id: 'express', label: 'Express', description: 'Prioridad y llegada más rápida' },
];

/** Fases internas courier (courier_phase) */
export const COURIER_PHASE = {
  SEARCHING: 'searching',
  ASSIGNED: 'assigned',
  ARRIVING_PICKUP: 'arriving_pickup',
  PICKED_UP: 'picked_up',
  EN_ROUTE: 'en_route',
  DELIVERED: 'delivered',
};

export const COURIER_PHASE_LABELS = {
  searching: 'Buscando mensajero',
  assigned: 'Mensajero asignado',
  arriving_pickup: 'Llegando a recoger',
  picked_up: 'Paquete recogido',
  en_route: 'En camino a entrega',
  delivered: 'Entregado',
};

export const COURIER_TRACKING_STEPS = [
  { key: 'searching', label: 'Buscando', icon: 'search' },
  { key: 'assigned', label: 'Aceptado', icon: 'check' },
  { key: 'arriving_pickup', label: 'Llegando', icon: 'location' },
  { key: 'picked_up', label: 'Recogido', icon: 'package' },
  { key: 'en_route', label: 'En camino', icon: 'mensajeria' },
  { key: 'delivered', label: 'Entregado', icon: 'star' },
];

/** Radios de búsqueda progresiva (km) */
export const COURIER_SEARCH_RADII = [1, 3, 5, 8];

/** Radios para despacho de comida y mandados */
export const DELIVERY_SEARCH_RADII = [3, 5, 8, 12];

/** Tiempo para aceptar oferta — comercio 5 min, mandado 90s (DB define el TTL real) */
export const COURIER_OFFER_TTL_SEC = 300;
