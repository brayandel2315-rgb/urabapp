import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { attachRealtimeStatus } from './realtimeSubscribe';

export function useAdminOrdersRealtime(enabled = true) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !isSupabaseConfigured) return undefined;

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-kpis'] });
    };

    const channel = attachRealtimeStatus(
      supabase
        .channel('admin-orders-live')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          () => invalidate(),
        ),
      'admin-orders-live',
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, queryClient]);
}
