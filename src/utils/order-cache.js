/** Sincroniza el estado del pedido en React Query tras cambios de status. */
export function patchOrderStatusInCache(queryClient, orderId, status, userId, extra = {}) {
  if (!orderId || !status) return;

  const now = new Date().toISOString();
  const patch = { status, ...extra };
  if (status === 'cancelled' && !patch.cancelled_at) {
    patch.cancelled_at = now;
  }

  queryClient.setQueriesData({ queryKey: ['order', orderId] }, (old) => (
    old ? { ...old, ...patch } : old
  ));

  if (userId) {
    queryClient.setQueryData(['orders', userId], (old) => {
      if (!Array.isArray(old)) return old;
      return old.map((o) => (o.id === orderId ? { ...o, ...patch } : o));
    });
  }
}

export function invalidateOrderQueries(queryClient, orderId, userId) {
  queryClient.invalidateQueries({ queryKey: ['order', orderId] });
  if (userId) {
    queryClient.invalidateQueries({ queryKey: ['orders', userId] });
  }
}
