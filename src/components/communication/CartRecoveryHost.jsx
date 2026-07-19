import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getMyAbandonedCart, recoverAbandonedCartInApp } from '@/services/crm.service';
import { useCommunicationBannerStore } from '@/store/communicationBannerStore';
import { formatCOP } from '@/utils/currency';

const SESSION_KEY = 'urabapp_cart_nudge_session';
const MIN_IDLE_MS = 8 * 60 * 1000; // 8 min desde última edición del carrito
const HOME_DELAY_MS = 2200;

/**
 * Al volver a la app / inicio: si hay carrito abandonado, dispara
 * recuperación potente (banner + in-app + push vía emit).
 */
export default function CartRecoveryHost() {
  const user = useAuthStore((s) => s.user);
  const { pathname } = useLocation();
  const showBanner = useCommunicationBannerStore((s) => s.show);
  const firedRef = useRef(false);

  const { data: abandoned } = useQuery({
    queryKey: ['my-abandoned-cart', user?.id],
    queryFn: () => getMyAbandonedCart(user.id),
    enabled: !!user?.id,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!user?.id || !abandoned?.id || firedRef.current) return undefined;
    if (pathname.startsWith('/carrito') || pathname.startsWith('/checkout')) return undefined;
    if (pathname.startsWith('/tienda/')) return undefined;

    const updatedAt = abandoned.updated_at ? new Date(abandoned.updated_at).getTime() : 0;
    if (updatedAt && Date.now() - updatedAt < MIN_IDLE_MS) return undefined;

    const sessionKey = `${SESSION_KEY}:${abandoned.id}`;
    try {
      if (sessionStorage.getItem(sessionKey)) return undefined;
    } catch {
      /* ignore */
    }

    const onHome = pathname === '/' || pathname === '';
    const delay = onHome ? HOME_DELAY_MS : 4500;

    const timer = window.setTimeout(async () => {
      if (firedRef.current) return;
      firedRef.current = true;
      try {
        sessionStorage.setItem(sessionKey, String(Date.now()));
      } catch {
        /* ignore */
      }

      const stage = (abandoned.nudge_count || 0) >= 2
        ? 'urgent'
        : (abandoned.nudge_count || 0) === 1
          ? 'return'
          : 'nudge';

      const store = abandoned.business_name || 'tu tienda';
      const total = formatCOP(abandoned.subtotal || 0);
      const url = abandoned.business_id ? `/tienda/${abandoned.business_id}` : '/carrito';
      const items = Array.isArray(abandoned.items_json) ? abandoned.items_json : [];
      const imageUrl = items.find((i) => i?.image_url || i?.imageUrl || i?.image)?.image_url
        || items.find((i) => i?.image_url || i?.imageUrl || i?.image)?.imageUrl
        || items.find((i) => i?.image)?.image
        || null;

      showBanner({
        title: stage === 'urgent' ? 'Tu pedido está a un toque' : `¿Seguimos con ${store}?`,
        body: `Tienes ${total} listos para pedir. Completa ahora y te llega a domicilio.`,
        deepLink: url,
        kind: 'cart',
        stage,
        imageUrl,
        ctaLabel: 'Completar pedido',
      });

      await recoverAbandonedCartInApp(abandoned, { stage }).catch(() => {});
    }, delay);

    return () => window.clearTimeout(timer);
  }, [user?.id, abandoned, pathname, showBanner]);

  return null;
}
