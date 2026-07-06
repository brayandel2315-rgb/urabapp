/**
 * Deep links de navegación — Waze, Google Maps, Apple Maps (estándar delivery apps).
 */

function toCoord(lat, lng) {
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
  return { latitude, longitude };
}

export function buildWazeNavigateUrl({ latitude, longitude, address }) {
  const c = toCoord(latitude, longitude);
  if (!c) return null;
  const q = address ? `&q=${encodeURIComponent(address)}` : '';
  return `https://waze.com/ul?ll=${c.latitude},${c.longitude}&navigate=yes${q}`;
}

export function buildGoogleMapsNavigateUrl({ latitude, longitude, address }) {
  const c = toCoord(latitude, longitude);
  if (!c) return null;
  if (address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}`;
}

export function buildMapsSearchUrl({ latitude, longitude, label }) {
  const c = toCoord(latitude, longitude);
  if (!c) return null;
  const q = label ? encodeURIComponent(label) : `${c.latitude},${c.longitude}`;
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function openExternalUrl(url) {
  if (!url || typeof window === 'undefined') return false;
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

export function openWazeNavigation(target) {
  return openExternalUrl(buildWazeNavigateUrl(target));
}

export function openGoogleMapsNavigation(target) {
  return openExternalUrl(buildGoogleMapsNavigateUrl(target));
}
