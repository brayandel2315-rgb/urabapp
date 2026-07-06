import { useQuery } from '@tanstack/react-query';
import { getZoneCoverage } from '../../../services/admin.service';
import { PHASE_2_KPIS } from '../../../utils/constants';
import Loader from '../../../components/ui/Loader';
import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { StatusBadge } from '@/design-system/patterns/MetricCard';

export default function AdminZonesPanel() {
  const { data: zones = [], isLoading } = useQuery({
    queryKey: ['admin-zone-coverage'],
    queryFn: getZoneCoverage,
    refetchInterval: 60_000,
  });

  const readyCount = zones.filter((z) => z.ready).length;
  const totalBusinesses = zones.reduce((s, z) => s + z.businesses, 0);

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader /></div>;
  }

  return (
    <SurfaceCard className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-tagline text-muted">Fase 2</p>
          <SectionTitle>Cobertura por municipio</SectionTitle>
          <p className="mt-1 text-xs text-muted">
            Meta: {PHASE_2_KPIS.businesses} comercios · {readyCount}/{zones.length} zonas operativas
          </p>
        </div>
        <StatusBadge status={totalBusinesses >= PHASE_2_KPIS.businesses ? 'success' : 'warning'}>
          {totalBusinesses} tiendas activas
        </StatusBadge>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {zones.map((zone) => (
          <div
            key={zone.municipio}
            className={`rounded-xl p-3 text-sm ${zone.ready ? 'bg-primary-light/30 ring-1 ring-primary/20' : 'bg-background'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-secondary">{zone.municipio}</p>
              {zone.ready && <AppIcon name="check" size="xs" className="text-primary" />}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted">
              <span>Tiendas: <strong className="text-foreground">{zone.businesses}</strong></span>
              <span>Publicadas: <strong className="text-foreground">{zone.published}</strong></span>
              <span>Mensajeros: <strong className="text-foreground">{zone.drivers}</strong></span>
              <span>En línea: <strong className="text-foreground">{zone.onlineRiders}</strong></span>
              <span className="col-span-2">Pedidos: <strong className="text-foreground">{zone.orders}</strong></span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted">
        Zona operativa = 3+ tiendas y al menos 1 mensajero. Envíos intermunicipales en pestaña Envíos.
      </p>
    </SurfaceCard>
  );
}
