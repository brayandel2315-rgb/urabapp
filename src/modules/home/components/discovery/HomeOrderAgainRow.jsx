import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AppIcon from '@/design-system/icons/AppIcon';
import { Button } from '@/design-system/ui/button';
import CartStoreSwitchModal from '@/components/cart/CartStoreSwitchModal';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import { getOrdersByCustomer } from '@/services/order.service';
import { getBusinessById } from '@/services/business.service';
import { orderItemsToCartLines } from '@/utils/order-client';
import { useCartStore } from '@/store/cartStore';
import { formatCOP } from '@/utils/currency';
import { cn } from '@/lib/utils';
import { toast } from '@/utils/toast';

function pickReorderCandidates(orders = [], limit = 6) {
  const seen = new Set();
  const out = [];
  for (const order of orders) {
    if (!['delivered', 'cancelled'].includes(order.status)) continue;
    if (!order.business_id || !order.order_items?.length) continue;
    if (seen.has(order.business_id)) continue;
    seen.add(order.business_id);
    out.push(order);
    if (out.length >= limit) break;
  }
  return out;
}

export default function HomeOrderAgainRow({ userId, className }) {
  const navigate = useNavigate();
  const setCartFromReorder = useCartStore((s) => s.setCartFromReorder);
  const [storeConflict, setStoreConflict] = useState(null);
  const pendingRef = useRef(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['home-order-again', userId],
    queryFn: () => getOrdersByCustomer(userId),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  const candidates = pickReorderCandidates(orders);

  const finishReorder = (business, lines, options = {}) => {
    const result = setCartFromReorder(business, lines, options);
    if (result.conflict) {
      pendingRef.current = { business, lines };
      setStoreConflict(result.conflict);
      return;
    }
    if (result.error) {
      toast(result.error, 'error');
      return;
    }
    toast('Productos agregados al carrito');
    navigate('/carrito');
  };

  const handleReorder = async (order) => {
    try {
      const business = await getBusinessById(order.business_id);
      if (!business) {
        toast('La tienda ya no está disponible', 'error');
        return;
      }
      finishReorder(business, orderItemsToCartLines(order.order_items));
    } catch (err) {
      toast(err.message || 'No se pudo repetir el pedido', 'error');
    }
  };

  if (!userId || isLoading || candidates.length === 0) return null;

  return (
    <section className={cn('home-order-again', className)} aria-labelledby="home-order-again-title">
      <HomeSectionHeader
        id="home-order-again-title"
        title="Pedir de nuevo"
        subtitle="Tus pedidos recientes en un toque"
        variant="brand"
        aside={(
          <Link to="/pedidos" className="text-sm font-semibold text-primary hover:underline">
            Ver historial
          </Link>
        )}
      />

      <div className="home-order-again__rail">
        {candidates.map((order) => {
          const name = order.businesses?.name || 'Tu tienda';
          const itemCount = order.order_items?.length || 0;
          return (
            <article key={order.id} className="home-order-again__card">
              <Link to={`/business/${order.business_id}`} className="home-order-again__store">
                <span className="home-order-again__icon" aria-hidden>
                  <AppIcon name="bag" size={18} className="text-primary" />
                </span>
                <div className="min-w-0">
                  <p className="home-order-again__name truncate">{name}</p>
                  <p className="home-order-again__meta truncate">
                    {itemCount} producto{itemCount !== 1 ? 's' : ''}
                    {order.total != null ? ` · ${formatCOP(order.total)}` : ''}
                  </p>
                </div>
              </Link>
              <Button
                type="button"
                size="sm"
                className="home-order-again__cta"
                onClick={() => handleReorder(order)}
              >
                Pedir de nuevo
              </Button>
            </article>
          );
        })}
      </div>

      <CartStoreSwitchModal
        open={Boolean(storeConflict)}
        conflict={storeConflict}
        onClose={() => {
          setStoreConflict(null);
          pendingRef.current = null;
        }}
        onConfirm={() => {
          const pending = pendingRef.current;
          setStoreConflict(null);
          pendingRef.current = null;
          if (pending) finishReorder(pending.business, pending.lines, { replaceCart: true });
        }}
      />
    </section>
  );
}
