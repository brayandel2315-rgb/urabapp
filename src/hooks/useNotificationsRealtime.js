import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { toast } from '../utils/toast';
import { attachRealtimeStatus } from './realtimeSubscribe';
import { notificationDeepLink } from '@/communication/inbox.service';
import {
  resolveNotifImage,
  resolveNotifKind,
  resolveNotifLogo,
} from '@/communication/notification-visuals';

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
            if (!row?.title) return;

            const kind = resolveNotifKind({
              type: row.type,
              category: row.category,
              eventKey: row.data?.event_key,
              stage: row.data?.stage || row.data?.milestone || row.data?.eventType,
            });
            const href = notificationDeepLink(row);
            const image = resolveNotifImage(row);
            const logo = resolveNotifLogo(row);

            const base = {
              title: row.title,
              description: row.body || undefined,
              image,
              logo,
              href,
              kind,
              category: row.category,
              eventKey: row.data?.event_key,
              stage: row.data?.stage || row.data?.milestone || row.data?.eventType,
              eventType: row.data?.eventType,
              id: `notif-${row.id}`,
            };

            if (kind === 'cart') {
              toast.cart(row.title, base);
            } else if (kind === 'tracking') {
              toast.tracking(row.title, base);
            } else if (kind === 'order' || kind === 'shipment') {
              toast.order(row.title, base);
            } else if (row.priority === 'critical' || row.priority === 'high') {
              toast.warning(row.title, base);
            } else {
              toast.info(row.title, base);
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
