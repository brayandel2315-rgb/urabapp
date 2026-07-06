/**
 * Motor GPS — escalera de precisión (red → balanceado → GPS de alta precisión).
 * Evita el error TIMEOUT (código 3) por pedir alta precisión en el primer intento.
 */

const PERMISSION_DENIED = 1;
const POSITION_UNAVAILABLE = 2;
const TIMEOUT = 3;

export const GEO_PURPOSE = {
  /** Municipio / catálogo — tolera ~500 m */
  DISCOVERY: 'discovery',
  /** Checkout / entrega — objetivo ~100 m */
  CHECKOUT: 'checkout',
  /** Repartidor en ruta — continuo */
  TRACKING: 'tracking',
};

const STRATEGIES = {
  [GEO_PURPOSE.DISCOVERY]: [
    { enableHighAccuracy: false, timeout: 5_000, maximumAge: 300_000, label: 'cache-network' },
    { enableHighAccuracy: false, timeout: 12_000, maximumAge: 120_000, label: 'network' },
    { enableHighAccuracy: true, timeout: 22_000, maximumAge: 30_000, label: 'gps' },
    { enableHighAccuracy: true, timeout: 28_000, maximumAge: 600_000, label: 'gps-stale' },
  ],
  [GEO_PURPOSE.CHECKOUT]: [
    { enableHighAccuracy: false, timeout: 5_000, maximumAge: 180_000, label: 'fast' },
    { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000, label: 'network' },
    { enableHighAccuracy: true, timeout: 20_000, maximumAge: 15_000, label: 'gps' },
    { enableHighAccuracy: true, timeout: 28_000, maximumAge: 300_000, label: 'gps-stale' },
  ],
  [GEO_PURPOSE.TRACKING]: [
    { enableHighAccuracy: false, timeout: 6_000, maximumAge: 20_000, label: 'warm' },
    { enableHighAccuracy: true, timeout: 18_000, maximumAge: 8_000, label: 'live' },
    { enableHighAccuracy: true, timeout: 25_000, maximumAge: 60_000, label: 'live-stale' },
  ],
};

function getPositionOnce(options) {
  return new Promise((resolve, reject) => {
    if (!navigator?.geolocation) {
      reject(Object.assign(new Error('Geolocalización no disponible'), { code: POSITION_UNAVAILABLE }));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function positionFromCache({ latitude, longitude, accuracy, ageMs }) {
  if (latitude == null || longitude == null) return null;
  return {
    coords: {
      latitude,
      longitude,
      accuracy: accuracy ?? 999,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now() - (ageMs ?? 0),
    _fromAppCache: true,
    _strategy: 'app-cache',
  };
}

function classifyAccuracy(accuracyMeters) {
  if (accuracyMeters == null) return 'unknown';
  if (accuracyMeters <= 50) return 'high';
  if (accuracyMeters <= 200) return 'good';
  if (accuracyMeters <= 800) return 'approximate';
  return 'low';
}

/**
 * Adquiere posición con reintentos automáticos y degradación de precisión.
 * @returns {Promise<GeolocationPosition & { _strategy?: string, _accuracyTier?: string }>}
 */
export async function acquirePosition({
  purpose = GEO_PURPOSE.DISCOVERY,
  cached = null,
  maxCacheAgeMs = 300_000,
} = {}) {
  if (cached?.latitude != null && cached?.longitude != null) {
    const age = cached.ageMs ?? 0;
    if (age <= maxCacheAgeMs) {
      return positionFromCache(cached);
    }
  }

  const strategies = STRATEGIES[purpose] || STRATEGIES[GEO_PURPOSE.DISCOVERY];
  let lastError = null;

  for (const strategy of strategies) {
    try {
      const pos = await getPositionOnce(strategy);
      return Object.assign(pos, {
        _strategy: strategy.label,
        _accuracyTier: classifyAccuracy(pos.coords.accuracy),
      });
    } catch (err) {
      lastError = err;
      if (err?.code === PERMISSION_DENIED) throw err;
    }
  }

  if (cached?.latitude != null && cached?.longitude != null) {
    const stale = positionFromCache({ ...cached, ageMs: cached.ageMs ?? maxCacheAgeMs + 1 });
    return Object.assign(stale, { _accuracyTier: 'cached', _strategy: 'app-cache-stale' });
  }

  throw lastError || Object.assign(new Error('No se pudo obtener ubicación'), { code: TIMEOUT });
}

/** watchPosition con primer fix rápido — ideal para repartidor en ruta */
export function startAdaptiveWatch(onPosition, onError, { highAccuracyAfterFix = true } = {}) {
  if (!navigator?.geolocation) return () => {};

  let watchId = null;
  let hasFix = false;

  const applyOptions = () => ({
    enableHighAccuracy: highAccuracyAfterFix && hasFix,
    maximumAge: hasFix ? 5_000 : 20_000,
    timeout: hasFix ? 20_000 : 12_000,
  });

  const onSuccess = (pos) => {
    hasFix = true;
    onPosition(pos);
  };

  watchId = navigator.geolocation.watchPosition(onSuccess, onError ?? (() => {}), {
    enableHighAccuracy: false,
    maximumAge: 20_000,
    timeout: 12_000,
  });

  navigator.geolocation.getCurrentPosition(onSuccess, () => {}, {
    enableHighAccuracy: false,
    maximumAge: 120_000,
    timeout: 8_000,
  });

  const upgrade = setInterval(() => {
    if (!hasFix || !highAccuracyAfterFix) return;
    if (watchId != null) navigator.geolocation.clearWatch(watchId);
    watchId = navigator.geolocation.watchPosition(
      onSuccess,
      () => {},
      { enableHighAccuracy: true, maximumAge: 5_000, timeout: 25_000 },
    );
    clearInterval(upgrade);
  }, 4_000);

  return () => {
    clearInterval(upgrade);
    if (watchId != null) navigator.geolocation.clearWatch(watchId);
  };
}

export function getGeoFailureMessage(err, permissionState) {
  const code = err?.code;
  if (code === PERMISSION_DENIED || permissionState === 'denied') {
    return 'Ubicación bloqueada. En tu navegador: Configuración del sitio → Ubicación → Permitir.';
  }
  if (code === POSITION_UNAVAILABLE) {
    return 'Señal GPS no disponible. Activa ubicación en el teléfono y sal cerca de una ventana.';
  }
  if (code === TIMEOUT) {
    return 'Ubicación tardó más de lo esperado. Reintentamos automáticamente — si persiste, activa el GPS del teléfono o ingresa la dirección manualmente.';
  }
  return err?.message || 'No se pudo obtener tu ubicación.';
}

export function getGeoSuccessHint(position) {
  const tier = position?._accuracyTier || classifyAccuracy(position?.coords?.accuracy);
  if (tier === 'approximate' || tier === 'low' || tier === 'cached') {
    return 'Ubicación aproximada — puedes afinarla en el mapa o reintentar al aire libre.';
  }
  return null;
}
