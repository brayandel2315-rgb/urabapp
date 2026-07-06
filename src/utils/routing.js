/**
 * Motor de rutas cliente — caché, fallback y ETA con rango.
 * Rutas reales vía Edge openroute-directions (ORS_API_KEY en Supabase).
 */

import { haversineKm as haversineKmCourier } from './courier-fare';

export const ROUTE_PROVIDER = {
  ORS: 'ors',
  ESTIMATED: 'estimated',
  DIRECT: 'direct',
  UNAVAILABLE: 'unavailable',
};

/** Factor vial urbano/interurbano Urabá sobre Haversine */
const ROAD_FACTOR = 1.38;
/** Velocidad media moto/carro delivery (km/h) */
const AVG_SPEED_KMH = 28;

const routeCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX = 80;

function roundCoord(n) {
  return Math.round(Number(n) * 10000) / 10000;
}

export function routeCacheKey(from, to, profile = 'driving-car') {
  if (!from?.latitude || !to?.latitude) return null;
  return [
    profile,
    roundCoord(from.latitude),
    roundCoord(from.longitude),
    roundCoord(to.latitude),
    roundCoord(to.longitude),
  ].join(':');
}

export function getCachedRoute(key) {
  if (!key) return null;
  const hit = routeCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    routeCache.delete(key);
    return null;
  }
  return hit.route;
}

export function setCachedRoute(key, route) {
  if (!key || !route) return;
  if (routeCache.size >= CACHE_MAX) {
    const oldest = routeCache.keys().next().value;
    if (oldest) routeCache.delete(oldest);
  }
  routeCache.set(key, { route, at: Date.now() });
}

export function haversineKm(from, to) {
  return haversineKmCourier(from, to);
}

/** ETA estimado cuando ORS no está disponible (mejor que línea recta sin tiempo) */
export function estimateRouteFromHaversine(from, to) {
  const straightKm = haversineKm(from, to);
  if (!straightKm) return null;

  const km = Number((straightKm * ROAD_FACTOR).toFixed(1));
  const durationSec = Math.max(300, Math.round((km / AVG_SPEED_KMH) * 3600));
  const minutes = Math.max(5, Math.round(durationSec / 60));
  const buffer = Math.max(3, Math.round(minutes * 0.18));
  const minutesMin = Math.max(1, minutes - buffer);
  const minutesMax = minutes + buffer;

  return {
    minutes,
    minutesMin,
    minutesMax,
    km,
    durationSec,
    arrivalAt: new Date(Date.now() + durationSec * 1000).toISOString(),
    provider: ROUTE_PROVIDER.ESTIMATED,
    geometry: {
      type: 'LineString',
      coordinates: [
        [from.longitude, from.latitude],
        [to.longitude, to.latitude],
      ],
    },
  };
}

export function buildDirectRoute(from, to) {
  return {
    minutes: null,
    minutesMin: null,
    minutesMax: null,
    km: null,
    durationSec: null,
    arrivalAt: null,
    provider: ROUTE_PROVIDER.DIRECT,
    geometry: {
      type: 'LineString',
      coordinates: [
        [from.longitude, from.latitude],
        [to.longitude, to.latitude],
      ],
    },
  };
}

export function normalizeRouteResponse(data) {
  if (!data?.geometry) return null;
  const minutes = data.minutes ?? (data.durationSec ? Math.max(1, Math.round(data.durationSec / 60)) : null);
  const buffer = minutes != null ? Math.max(2, Math.round(minutes * 0.12)) : null;
  return {
    geometry: data.geometry,
    minutes,
    minutesMin: data.minutesMin ?? (minutes != null && buffer != null ? Math.max(1, minutes - buffer) : null),
    minutesMax: data.minutesMax ?? (minutes != null && buffer != null ? minutes + buffer : null),
    km: data.km != null ? Number(data.km) : null,
    durationSec: data.durationSec ?? null,
    arrivalAt: data.arrivalAt ?? null,
    provider: data.provider || ROUTE_PROVIDER.ORS,
    profile: data.profile || 'driving-car',
  };
}

export function formatEtaLabel(route) {
  if (!route?.minutes) return null;
  if (route.minutesMin != null && route.minutesMax != null && route.minutesMax !== route.minutesMin) {
    return `${route.minutesMin}–${route.minutesMax} min`;
  }
  return `~${route.minutes} min`;
}

export function formatArrivalTime(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return null;
  }
}

export function routeQualityLabel(provider) {
  switch (provider) {
    case ROUTE_PROVIDER.ORS:
      return 'Ruta por calles';
    case ROUTE_PROVIDER.ESTIMATED:
      return 'ETA estimada';
    case ROUTE_PROVIDER.DIRECT:
      return 'Vista aproximada';
    default:
      return null;
  }
}

/** ¿Mover el mensajero lo suficiente para recalcular ruta? (~120 m) */
export function shouldRefreshRoute(prev, next, thresholdM = 120) {
  if (!prev?.latitude || !next?.latitude) return Boolean(next?.latitude);
  const km = haversineKm(prev, next);
  return km * 1000 >= thresholdM;
}
