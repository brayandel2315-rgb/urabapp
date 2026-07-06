import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { Badge } from '@/design-system/ui/badge';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { getOrdersByCustomer } from '@/services/order.service';
import { getCustomerShipments } from '@/services/shipment.service';
import { isCourierOrder } from '@/services/courier.service';
import { formatCOP } from '@/utils/currency';

const SERVICE_LABEL = {
  food: 'Comida',
  courier: 'Mensajería',
  shipment: 'Envío',
};

function buildBillingEntries(orders, shipments) {
  const orderEntries = orders
    .filter((o) => o.status === 'delivered')
    .map((o) => ({
      id: `o-${o.id}`,
      service: isCourierOrder(o) ? 'courier' : 'food',
      label: o.order_number || o.id.slice(0, 8),
      date: o.delivered_at || o.created_at,
      amount: o.total,
      href: `/pedidos/${o.id}`,
    }));

  const shipmentEntries = shipments
    .filter((s) => ['delivered', 'completed'].includes(s.status))
    .map((s) => ({
      id: `s-${s.id}`,
      service: 'shipment',
      label: s.shipment_number || s.id.slice(0, 8),
      date: s.delivered_at || s.created_at,
      amount: s.total_cop,
      href: `/envios/${s.id}`,
    }));

  return [...orderEntries, ...shipmentEntries]
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default function AccountBillingPage() {
  const { user } = useAuthStore();

  const { data: orders = [] } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => getOrdersByCustomer(user.id),
    enabled: !!user?.id,
  });

  const { data: shipments = [] } = useQuery({
    queryKey: ['shipments', user?.id],
    queryFn: () => getCustomerShipments(user.id),
    enabled: !!user?.id,
  });

  const entries = useMemo(() => buildBillingEntries(orders, shipments), [orders, shipments]);
  const totalSpent = useMemo(
    () => entries.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [entries]
  );

  if (!user) return <p className="text-sm text-muted-foreground">Inicia sesión para ver facturación.</p>;

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Facturación unificada</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Comprobantes de comida, mensajería y envíos intermunicipales entregados.
          Para factura electrónica formal, contacta soporte con el número de referencia.
        </p>
        {entries.length > 0 && (
          <p className="rounded-xl bg-muted/40 px-3 py-2 text-sm">
            Total registrado: <strong>{formatCOP(totalSpent)}</strong>
            {' · '}
            {entries.length} servicio(s)
          </p>
        )}
        {entries.length === 0 ? (
          <p className="text-sm">Aún no tienes servicios entregados.</p>
        ) : (
          <ul className="divide-y divide-border">
            {entries.slice(0, 30).map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={entry.service === 'shipment' ? 'warning' : entry.service === 'courier' ? 'success' : 'secondary'}>
                      {SERVICE_LABEL[entry.service]}
                    </Badge>
                    <p className="font-medium">{entry.label}</p>
                  </div>
                  <p className="text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold">{formatCOP(entry.amount)}</p>
                  <Link to={entry.href} className="text-xs text-primary">Ver detalle</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link to="/pedidos?tab=history">
          <Button variant="outline" className="w-full sm:w-auto">Ver historial completo</Button>
        </Link>
      </SurfaceCard>
    </div>
  );
}
