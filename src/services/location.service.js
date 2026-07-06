/**
 * Georreferenciación unificada — GPS + reverse geocode + cobertura Urabá.
 */
import { useLocationStore } from '@/store/locationStore';
import { reverseGeocode } from '@/services/map.service';
import {
  detectMunicipioFromCoords,
  parseMunicipioFromGeocodeLabel,
  extractCityFromGeocodeLabel,
  isWithinUrabaServiceArea,
} from '@/utils/municipio-geo';
import { trackAnalyticsEvent } from '@/services/marketplace.service';
import {
  acquirePosition,
  GEO_PURPOSE,
  getGeoFailureMessage,
  getGeoSuccessHint,
} from '@/utils/geolocation-engine';

let running = false;

export { GEO_PURPOSE };

export function isGeolocationAvailable() {
  return typeof navigator !== 'undefined' && Boolean(navigator.geolocation);
}

export function isSecureContextForGeo() {
  return typeof window !== 'undefined' && window.isSecureContext;
}

export async function queryGeoPermission() {
  if (typeof navigator === 'undefined' || !navigator.permissions?.query) {
    return 'unknown';
  }
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch {
    return 'unknown';
  }
}

/** @deprecated Usar getGeoFailureMessage */
export function getGeoErrorMessage(err, permissionState) {
  return getGeoFailureMessage(err, permissionState);
}

export function resolveLocationFromCoords(latitude, longitude, geocodeLabel) {
  const inServiceArea = isWithinUrabaServiceArea(latitude, longitude);
  const urabaMunicipio = inServiceArea ? detectMunicipioFromCoords(latitude, longitude) : null;
  const fromLabel = parseMunicipioFromGeocodeLabel(geocodeLabel);
  const municipio = inServiceArea ? (fromLabel || urabaMunicipio) : null;
  const detectedCityDisplay = extractCityFromGeocodeLabel(geocodeLabel)
    || (inServiceArea ? municipio : null)
    || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  const label = geocodeLabel
    || (municipio ? `${municipio}, Urabá, Colombia` : `${detectedCityDisplay}, Colombia`);

  return {
    inServiceArea,
    municipio,
    detectedCityDisplay,
    label,
  };
}

export function getCurrentLocationSnapshot() {
  const s = useLocationStore.getState();
  return {
    latitude: s.latitude,
    longitude: s.longitude,
    municipio: s.detectedMunicipio,
    label: s.detectedLabel,
    status: s.locationStatus,
    accuracy: s.locationAccuracy,
    inServiceArea: s.inServiceArea,
    detectedCityDisplay: s.detectedCityDisplay,
    accuracyTier: s.locationAccuracyTier,
    locationHint: s.locationHint,
  };
}

function persistCoords(latitude, longitude, accuracy, resolved, source, meta = {}) {
  useLocationStore.getState().setFromDetection({
    municipio: resolved.municipio,
    latitude,
    longitude,
    label: resolved.label,
    accuracy,
    source,
    inServiceArea: resolved.inServiceArea,
    detectedCityDisplay: resolved.detectedCityDisplay,
    accuracyTier: meta.accuracyTier ?? null,
    locationHint: meta.locationHint ?? null,
  });
}

/**
 * Solicita GPS con escalera de precisión, resuelve ubicación y persiste en locationStore.
 */
export async function requestUserLocation({
  source = 'gps',
  purpose = GEO_PURPOSE.DISCOVERY,
} = {}) {
  const store = useLocationStore.getState();

  if (!isGeolocationAvailable()) {
    store.setLocationStatus('error');
    throw Object.assign(new Error('Tu navegador no soporta geolocalización'), { code: 2 });
  }

  if (!isSecureContextForGeo()) {
    store.setLocationStatus('error');
    throw new Error('La ubicación solo funciona con HTTPS o en localhost');
  }

  if (running) {
    const snap = getCurrentLocationSnapshot();
    if (snap.latitude != null) return snap;
    throw new Error('Ya estamos detectando tu ubicación');
  }

  running = true;

  if (store.locationStatus === 'denied' || store.locationStatus === 'error') {
    store.setLocationStatus('idle');
  }
  store.setLocationStatus('pending');

  const cached = store.latitude != null
    ? {
        latitude: store.latitude,
        longitude: store.longitude,
        accuracy: store.locationAccuracy,
        ageMs: store.lastDetectedAt ? Date.now() - store.lastDetectedAt : null,
      }
    : null;

  try {
    const pos = await acquirePosition({ purpose, cached });
    const { latitude, longitude, accuracy } = pos.coords;
    const hint = getGeoSuccessHint(pos);

    const coordResolved = resolveLocationFromCoords(latitude, longitude, null);
    persistCoords(latitude, longitude, accuracy, coordResolved, source, {
      accuracyTier: pos._accuracyTier,
      locationHint: hint,
    });

    let geocodeLabel = null;
    try {
      geocodeLabel = await Promise.race([
        reverseGeocode(latitude, longitude),
        new Promise((resolve) => { setTimeout(() => resolve(null), 4_000); }),
      ]);
    } catch {
      /* coords ya guardadas */
    }

    if (geocodeLabel) {
      const resolved = resolveLocationFromCoords(latitude, longitude, geocodeLabel);
      persistCoords(latitude, longitude, accuracy, resolved, source, {
        accuracyTier: pos._accuracyTier,
        locationHint: hint,
      });
    }

    const final = getCurrentLocationSnapshot();

    trackAnalyticsEvent('location_detected', {
      municipio: final.municipio,
      city: final.detectedCityDisplay,
      in_service_area: final.inServiceArea,
      source,
      accuracy: accuracy ? Math.round(accuracy) : null,
      strategy: pos._strategy,
      accuracy_tier: pos._accuracyTier,
    }).catch(() => {});

    return final;
  } catch (err) {
    const code = err?.code;
    const snap = getCurrentLocationSnapshot();
    if (snap.latitude != null) {
      store.setLocationStatus('granted');
      return snap;
    }
    if (code === 1) store.setLocationStatus('denied');
    else store.setLocationStatus('error');
    throw err;
  } finally {
    running = false;
  }
}
