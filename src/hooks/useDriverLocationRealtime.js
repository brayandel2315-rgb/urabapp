import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { isSocketEnabled, subscribeDriverLocation } from '../services/socket.service';
import { attachRealtimeStatus } from './realtimeSubscribe';

/**
 * Ubicación del mensajero — Socket.IO (baja latencia) + Supabase Realtime (respaldo).
 */
export function useDriverLocationRealtime(driverId, { orderId } = {}) {
  const [location, setLocation] = useState(null);
  const [source, setSource] = useState(null);

  useEffect(() => {
    if (!driverId) {
      setLocation(null);
      setSource(null);
      return undefined;
    }

    let cancelled = false;

    const apply = (payload, src) => {
      if (cancelled || payload?.latitude == null || payload?.longitude == null) return;
      setLocation({
        latitude: Number(payload.latitude),
        longitude: Number(payload.longitude),
        updatedAt: payload.updatedAt || new Date().toISOString(),
      });
      setSource(src);
    };

    if (isSupabaseConfigured) {
      supabase
        .from('drivers')
        .select('latitude, longitude, updated_at')
        .eq('id', driverId)
        .single()
        .then(({ data }) => {
          if (!cancelled && data?.latitude != null) {
            apply({
              latitude: data.latitude,
              longitude: data.longitude,
              updatedAt: data.updated_at,
            }, 'database');
          }
        })
        .catch(() => {});
    }

    const cleanups = [];

    if (isSocketEnabled()) {
      let socketCleanup = () => {};
      subscribeDriverLocation(driverId, (payload) => {
        apply(payload, 'socket');
      }, { orderId }).then((fn) => {
        if (cancelled) fn();
        else socketCleanup = fn;
      });
      cleanups.push(() => socketCleanup());
    }

    if (isSupabaseConfigured) {
      const channel = attachRealtimeStatus(
        supabase
          .channel(`driver-loc-${driverId}`)
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'drivers', filter: `id=eq.${driverId}` },
            (payload) => {
              const row = payload.new;
              if (row?.latitude != null) {
                apply({
                  latitude: row.latitude,
                  longitude: row.longitude,
                  updatedAt: row.updated_at,
                }, isSocketEnabled() ? 'realtime-backup' : 'realtime');
              }
            },
          ),
        `driver-loc-${driverId}`,
      );
      cleanups.push(() => supabase.removeChannel(channel));
    }

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, [driverId, orderId]);

  return { ...location, source };
}
