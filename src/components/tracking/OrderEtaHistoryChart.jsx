import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getOrderEtaHistory } from '@/services/order-tracking.service';

function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

export default function OrderEtaHistoryChart({ orderId, compact = false }) {
  const { data: snapshots = [], isLoading } = useQuery({
    queryKey: ['order-eta-history', orderId],
    queryFn: () => getOrderEtaHistory(orderId),
    enabled: Boolean(orderId),
    refetchInterval: 20_000,
  });

  const chartData = useMemo(
    () => [...snapshots]
      .reverse()
      .map((s) => ({
        time: formatTime(s.recorded_at),
        etaMin: s.eta_seconds != null ? Math.round(s.eta_seconds / 60) : null,
        distanceKm: s.distance_km != null ? Number(s.distance_km) : null,
      })),
    [snapshots],
  );

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando histórico ETA…</p>;
  }

  if (!chartData.length) {
    return (
      <p className="text-sm text-muted-foreground">
        El histórico ETA aparecerá cuando el repartidor comparta ubicación.
      </p>
    );
  }

  return (
    <div className={compact ? 'h-40' : 'h-52'}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="time" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10 }} unit=" min" width={36} />
          <Tooltip
            formatter={(value, name) => [
              name === 'etaMin' ? `${value} min` : `${value} km`,
              name === 'etaMin' ? 'ETA' : 'Distancia',
            ]}
          />
          <Line type="monotone" dataKey="etaMin" stroke="#1C8238" strokeWidth={2} dot={false} name="etaMin" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
