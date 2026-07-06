import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { invalidateBusinessOrderQueries } from '../utils/order-display';
import { attachRealtimeStatus } from './realtimeSubscribe';

/** Pedidos del comercio en tiempo real */
export function useBusinessOrdersRealtime(businessId, enabled = true) {
  const queryClient = useQueryClient();
  const invalidateRef = useRef(() => {
    invalidateBusinessOrderQueries(queryClient, businessId);
  });

  useEffect(() => {
    invalidateRef.current = () => invalidateBusinessOrderQueries(queryClient, businessId);
  });

  useEffect(() => {
    if (!enabled || !businessId || !isSupabaseConfigured) return undefined;

    const channel = attachRealtimeStatus(
      supabase
        .channel(`business-orders-${businessId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `business_id=eq.${businessId}`,
          },
          () => invalidateRef.current(),
        ),
      `business-orders-${businessId}`,
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, enabled, queryClient]);
}
