/** Validación y utilidades de rutas — OpenRouteService (Edge) */

/** Bounding box Colombia continental (evita abuso de la API key) */
export const COLOMBIA_BBOX = {
  minLng: -79.5,
  maxLng: -66.8,
  minLat: -4.3,
  maxLat: 13.5,
};

/** Máx. distancia en línea recta permitida (km) — cubre Urabá intermunicipal */
export const MAX_ROUTE_KM = 180;

const VALID_PROFILES = new Set(['driving-car', 'driving-hgv', 'cycling-regular', 'foot-walking']);

export function isValidLngLat(pair: unknown): pair is [number, number] {
  if (!Array.isArray(pair) || pair.length < 2) return false;
  const lng = Number(pair[0]);
  const lat = Number(pair[1]);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  return true;
}

export function isInsideColombia(lng: number, lat: number): boolean {
  return (
    lng >= COLOMBIA_BBOX.minLng &&
    lng <= COLOMBIA_BBOX.maxLng &&
    lat >= COLOMBIA_BBOX.minLat &&
    lat <= COLOMBIA_BBOX.maxLat
  );
}

export function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLon = ((b[0] - a[0]) * Math.PI) / 180;
  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b[1] * Math.PI) / 180;
  const sin =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(sin), Math.sqrt(1 - sin));
}

export function normalizeProfile(profile: unknown): string {
  const p = String(profile || 'driving-car');
  return VALID_PROFILES.has(p) ? p : 'driving-car';
}

export function validateRouteRequest(start: unknown, end: unknown): { ok: true } | { ok: false; error: string; status: number } {
  if (!isValidLngLat(start) || !isValidLngLat(end)) {
    return { ok: false, error: 'Coordenadas inválidas. Formato: [lng, lat]', status: 400 };
  }
  if (!isInsideColombia(start[0], start[1]) || !isInsideColombia(end[0], end[1])) {
    return { ok: false, error: 'Ruta fuera de cobertura (Colombia)', status: 422 };
  }
  const km = haversineKm(start, end);
  if (km < 0.05) {
    return { ok: false, error: 'Origen y destino demasiado cercanos', status: 400 };
  }
  if (km > MAX_ROUTE_KM) {
    return { ok: false, error: `Distancia máxima ${MAX_ROUTE_KM} km`, status: 422 };
  }
  return { ok: true };
}
