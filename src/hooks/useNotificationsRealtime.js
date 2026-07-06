import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { toast } from '../utils/toast';
import { attachRealtimeStatus } from './realtimeSubscribe';

export function useNotificationsRealtime(userId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId || !isSupabaseConfigured) return undefined;

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['comm-badge', userId] });
      queryClient.invalidateQueries({ queryKey: ['comm-stats', userId] });
    };

    const channel = attachRealtimeStatus(
      supabase
        .channel(`notifications-${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            invalidate();
            const row = payload.new;
            if (row?.title) {
              toast(row.body ? `${row.title} — ${row.body}` : row.title, 'info');
            }
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          () => invalidate(),
        ),
      `notifications-${userId}`,
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}

export function useUnreadNotificationsCount(userId) {
  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData(['notifications', userId]);
  if (!Array.isArray(cached)) return 0;
  return cached.filter((n) => !n.is_read).length;
}
