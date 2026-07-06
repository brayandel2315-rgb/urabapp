import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { attachRealtimeStatus } from './realtimeSubscribe';

export function useSupportMessagesRealtime(ticketId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!ticketId || !isSupabaseConfigured) return undefined;

    const channel = attachRealtimeStatus(
      supabase
        .channel(`support-messages-${ticketId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'support_messages',
            filter: `ticket_id=eq.${ticketId}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['support-messages', ticketId] });
          },
        ),
      `support-messages-${ticketId}`,
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId, queryClient]);
}

export function useOrderMessagesRealtime(orderId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!orderId || !isSupabaseConfigured) return undefined;

    const channel = attachRealtimeStatus(
      supabase
        .channel(`order-messages-${orderId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'order_messages',
            filter: `order_id=eq.${orderId}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['order-messages', orderId] });
          },
        ),
      `order-messages-${orderId}`,
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, queryClient]);
}
