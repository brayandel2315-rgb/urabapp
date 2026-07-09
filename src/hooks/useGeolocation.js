import { useState, useCallback } from 'react';
import { useLocationStore } from '../store/locationStore';
import {
  requestUserLocation,
  isGeolocationAvailable,
  queryGeoPermission,
  GEO_PURPOSE,
} from '../services/location.service';
import { getGeoSuccessToast, getGeoFailureToast } from '@/utils/geolocation-engine';
import { toast } from '../utils/toast';

export function useGeolocation({ purpose = GEO_PURPOSE.CHECKOUT } = {}) {
  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);
  const locationStatus = useLocationStore((s) => s.locationStatus);
  const locationHint = useLocationStore((s) => s.locationHint);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const detect = useCallback(async () => {
    if (!isGeolocationAvailable()) {
      const msg = 'GPS no disponible en este dispositivo';
      setError(msg);
      toast.error(msg);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await requestUserLocation({ source: 'gps', purpose });
      const geoToast = getGeoSuccessToast({
        _accuracyTier: result.accuracyTier,
        coords: { accuracy: result.accuracy },
      });
      if (geoToast.type === 'trust' || geoToast.type === 'success') {
        toast.show({ ...geoToast, type: geoToast.type });
      } else {
        toast.location(geoToast);
      }
      return result;
    } catch (err) {
      const permission = await queryGeoPermission();
      const fail = getGeoFailureToast(err, permission);
      setError(fail.description || fail.title);
      toast.show(fail);
      return null;
    } finally {
      setLoading(false);
    }
  }, [purpose]);

  return {
    latitude,
    longitude,
    loading: loading || locationStatus === 'pending',
    error,
    locationHint,
    detect,
    hasCoords: latitude != null && longitude != null,
  };
}
