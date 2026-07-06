/**
 * Catálogo envíos intermunicipales — producto separado de mandados (courier).
 */

import { MUNICIPALITIES } from '@/utils/constants';

export const SHIPMENT_MUNICIPALITIES = [...MUNICIPALITIES];

export const SHIPMENT_PACKAGE_TYPES = [
  { id: 'document', label: 'Documento', icon: 'document' },
  { id: 'package', label: 'Paquete', icon: 'package' },
  { id: 'merchandise', label: 'Mercancía', icon: 'box' },
  { id: 'fragile', label: 'Frágil', icon: 'fragile' },
  { id: 'market', label: 'Mercado', icon: 'market' },
];

export const SHIPMENT_WEIGHT_TIERS = [
  { id: '0-2', label: '0 – 2 kg' },
  { id: '2-5', label: '2 – 5 kg' },
  { id: '5-10', label: '5 – 10 kg' },
  { id: '10-20', label: '10 – 20 kg' },
];

export const SHIPMENT_STATUS = {
  created: 'Creado',
  searching_carrier: 'Buscando transportista',
  accepted: 'Aceptado',
  pickup: 'Recolección',
  at_hub: 'En centro logístico',
  in_transit: 'En ruta',
  arriving: 'Llegando',
  delivered: 'Entregado',
  completed: 'Finalizado',
  cancelled: 'Cancelado',
};

export const SHIPMENT_STATUS_FLOW = [
  'created',
  'searching_carrier',
  'accepted',
  'pickup',
  'at_hub',
  'in_transit',
  'arriving',
  'delivered',
  'completed',
];

export const SHIPMENT_HERO_TRUST = [
  'Rastreo en tiempo real',
  'Pago seguro',
  'Entrega estimada',
  'Comercio verificado',
];

/** Distancias aproximadas (km) — fallback si no hay ruta en BD */
export const MUNICIPALITY_DISTANCE_KM = {
  'Necoclí|Turbo': 28,
  'Turbo|Apartadó': 32,
  'Apartadó|Carepa': 18,
  'Carepa|Chigorodó': 22,
  'Turbo|Carepa': 48,
  'Turbo|Chigorodó': 68,
  'Apartadó|Chigorodó': 38,
  'Necoclí|Apartadó': 58,
  'San Pedro|Apartadó': 42,
  'Arboletes|Apartadó': 55,
};

export function getMunicipalityDistanceKm(origin, dest) {
  if (!origin || !dest) return 40;
  if (origin === dest) return 0;
  const key = `${origin}|${dest}`;
  const reverse = `${dest}|${origin}`;
  return MUNICIPALITY_DISTANCE_KM[key] ?? MUNICIPALITY_DISTANCE_KM[reverse] ?? 45;
}

export function detectLogisticsType(originMunicipio, destMunicipio) {
  const o = String(originMunicipio || '').trim().toLowerCase();
  const d = String(destMunicipio || '').trim().toLowerCase();
  if (!o || !d) return null;
  return o === d ? 'mandado' : 'intermunicipal';
}

export function normalizeMunicipioName(name) {
  const n = String(name || '').trim();
  const found = SHIPMENT_MUNICIPALITIES.find((m) => m.toLowerCase() === n.toLowerCase());
  return found || n;
}

export function getRouteAvailability(route) {
  if (!route) return { available: false, slotsLeft: 0 };
  const left = Math.max(0, (route.capacity_slots ?? 12) - (route.slots_used ?? 0));
  return { available: left > 0 && route.is_active !== false, slotsLeft: left };
}

/** Centros aproximados municipios Urabá [lat, lng] */
export const MUNICIPALITY_COORDS = {
  'Necoclí': { lat: 8.6603, lng: -76.7894 },
  Turbo: { lat: 8.0925, lng: -76.7289 },
  Apartadó: { lat: 7.8837, lng: -76.6319 },
  Carepa: { lat: 7.8044, lng: -76.6803 },
  Chigorodó: { lat: 7.6669, lng: -76.6803 },
  'San Pedro': { lat: 8.0000, lng: -76.2000 },
  Arboletes: { lat: 8.8500, lng: -76.4300 },
};

export function getMunicipioCoords(municipio) {
  return MUNICIPALITY_COORDS[municipio] ?? MUNICIPALITY_COORDS.Apartadó;
}

/** Siguiente estado que el transportista puede avanzar */
export const SHIPMENT_RIDER_NEXT = {
  accepted: 'pickup',
  pickup: 'at_hub',
  at_hub: 'in_transit',
  in_transit: 'arriving',
  arriving: 'delivered',
  delivered: 'completed',
};

export const SHIPMENT_RIDER_ACTION_LABELS = {
  accepted: 'Iniciar recolección',
  pickup: 'En centro logístico',
  at_hub: 'Salir en ruta',
  in_transit: 'Llegando a destino',
  arriving: 'Marcar entregado',
  delivered: 'Finalizar envío',
};
