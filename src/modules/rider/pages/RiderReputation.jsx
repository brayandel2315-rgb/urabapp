import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import PanelHeader from '@/design-system/patterns/PanelHeader';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { MetricCard, MetricGrid } from '@/design-system/patterns/MetricCard';
import { useMyDriverProfile } from '@/hooks/useMyDriverProfile';
import { renderRiderProfileGate } from '../components/RiderProfileGate';
import { getCourierReputation } from '@/services/courier-panel.service';
import { getCourierLevel } from '../constants';
import RiderLeaderboard from '@/components/RiderLeaderboard';
import { getRiderLeaderboard } from '@/services/rider.service';

export default function RiderReputation() {
  const driverQuery = useMyDriverProfile();
  const { data: driver } = driverQuery;

  const { data: rep } = useQuery({
    queryKey: ['courier-reputation', driver?.id],
    queryFn: getCourierReputation,
    enabled: !!driver?.id,
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ['rider-leaderboard', driver?.municipio],
    queryFn: () => getRiderLeaderboard({ municipio: driver?.municipio, limit: 5 }),
    enabled: !!driver?.municipio,
  });

  const level = getCourierLevel(rep?.total_deliveries ?? driver?.total_deliveries ?? 0);

  const blocked = renderRiderProfileGate(driverQuery, { compactMissing: true });
  if (blocked) return blocked;

  return (
    <div className="space-y-4">
      <PanelHeader tag="Reputación" title={`Nivel ${level.name}`} subtitle="Tu desempeño en UrabApp" />

      <MetricGrid className="grid-cols-2">
        <MetricCard label="Calificación" value={Number(rep?.rating ?? driver?.rating ?? 5).toFixed(1)} icon="star" accent />
        <MetricCard label="Aceptación" value={`${Number(rep?.acceptance_rate ?? 100).toFixed(0)}%`} icon="check" />
        <MetricCard label="Finalización" value={`${Number(rep?.completion_rate ?? 100).toFixed(0)}%`} icon="package" />
        <MetricCard label="Puntualidad" value={`${Number(rep?.punctuality_score ?? 100).toFixed(0)}%`} icon="clock" />
      </MetricGrid>

      <SurfaceCard>
        <SectionTitle>Ofertas</SectionTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          Aceptadas: {rep?.offers_accepted ?? 0} · Rechazadas: {rep?.offers_rejected ?? 0}
        </p>
        {(rep?.incident_count ?? 0) > 0 && (
          <p className="mt-1 text-sm text-destructive">Incidentes reportados: {rep.incident_count}</p>
        )}
      </SurfaceCard>

      <SurfaceCard>
        <SectionTitle>Cómo mejorar</SectionTitle>
        <ul className="mt-3 space-y-2">
          {(rep?.tips ?? []).map((tip) => (
            <li key={tip.key} className="rounded-xl bg-primary/5 px-3 py-2 text-sm text-foreground">
              {tip.label}
            </li>
          ))}
        </ul>
      </SurfaceCard>

      <SurfaceCard>
        <SectionTitle>Ranking {driver?.municipio}</SectionTitle>
        <RiderLeaderboard riders={leaderboard} highlightId={driver?.id} compact />
      </SurfaceCard>

      <Link to="/domiciliario">
        <Button variant="outline" className="w-full">Volver a entregas</Button>
      </Link>
    </div>
  );
}
