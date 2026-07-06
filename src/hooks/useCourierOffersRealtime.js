import { useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { attachRealtimeStatus } from './realtimeSubscribe';

/** Ofertas courier en tiempo real para mensajero */
export function useCourierOffersRealtime(driverId, onNewOffer, onChannelReady) {
  const handlerRef = useRef(onNewOffer);
  const readyRef = useRef(onChannelReady);

  useEffect(() => {
    handlerRef.current = onNewOffer;
    readyRef.current = onChannelReady;
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !driverId) return undefined;

    const channel = attachRealtimeStatus(
      supabase
        .channel(`courier-offers-${driverId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'courier_offers',
            filter: `driver_id=eq.${driverId}`,
          },
          (payload) => {
            handlerRef.current?.(payload.new);
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'courier_offers',
            filter: `driver_id=eq.${driverId}`,
          },
          (payload) => {
            if (payload.new?.status === 'pending') {
              handlerRef.current?.(payload.new);
            }
          },
        ),
      `courier-offers-${driverId}`,
      { onSubscribed: () => readyRef.current?.() },
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId]);
}
