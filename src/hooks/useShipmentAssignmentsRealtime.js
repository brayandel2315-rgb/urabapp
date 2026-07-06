import { useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { attachRealtimeStatus } from './realtimeSubscribe';

/** Ofertas de envío intermunicipal en tiempo real */
export function useShipmentAssignmentsRealtime(driverId, onNewAssignment) {
  const handlerRef = useRef(onNewAssignment);

  useEffect(() => {
    handlerRef.current = onNewAssignment;
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !driverId) return undefined;

    const channel = attachRealtimeStatus(
      supabase
        .channel(`shipment-assignments-${driverId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'shipment_assignments',
            filter: `driver_id=eq.${driverId}`,
          },
          (payload) => {
            handlerRef.current?.(payload.new);
          },
        ),
      `shipment-assignments-${driverId}`,
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId]);
}
