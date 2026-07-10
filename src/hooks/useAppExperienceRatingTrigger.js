import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useClientActivity } from '@/hooks/useClientActivity';
import { useAppExperienceRatingStore } from '@/store/appExperienceRatingStore';
import { findEligibleAppRatingDelivery } from '@/utils/app-experience-rating';

/** Dispara la calificación de app cuando el cliente termina de recibir un pedido/envío. */
export function useAppExperienceRatingTrigger() {
  const user = useAuthStore((s) => s.user);
  const requestRating = useAppExperienceRatingStore((s) => s.requestRating);
  const { orders, shipments, activeCount, isLoading } = useClientActivity({
    enabled: !!user?.id,
    refetchInterval: 12_000,
  });
  const prevActiveRef = useRef(null);

  useEffect(() => {
    if (!user?.id || isLoading) return;

    const prevActive = prevActiveRef.current;
    prevActiveRef.current = activeCount;

    if (activeCount > 0) return;

    const justFinished = prevActive != null && prevActive > 0;
    const eligible = findEligibleAppRatingDelivery(orders, shipments);
    if (!eligible) return;

    if (justFinished) {
      requestRating(eligible);
    }
  }, [activeCount, isLoading, orders, shipments, requestRating, user?.id]);
}
