import { isSupabaseConfigured } from '../lib/supabase';
import { invokeEdgeFunction } from './edge.service';
import {
  buildDirectRoute,
  estimateRouteFromHaversine,
  getCachedRoute,
  normalizeRouteResponse,
  routeCacheKey,
  setCachedRoute,
} from '../utils/routing';

const DEFAULT_CENTER = [-75.7536, 7.8837]; // Apartadó [lng, lat]
const NOMINATIM = 'https://nominatim.openstreetmap.org';
const PHOTON = 'https://photon.komoot.io/api';
const APP_NAME = 'Urabapp';
/** Bounding box Urabá antioqueño aproximado */
const URABA_BBOX = '-77.2,6.8,-76.2,8.5';

export function isMapsEnabled() {
  return true;
}

export function isGoogleMapsActive() {
  return false;
}

/** @deprecated alias */
export const isMapboxEnabled = isMapsEnabled;

export function isRoutingEnabled() {
  return import.meta.env.VITE_ORS_ENABLED !== 'false';
}

export function getDefaultCenter() {
  return DEFAULT_CENTER;
}

async function nominatimFetch(path, params, timeoutMs = 8000) {
  const url = new URL(path, NOMINATIM);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'es', 'User-Agent': `${APP_NAME}/1.0` },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function photonFetch(params, timeoutMs = 6000) {
  const url = new URL(PHOTON);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function formatPhotonFeature(feature) {
  const [lon, lat] = feature.geometry?.coordinates ?? [];
  if (lat == null || lon == null) return null;
  const p = feature.properties ?? {};
  const parts = [p.name, p.street, p.city || p.county, p.state].filter(Boolean);
  return {
    latitude: lat,
    longitude: lon,
    label: parts.join(', ') || p.name || 'Ubicación',
  };
}

async function geocodeViaEdge(action, payload) {
  return invokeEdgeFunction('geocode-proxy', { action, ...payload });
}

/** Sugerencias de dirección — Photon (gratis, rápido, sin API key) */
export async function searchAddressSuggestions(query, { municipio, lat, lon, limit = 6 } = {}) {
  const q = String(query || '').trim();
  if (q.length < 3) return [];

  const searchQ = municipio ? `${q} ${municipio}` : q;
  const data = await photonFetch({
    q: searchQ,
    limit: String(limit),
    lang: 'es',
    bbox: URABA_BBOX,
    ...(lat != null && lon != null ? { lat: String(lat), lon: String(lon) } : {}),
  });

  return (data?.features ?? [])
    .map(formatPhotonFeature)
    .filter(Boolean);
}

/** Geocoding — Edge/Nominatim + Photon (gratis) */
export async function geocodeAddress(query, { municipio } = {}) {
  if (!query?.trim()) return null;

  const suggestions = await searchAddressSuggestions(query, { municipio, limit: 1 });
  if (suggestions[0]) return suggestions[0];

  if (isSupabaseConfigured) {
    try {
      const data = await geocodeViaEdge('search', { query: query.trim(), municipio });
      if (data?.latitude != null && data?.longitude != null) {
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          label: data.label,
        };
      }
    } catch {
      /* fallback */
    }
  }

  const q = municipio ? `${query}, ${municipio}, Antioquia, Colombia` : `${query}, Colombia`;
  const data = await nominatimFetch('/search', {
    q,
    format: 'json',
    limit: '1',
    countrycodes: 'co',
  });
  const hit = Array.isArray(data) ? data[0] : null;
  if (!hit) return null;
  return {
    latitude: Number(hit.lat),
    longitude: Number(hit.lon),
    label: hit.display_name,
  };
}

function formatCoordsFallback(latitude, longitude) {
  const lat = Number(latitude).toFixed(5);
  const lng = Number(longitude).toFixed(5);
  return `Ubicación (${lat}, ${lng})`;
}

export async function reverseGeocode(latitude, longitude) {
  if (latitude == null || longitude == null) return null;

  if (isSupabaseConfigured) {
    try {
      const data = await geocodeViaEdge('reverse', { lat: latitude, lon: longitude });
      if (data?.label) return data.label;
    } catch {
      /* edge unavailable */
    }
  }

  const data = await nominatimFetch('/reverse', {
    lat: String(latitude),
    lon: String(longitude),
    format: 'json',
    zoom: '18',
    addressdetails: '1',
  });
  if (data?.display_name) return data.display_name;

  return formatCoordsFallback(latitude, longitude);
}

/** Rutas y ETA — OpenRouteService (gratis vía Edge Function) + fallback inteligente */
export async function getDrivingRoute(from, to, { profile = 'driving-car', useCache = true } = {}) {
  if (!from?.latitude || !to?.latitude) return null;

  const cacheKey = useCache ? routeCacheKey(from, to, profile) : null;
  if (cacheKey) {
    const cached = getCachedRoute(cacheKey);
    if (cached) return cached;
  }

  if (isRoutingEnabled() && isSupabaseConfigured) {
    try {
      const data = await invokeEdgeFunction('openroute-directions', {
        start: [from.longitude, from.latitude],
        end: [to.longitude, to.latitude],
        profile,
      });
      const route = normalizeRouteResponse(data);
      if (route?.geometry) {
        if (cacheKey) setCachedRoute(cacheKey, route);
        return route;
      }
    } catch {
      /* estimación abajo */
    }
  }

  const estimated = estimateRouteFromHaversine(from, to);
  if (estimated) {
    if (cacheKey) setCachedRoute(cacheKey, estimated);
    return estimated;
  }

  return buildDirectRoute(from, to);
}

export async function getDrivingEta(from, to, options) {
  const route = await getDrivingRoute(from, to, options);
  if (!route) return null;
  return {
    minutes: route.minutes,
    minutesMin: route.minutesMin,
    minutesMax: route.minutesMax,
    km: route.km,
    durationSec: route.durationSec,
    arrivalAt: route.arrivalAt,
    provider: route.provider,
  };
}

/** Dibuja ruta real (ORS) o línea directa en el mapa interactivo */
export async function drawRouteOnMap(api, from, to, style = {}) {
  const route = await getDrivingRoute(from, to);
  if (route?.geometry) {
    if (typeof api.setRouteGeometry === 'function') {
      await api.setRouteGeometry(route.geometry, style);
    } else {
      await api.drawGeometry(route.geometry, style);
    }
  } else if (typeof api.setRouteGeometry === 'function') {
    await api.setRouteGeometry({
      type: 'LineString',
      coordinates: [[from.longitude, from.latitude], [to.longitude, to.latitude]],
    }, style);
  } else {
    await api.drawLine([from, to], style);
  }
  return route;
}
