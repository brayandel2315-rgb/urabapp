import { MUNICIPALITIES } from './constants';
import { tryNormalizeMunicipio } from './municipio';

/** Centros municipios Urabá — verificados (lat, lng) */
export const MUNICIPIO_CENTERS = {
  Necoclí: { lat: 8.6593, lng: -76.7894, radiusKm: 18 },
  Turbo: { lat: 8.0925, lng: -76.7289, radiusKm: 15 },
  Apartadó: { lat: 7.8839, lng: -76.6312, radiusKm: 20 },
  Carepa: { lat: 7.8044, lng: -76.6803, radiusKm: 12 },
  Chigorodó: { lat: 7.6669, lng: -76.6803, radiusKm: 14 },
  'San Pedro': { lat: 8.2764, lng: -76.3775, radiusKm: 14 },
  Arboletes: { lat: 8.8503, lng: -76.4269, radiusKm: 14 },
};

/** Lista para mapas (marcadores en orden de cobertura). */
export const URABA_MUNICIPIO_MARKERS = MUNICIPALITIES.map((name) => ({
  name,
  ...MUNICIPIO_CENTERS[name],
})).filter((m) => m.lat != null);

/** Recorte suave alrededor de los marcadores de cobertura. */
export function getUrabaMapBounds(padding = { lat: 0.07, lng: 0.06 }) {
  const lats = URABA_MUNICIPIO_MARKERS.map((m) => m.lat);
  const lngs = URABA_MUNICIPIO_MARKERS.map((m) => m.lng);
  return {
    south: Math.min(...lats) - padding.lat,
    west: Math.min(...lngs) - padding.lng,
    north: Math.max(...lats) + padding.lat,
    east: Math.max(...lngs) + padding.lng,
  };
}

/** Centro y zoom para embed / vista regional. */
export const URABA_REGION_VIEW = {
  lat: 8.08,
  lng: -76.61,
  zoom: 9,
};

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2
    + Math.cos((lat1 * Math.PI) / 180)
    * Math.cos((lat2 * Math.PI) / 180)
    * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** ¿Coordenadas dentro del radio de cobertura UrabApp? */
export function isWithinUrabaServiceArea(latitude, longitude) {
  if (latitude == null || longitude == null) return false;

  for (const name of MUNICIPALITIES) {
    const c = MUNICIPIO_CENTERS[name];
    if (!c) continue;
    const dist = haversineKm(latitude, longitude, c.lat, c.lng);
    if (dist <= (c.radiusKm ?? 25)) return true;
  }

  return false;
}

/** Municipio Urabá más cercano; null si está fuera de cobertura */
export function detectMunicipioFromCoords(latitude, longitude) {
  if (latitude == null || longitude == null) return null;
  if (!isWithinUrabaServiceArea(latitude, longitude)) return null;

  let best = null;
  let bestDist = Infinity;

  for (const name of MUNICIPALITIES) {
    const c = MUNICIPIO_CENTERS[name];
    if (!c) continue;
    const dist = haversineKm(latitude, longitude, c.lat, c.lng);
    if (dist <= (c.radiusKm ?? 25) && dist < bestDist) {
      bestDist = dist;
      best = name;
    }
  }

  return best;
}

/** Extrae municipio Urabá de texto reverse-geocode (Nominatim) */
export function parseMunicipioFromGeocodeLabel(label) {
  if (!label) return null;
  const lower = label.toLowerCase();
  for (const m of MUNICIPALITIES) {
    if (lower.includes(m.toLowerCase())) return tryNormalizeMunicipio(m);
  }
  if (/turbo/i.test(label)) return 'Turbo';
  if (/apartad/i.test(label)) return 'Apartadó';
  if (/carepa/i.test(label)) return 'Carepa';
  if (/chigorod/i.test(label)) return 'Chigorodó';
  if (/necocl/i.test(label)) return 'Necoclí';
  return null;
}

const REGION_SKIP = /^(antioquia|colombia|región|departamento|area metropolitana)/i;

/** Ciudad legible para mostrar al usuario (Medellín, Bogotá, etc.) */
export function extractCityFromGeocodeLabel(label) {
  if (!label) return null;
  const parts = label.split(',').map((p) => p.trim()).filter(Boolean);
  for (const part of parts) {
    if (/^colombia$/i.test(part)) continue;
    if (REGION_SKIP.test(part)) continue;
    if (/^\d/.test(part)) continue;
    if (part.length >= 2) return part;
  }
  return parts[0] || null;
}
