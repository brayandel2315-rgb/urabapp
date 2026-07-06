import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { attachRealtimeStatus } from './realtimeSubscribe';

const REFRESH_MS = 8000;

/** Realtime + polling fallback — tracking:update / tracking:status */
export function useShipmentRealtime(shipmentId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!shipmentId || !isSupabaseConfigured) return undefined;

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ['shipment', shipmentId] });
      queryClient.invalidateQueries({ queryKey: ['shipment-events', shipmentId] });
      queryClient.invalidateQueries({ queryKey: ['shipment-tracking', shipmentId] });
    };

    const channel = attachRealtimeStatus(
      supabase
        .channel(`shipment-${shipmentId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'shipment_orders', filter: `id=eq.${shipmentId}` },
          invalidate,
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'shipment_events', filter: `shipment_id=eq.${shipmentId}` },
          invalidate,
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'shipment_tracking', filter: `shipment_id=eq.${shipmentId}` },
          invalidate,
        ),
      `shipment-${shipmentId}`,
    );

    const poll = setInterval(invalidate, REFRESH_MS);

    return () => {
      clearInterval(poll);
      supabase.removeChannel(channel);
    };
  }, [shipmentId, queryClient]);
}

export function useShipmentsAdminRealtime(enabled = true) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !isSupabaseConfigured) return undefined;

    const channel = attachRealtimeStatus(
      supabase
        .channel('admin-shipments')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'shipment_orders' },
          () => {
            queryClient.invalidateQueries({ queryKey: ['admin-shipments'] });
            queryClient.invalidateQueries({ queryKey: ['shipment-operator-stats'] });
          },
        ),
      'admin-shipments',
    );

    return () => supabase.removeChannel(channel);
  }, [enabled, queryClient]);
}
