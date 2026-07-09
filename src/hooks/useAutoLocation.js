import { useEffect, useCallback, useRef } from 'react';
import { useLocationStore } from '@/store/locationStore';
import {
  requestUserLocation,
  isGeolocationAvailable,
  isSecureContextForGeo,
  queryGeoPermission,
  GEO_PURPOSE,
} from '@/services/location.service';
import { getGeoSuccessToast, getGeoFailureToast } from '@/utils/geolocation-engine';
import { toast } from '@/utils/toast';

const STALE_MS = 5 * 60 * 1000;
const STUCK_PENDING_MS = 8_000;
const TERMINAL_STATUSES = new Set(['denied', 'error']);

let bootstrapped = false;

function hasCoords(state) {
  return state.latitude != null && state.longitude != null;
}

function canRunGeo() {
  return isGeolocationAvailable() && isSecureContextForGeo();
}

function clearStuckPending() {
  const state = useLocationStore.getState();
  if (state.locationStatus !== 'pending') return false;
  const stuck = !state.lastDetectedAt || Date.now() - state.lastDetectedAt > STUCK_PENDING_MS;
  if (!stuck) return false;
  useLocationStore.getState().setLocationStatus(hasCoords(state) ? 'granted' : 'idle');
  return true;
}

export function bootstrapLocationState() {
  if (bootstrapped) return;
  bootstrapped = true;

  clearStuckPending();
  const state = useLocationStore.getState();

  if (state.locationStatus === 'pending') {
    useLocationStore.getState().setLocationStatus(hasCoords(state) ? 'granted' : 'idle');
  }

  if (hasCoords(state) && (state.locationStatus === 'idle' || !state.locationStatus)) {
    useLocationStore.getState().setLocationStatus('granted');
  }
}

/**
 * @param {{ auto?: boolean, deferMs?: number }} options
 * auto — solo intenta GPS una vez si no hay coords guardadas (no bloquea la UI).
 */
export function useAutoLocation({ auto = false, deferMs = 0 } = {}) {
  const locationStatus = useLocationStore((s) => s.locationStatus);
  const mountAttemptRef = useRef(false);
  const deferTimerRef = useRef(null);

  const detect = useCallback(async (purpose = GEO_PURPOSE.DISCOVERY) => {
    try {
      const result = await requestUserLocation({ source: 'gps', purpose });
      const geoToast = getGeoSuccessToast({
        _accuracyTier: result.accuracyTier,
        coords: { accuracy: result.accuracy },
      });
      if (geoToast.approximate) toast.location(geoToast);
      else toast.show({ ...geoToast, type: geoToast.type || 'success' });
      return result;
    } catch (err) {
      const permission = await queryGeoPermission();
      const fail = getGeoFailureToast(err, permission);
      toast.show(fail);
      return null;
    }
  }, []);

  useEffect(() => {
    bootstrapLocationState();
  }, []);

  useEffect(() => {
    if (!auto || !canRunGeo()) return undefined;

    deferTimerRef.current = window.setTimeout(() => {
      if (mountAttemptRef.current) return;

      const state = useLocationStore.getState();
      if (hasCoords(state)) return;
      if (state.locationStatus === 'pending') return;
      if (TERMINAL_STATUSES.has(state.locationStatus)) return;

      mountAttemptRef.current = true;
      detect();
    }, deferMs);

    return () => {
      if (deferTimerRef.current) window.clearTimeout(deferTimerRef.current);
    };
  }, [auto, detect, deferMs]);

  useEffect(() => {
    if (!auto) return undefined;

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (clearStuckPending()) {
        mountAttemptRef.current = false;
      }
      const state = useLocationStore.getState();
      if (!hasCoords(state)) return;
      if (!state.lastDetectedAt || Date.now() - state.lastDetectedAt < STALE_MS) return;
      if (TERMINAL_STATUSES.has(state.locationStatus)) return;
      detect();
    };

    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [auto, detect]);

  return {
    detect,
    locationStatus,
  };
}
