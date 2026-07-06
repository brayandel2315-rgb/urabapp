import { useEffect } from 'react';
import { useLocationStore } from '@/store/locationStore';
import { bootstrapLocationState } from '@/hooks/useAutoLocation';

/** Restaura estado GPS persistido sin pedir permiso al abrir la app. */
export default function GeoBootstrap() {
  useEffect(() => {
    bootstrapLocationState();
    const state = useLocationStore.getState();
    if (state.locationStatus === 'pending') {
      useLocationStore.getState().setLocationStatus(
        state.latitude != null ? 'granted' : 'idle',
      );
    }
  }, []);

  return null;
}
