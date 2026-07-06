import { useQuery } from '@tanstack/react-query';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { MetricCard } from '@/design-system/patterns/MetricCard';
import { getActiveOrdersForTracking, getOrderEvents, getActiveShipmentsForTracking, getTrackingHeatmapPoints } from '@/services/order-tracking.service';
import { ORDER_STATUS_LABELS } from '@/utils/constants';
import OrderTimeline from '@/components/tracking/OrderTimeline';
import OrderGpsRouteReplay from '@/components/tracking/OrderGpsRouteReplay';
import OrderEtaHistoryChart from '@/components/tracking/OrderEtaHistoryChart';
import AdminOperationsMap from '@/components/tracking/AdminOperationsMap';
import AdminTrackingAuditPanel from './AdminTrackingAuditPanel';
import TrackingPushOutboxPanel from '@/components/tracking/TrackingPushOutboxPanel';
import { useState } from 'react';

function ActiveOrderRow({ order }) {
  const { data: events = [] } = useQuery({
    queryKey: ['order-events', order.id],
    queryFn: () => getOrderEvents(order.id),
    staleTime: 15_000,
  });
  const lastEvent = events[events.length - 1];

  return (
    <SurfaceCard className="space-y-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-bold text-foreground">{order.order_number || order.id.slice(0, 8)}</p>
          <p className="text-sm text-muted-foreground">
            {order.businesses?.name || 'Sin comercio'} → {order.dest_municipio}
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
          {ORDER_STATUS_LABELS[order.status] || order.status}
        </span>
      </div>
      {order.drivers?.name && (
        <p className="text-sm text-muted-foreground">
          Repartidor: <span className="font-semibold text-foreground">{order.drivers.name}</span>
        </p>
      )}
      {lastEvent && (
        <p className="text-xs text-muted-foreground">
          Último evento: {lastEvent.description || lastEvent.event_type}
        </p>
      )}
      {events.length > 0 && <OrderTimeline events={events} compact />}
      {order.driver_id && (
        <>
          <OrderEtaHistoryChart orderId={order.id} compact />
          <OrderGpsRouteReplay
            orderId={order.id}
            destLat={order.dest_latitude}
            destLng={order.dest_longitude}
            className="h-48 w-full"
          />
        </>
      )}
    </SurfaceCard>
  );
}

export default function AdminLiveTrackingPanel() {
  const [view, setView] = useState('live');
  const [municipioFilter, setMunicipioFilter] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(true);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-live-tracking', municipioFilter],
    queryFn: () => getActiveOrdersForTracking(municipioFilter ? { municipio: municipioFilter } : {}),
    refetchInterval: 10_000,
  });

  const { data: shipments = [] } = useQuery({
    queryKey: ['admin-live-shipments', municipioFilter],
    queryFn: () => getActiveShipmentsForTracking(municipioFilter ? { municipio: municipioFilter } : {}),
    refetchInterval: 15_000,
  });

  const { data: heatPoints = [] } = useQuery({
    queryKey: ['admin-tracking-heatmap'],
    queryFn: () => getTrackingHeatmapPoints(2),
    refetchInterval: 30_000,
    enabled: showHeatmap,
  });

  const withDriver = orders.filter((o) => o.driver_id).length;
  const delayed = orders.filter((o) => {
    const ageMin = (Date.now() - new Date(o.created_at).getTime()) / 60000;
    return ageMin > 45 && o.status !== 'on_the_way';
  }).length;

  const municipios = [...new Set(orders.map((o) => o.dest_municipio).filter(Boolean))];

  if (isLoading && view === 'live') {
    return <p className="text-sm text-muted-foreground">Cargando mapa operativo…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setView('live')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${view === 'live' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
        >
          En vivo
        </button>
        <button
          type="button"
          onClick={() => setView('audit')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${view === 'audit' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
        >
          Auditoría
        </button>
      </div>

      {view === 'audit' ? (
        <AdminTrackingAuditPanel />
      ) : (
        <>
      <TrackingPushOutboxPanel />
      <div className="grid gap-3 sm:grid-cols-4">
        <MetricCard label="Pedidos activos" value={orders.length} icon="package" />
        <MetricCard label="Envíos activos" value={shipments.length} icon="envios" />
        <MetricCard label="Con repartidor" value={withDriver} icon="mensajeria" />
        <MetricCard label="Posible retraso" value={delayed} icon="alert" />
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={showHeatmap}
          onChange={(e) => setShowHeatmap(e.target.checked)}
          className="rounded border-border"
        />
        Mostrar heatmap GPS (últimas 2 h)
      </label>

      {municipios.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMunicipioFilter('')}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${!municipioFilter ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
          >
            Todos
          </button>
          {municipios.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMunicipioFilter(m)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${municipioFilter === m ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      <AdminOperationsMap
        orders={orders}
        shipments={shipments}
        heatPoints={heatPoints}
        showHeatmap={showHeatmap}
        className="h-80 w-full rounded-2xl"
      />

      {orders.length === 0 ? (
        <SurfaceCard className="text-center text-sm text-muted-foreground">
          No hay pedidos activos en este momento.
        </SurfaceCard>
      ) : (
        orders.map((order) => <ActiveOrderRow key={order.id} order={order} />)
      )}
        </>
      )}
    </div>
  );
}
