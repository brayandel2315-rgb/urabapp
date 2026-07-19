import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { getUserAddresses } from '@/services/address.service';
import { pickDefaultDeliveryAddress } from '@/utils/delivery-address';
import { isRealAuthenticatedUser } from '@/utils/auth-session';

/**
 * Cualquier cuenta autenticada sin dirección de casa completa
 * debe registrarla antes de continuar con pedidos.
 */
export function useClientAddressGate() {
  const user = useAuthStore((s) => s.user);
  const authed = isRealAuthenticatedUser(user);

  const query = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => getUserAddresses(user.id),
    enabled: !!user?.id && authed,
    staleTime: 30_000,
  });

  const addresses = query.data ?? [];
  const homeAddress = pickDefaultDeliveryAddress(addresses);
  const isFetched = !authed || query.isFetched;
  const needsAddress = authed && isFetched && !homeAddress;
  const hasCompleteAddress = authed && isFetched && Boolean(homeAddress);

  return {
    authed,
    needsAddress,
    hasCompleteAddress,
    homeAddress,
    addresses,
    isLoading: authed && (query.isLoading || query.isFetching) && !query.isFetched,
    isFetched,
    refetch: query.refetch,
  };
}
