import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllShipments,
  getShipmentOperatorStats,
  updateShipmentStatus,
  getShipmentRoutes,
} from '@/services/shipment.service';
import { SHIPMENT_STATUS, SHIPMENT_STATUS_FLOW } from '@/data/shipment-catalog';
import { useShipmentsAdminRealtime } from '@/hooks/useShipmentRealtime';
import PanelHeader from '@/design-system/patterns/PanelHeader';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { MetricCard, MetricGrid } from '@/design-system/patterns/MetricCard';
import { DataTable } from '@/design-system/patterns/DataTable';
import FormSelect from '@/design-system/patterns/FormSelect';
import Loader from '@/components/ui/Loader';
import { formatCOP } from '@/utils/currency';
import { toast } from '@/utils/toast';

export default function AdminShipmentsPanel() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  useShipmentsAdminRealtime(true);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['shipment-operator-stats'],
    queryFn: getShipmentOperatorStats,
    refetchInterval: 30_000,
  });

  const { data: shipments = [], isLoading } = useQuery({
    queryKey: ['admin-shipments', statusFilter],
    queryFn: () => getAllShipments({ status: statusFilter || undefined }),
  });

  const { data: routes = [] } = useQuery({
    queryKey: ['shipment-routes-admin'],
    queryFn: getShipmentRoutes,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateShipmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipments'] });
      queryClient.invalidateQueries({ queryKey: ['shipment-operator-stats'] });
      toast('Estado actualizado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  return (
    <div className="space-y-4">
      <PanelHeader
        tag="Logística"
        title="Envíos intermunicipales"
        subtitle="Pedidos, rutas, capacidad e ingresos — operador regional Urabá"
      />

      {statsLoading ? (
        <Loader />
      ) : stats && (
        <MetricGrid>
          <MetricCard label="Pendientes" value={stats.pending} />
          <MetricCard label="En ruta" value={stats.inTransit} />
          <MetricCard label="Ingresos hoy" value={formatCOP(stats.revenueToday)} />
          <MetricCard label="Rutas activas" value={stats.routes.length} />
        </MetricGrid>
      )}

      <SurfaceCard className="space-y-3">
        <SectionTitle>Rutas y capacidad</SectionTitle>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {routes.slice(0, 9).map((r) => (
            <div key={r.id} className="rounded-xl border border-border/50 p-3 text-sm">
              <p className="font-bold">{r.origin_municipio} → {r.dest_municipio}</p>
              <p className="text-muted-foreground">
                {r.slots_used}/{r.capacity_slots} cupos · {formatCOP(r.base_fee ?? 15000)}
              </p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle>Pedidos</SectionTitle>
          <FormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-48">
            <option value="">Todos</option>
            {SHIPMENT_STATUS_FLOW.map((s) => (
              <option key={s} value={s}>{SHIPMENT_STATUS[s]}</option>
            ))}
          </FormSelect>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <DataTable
            columns={[
              { key: 'shipment_number', label: 'Nº' },
              { key: 'route', label: 'Ruta', render: (r) => `${r.origin_municipio} → ${r.dest_municipio}` },
              { key: 'status', label: 'Estado', render: (r) => SHIPMENT_STATUS[r.status] || r.status },
              { key: 'total_cop', label: 'Total', render: (r) => formatCOP(r.total_cop) },
              {
                key: 'actions',
                label: 'Acción',
                render: (r) => (
                  <FormSelect
                    value={r.status}
                    onChange={(e) => statusMutation.mutate({ id: r.id, status: e.target.value })}
                    className="min-w-[10rem]"
                  >
                    {SHIPMENT_STATUS_FLOW.map((s) => (
                      <option key={s} value={s}>{SHIPMENT_STATUS[s]}</option>
                    ))}
                  </FormSelect>
                ),
              },
            ]}
            rows={shipments}
            emptyTitle="Sin envíos intermunicipales"
          />
        )}
      </SurfaceCard>
    </div>
  );
}
