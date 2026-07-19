import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useLocationStore } from '../store/locationStore';
import { upsertAbandonedCart, clearAbandonedCart } from '../services/crm.service';

const DEBOUNCE_MS = 3000;

export function useAbandonedCartSync() {
  const { user } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const businessId = useCartStore((s) => s.businessId);
  const businessName = useCartStore((s) => s.businessName);
  const businessLogo = useCartStore((s) => s.businessLogo);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const municipio = useLocationStore((s) => s.municipio);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return undefined;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!items.length) {
      clearAbandonedCart(user.id).catch(() => {});
      return undefined;
    }

    timerRef.current = setTimeout(() => {
      upsertAbandonedCart({
        userId: user.id,
        businessId,
        businessName,
        businessLogo,
        items,
        subtotal: getSubtotal(),
        municipio,
      }).catch(() => {});
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user?.id, items, businessId, businessName, businessLogo, getSubtotal, municipio]);
}

export default function AbandonedCartSync() {
  useAbandonedCartSync();
  return null;
}
