import { MUNICIPALITIES } from './constants';
import { tryNormalizeMunicipio } from './municipio';

/** Centros aproximados municipios Urabá [lat, lng] */
export const MUNICIPIO_CENTERS = {
  Necoclí: { lat: 8.4267, lng: -76.7892, radiusKm: 18 },
  Turbo: { lat: 8.0927, lng: -76.7289, radiusKm: 15 },
  Apartadó: { lat: 7.8837, lng: -75.7536, radiusKm: 20 },
  Carepa: { lat: 7.7583, lng: -76.6525, radiusKm: 12 },
  Chigorodó: { lat: 7.6667, lng: -76.6833, radiusKm: 14 },
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
