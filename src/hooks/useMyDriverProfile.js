import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { getMyDriverProfile } from '@/services/rider.service';

export function useMyDriverProfile() {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: ['my-driver', userId],
    queryFn: () => getMyDriverProfile(userId),
    enabled: Boolean(userId),
    retry: 2,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: true,
  });
}
