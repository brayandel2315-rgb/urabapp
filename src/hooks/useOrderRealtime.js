import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { attachRealtimeStatus } from './realtimeSubscribe';

export function useOrderRealtime(orderId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!orderId || !isSupabaseConfigured || orderId.startsWith('local-')) return undefined;

    const channel = attachRealtimeStatus(
      supabase
        .channel(`order-${orderId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
          () => {
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
          },
        ),
      `order-${orderId}`,
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, queryClient]);
}

export function useOrdersPolling(userId, enabled = true) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId || !enabled || !isSupabaseConfigured) return undefined;

    const channel = attachRealtimeStatus(
      supabase
        .channel(`customer-orders-${userId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders', filter: `customer_id=eq.${userId}` },
          () => {
            queryClient.invalidateQueries({ queryKey: ['orders', userId] });
          },
        ),
      `customer-orders-${userId}`,
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, enabled, queryClient]);
}
