import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AppIcon from '@/design-system/icons/AppIcon';
import { Badge } from '@/design-system/ui/badge';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import CartStoreSwitchModal from '@/components/cart/CartStoreSwitchModal';
import { ORDER_STATUS_LABELS } from '../utils/constants';
import { ORDER_STATUS_VARIANT } from '../utils/order-display';
import { formatCOP } from '../utils/currency';
import { STORE } from '../utils/marketplace-copy';
import { canCustomerCancelOrder, orderItemsToCartLines } from '../utils/order-client';
import { patchOrderStatusInCache, invalidateOrderQueries } from '../utils/order-cache';
import { cancelOrderByCustomer } from '../services/order.service';
import { getBusinessById } from '../services/business.service';
import { useCartStore } from '../store/cartStore';
import { isCourierOrder } from '../services/courier.service';
import { toast } from '../utils/toast';

const STATUS_VARIANT = ORDER_STATUS_VARIANT;

export default function OrderCard({ order, userId }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [storeConflict, setStoreConflict] = useState(null);
  const pendingReorderRef = useRef(null);
  const setCartFromReorder = useCartStore((s) => s.setCartFromReorder);
  const isCourier = isCourierOrder(order);
  const variant = STATUS_VARIANT[order.status] || 'muted';
  const canCancel = canCustomerCancelOrder(order, userId);
  const canReorder = !isCourier && ['delivered', 'cancelled'].includes(order.status) && order.order_items?.length;

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrderByCustomer(order.id, userId),
    onMutate: () => {
      setConfirmCancel(false);
      patchOrderStatusInCache(queryClient, order.id, 'cancelled', userId);
      return { previous: queryClient.getQueryData(['orders', userId]) };
    },
    onSuccess: (updated) => {
      if (updated) {
        patchOrderStatusInCache(queryClient, order.id, 'cancelled', userId, updated);
        queryClient.setQueriesData({ queryKey: ['order', order.id] }, updated);
      }
      invalidateOrderQueries(queryClient, order.id, userId);
      toast('Pedido cancelado');
      navigate(`/pedidos/${order.id}`);
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['orders', userId], ctx.previous);
      }
      toast(err.message, 'error');
    },
  });

  const finishReorder = (business, lines, options = {}) => {
    const result = setCartFromReorder(business, lines, options);
    if (result.conflict) {
      pendingReorderRef.current = { business, lines };
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

  const handleReorder = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!order.business_id) {
      toast('No se puede repetir este pedido', 'error');
      return;
    }
    try {
      const business = await getBusinessById(order.business_id);
      if (!business) {
        toast('La tienda ya no está disponible', 'error');
        return;
      }
      const lines = orderItemsToCartLines(order.order_items);
      finishReorder(business, lines);
    } catch (err) {
      toast(err.message || 'No se pudo repetir el pedido', 'error');
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmCancel(true);
  };

  return (
    <>
    <Link
      to={`/pedidos/${order.id}`}
      className="block overflow-hidden rounded-2xl border border-[#D5E3EF] bg-white p-4 shadow-card transition-all hover:shadow-lift active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isCourier && <Badge variant="success">Mensajería</Badge>}
          <p className="text-xs font-bold uppercase tracking-wide text-[#4A6278]">
            {order.order_number || `#${String(order.id).slice(0, 8)}`}
          </p>
        </div>
        <Badge variant={variant}>{ORDER_STATUS_LABELS[order.status] || order.status}</Badge>
      </div>
      <p className="mt-2 font-display text-xl font-bold text-[#0D2B45]">{formatCOP(order.total)}</p>
      <p className="mt-1 line-clamp-2 text-sm text-[#4A6278]">
        {isCourier ? `${order.pickup_address || 'Recogida'} → ${order.dest_address}` : order.dest_address}
      </p>
      {(canCancel || canReorder) && (
        <div className="mt-3 flex flex-wrap gap-2" onClick={(e) => e.preventDefault()}>
          {canReorder && (
            <Button type="button" size="sm" variant="outline" onClick={handleReorder}>
              Volver a pedir
            </Button>
          )}
          {canCancel && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-destructive"
              disabled={cancelMutation.isPending || order.status === 'cancelled'}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          )}
        </div>
      )}
      <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
        Ver detalle
        <AppIcon name="link" size="xs" />
      </p>
    </Link>

    <ConfirmModal
      open={confirmCancel && canCancel}
      onClose={() => setConfirmCancel(false)}
      title="¿Cancelar pedido?"
      message={`La ${STORE.oneLower} y el mensajero serán notificados si aplica.`}
      confirmLabel="Sí, cancelar"
      loading={cancelMutation.isPending}
      onConfirm={() => {
        if (!canCancel || cancelMutation.isPending) return;
        cancelMutation.mutate();
      }}
    />

    <CartStoreSwitchModal
      open={Boolean(storeConflict)}
      conflict={storeConflict}
      onClose={() => {
        pendingReorderRef.current = null;
        setStoreConflict(null);
      }}
      onConfirm={() => {
        const pending = pendingReorderRef.current;
        pendingReorderRef.current = null;
        setStoreConflict(null);
        if (pending) finishReorder(pending.business, pending.lines, { replaceCart: true });
      }}
    />
    </>
  );
}
