import { useQuery } from '@tanstack/react-query';
import { getCommunicationBadgeCount } from '@/communication/badge.service';

/** Contador unificado para header y bottom nav. */
export function useCommunicationBadge(userId) {
  const { data: count = 0 } = useQuery({
    queryKey: ['comm-badge', userId],
    queryFn: () => getCommunicationBadgeCount(userId),
    enabled: !!userId,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
  return count;
}
