import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { attachRealtimeStatus } from './realtimeSubscribe';

const DEBOUNCE_MS = 2_000;

/**
 * Refresco suave del marketplace — debounce para evitar tormenta de invalidaciones
 * cuando hay muchos pedidos en la plataforma.
 */
export function useMarketplaceLiveRefresh(municipio) {
  const queryClient = useQueryClient();
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    const scheduleRefresh = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['marketplace-pulse', municipio] });
        queryClient.invalidateQueries({ queryKey: ['home-discovery', municipio] });
        queryClient.invalidateQueries({ queryKey: ['businesses'] });
        queryClient.invalidateQueries({ queryKey: ['offers-feed'] });
        queryClient.invalidateQueries({ queryKey: ['offers-feed-preview'] });
      }, DEBOUNCE_MS);
    };

    const channel = attachRealtimeStatus(
      supabase
        .channel(`marketplace-pulse-${municipio || 'all'}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders' },
          scheduleRefresh,
        ),
      `marketplace-pulse-${municipio || 'all'}`,
    );

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      supabase.removeChannel(channel);
    };
  }, [municipio, queryClient]);
}
