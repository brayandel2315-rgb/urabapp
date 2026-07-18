import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import ShipmentCard from '@/modules/client/components/ShipmentCard';
import { useAuthStore } from '@/store/authStore';
import { getCustomerShipments } from '@/services/shipment.service';
import { SHIPMENT_STATUS } from '@/data/shipment-catalog';
import { buildLoginRedirect } from '@/utils/auth-routes';

const TERMINAL = new Set(['delivered', 'completed', 'cancelled']);

export default function CustomerShipmentsPanel({ onNewShipment, className }) {
  const { user } = useAuthStore();

  const { data: shipments = [], isLoading } = useQuery({
    queryKey: ['shipments', user?.id],
    queryFn: () => getCustomerShipments(user.id),
    enabled: !!user?.id,
    staleTime: 20_000,
  });

  const active = shipments.filter((s) => !TERMINAL.has(s.status));
  const history = shipments.filter((s) => TERMINAL.has(s.status));

  if (!user) {
    return (
      <SurfaceCard className={`space-y-3 p-5 ${className || ''}`}>
        <SectionTitle>Mis envíos</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Inicia sesión para ver envíos activos e historial.
        </p>
        <Link to={buildLoginRedirect('/envios')}>
          <Button size="sm">Entrar</Button>
        </Link>
      </SurfaceCard>
    );
  }

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {active.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-secondary">Envíos en curso</h2>
            <Link to="/pedidos" className="text-xs font-bold text-primary">Ver todo</Link>
          </div>
          <div className="space-y-3">
            {active.map((s) => (
              <ShipmentCard key={s.id} shipment={s} />
            ))}
          </div>
        </section>
      )}

      <SurfaceCard className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <SectionTitle>Mis envíos</SectionTitle>
          {onNewShipment && (
            <Button type="button" size="sm" onClick={onNewShipment}>
              Nuevo envío
            </Button>
          )}
        </div>
        {isLoading ? (
          <Loader variant="section" message="Cargando envíos…" className="min-h-[8rem]" />
        ) : shipments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no tienes envíos. Cotiza una ruta intermunicipal y sigue el paquete desde aquí.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {(history.length > 0 ? history : shipments).slice(0, 5).map((s) => (
              <li key={s.id}>
                <Link
                  to={`/envios/${s.id}`}
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5 transition hover:border-primary/30"
                >
                  <span className="font-medium">
                    {s.origin_municipio} → {s.dest_municipio}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {SHIPMENT_STATUS[s.status] || s.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {shipments.length > 0 && (
          <Link to="/pedidos" className="block text-center text-xs font-bold text-primary">
            Ver todos mis pedidos y envíos
          </Link>
        )}
      </SurfaceCard>
    </div>
  );
}
