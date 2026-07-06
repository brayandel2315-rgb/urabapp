import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { attachRealtimeStatus } from './realtimeSubscribe';

/**
 * Escucha nuevos eventos de tracking en tiempo real.
 */
export function useOrderEventsRealtime(orderId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSupabaseConfigured || !orderId) return undefined;

    const channel = attachRealtimeStatus(
      supabase
        .channel(`order-events:${orderId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'order_events',
            filter: `order_id=eq.${orderId}`,
          },
          (payload) => {
            queryClient.setQueryData(['order-events', orderId], (old = []) => {
              const exists = old.some((e) => e.id === payload.new?.id);
              if (exists) return old;
              return [...old, payload.new];
            });
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
          },
        ),
      `order-events:${orderId}`,
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, queryClient]);
}
