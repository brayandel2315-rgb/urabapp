import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '@/design-system/patterns/ChartCard';
import { formatCOP } from '../../../utils/currency';

function chartTooltipFormatter(value) {
  return [formatCOP(value), 'GMV'];
}

function countTooltipFormatter(value) {
  return [value, 'Clientes'];
}

export default function AdminExecutiveCharts({ zoneGmv, segmentCounts }) {
  const zoneData = Object.entries(zoneGmv || {})
    .map(([zone, gmv]) => ({ zone, gmv }))
    .sort((a, b) => b.gmv - a.gmv);

  const segmentData = Object.entries(segmentCounts || {})
    .map(([segment, count]) => ({ segment, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="GMV por zona"
        description="Ventas del mes por zona de Apartadó"
        icon="chart"
      >
        {zoneData.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">Sin pedidos este mes.</p>
        ) : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="zone" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  formatter={chartTooltipFormatter}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--card))',
                  }}
                />
                <Bar dataKey="gmv" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <ChartCard
        title="Segmentos CRM"
        description="Distribución de clientes por segmento"
        icon="users"
      >
        {segmentData.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">Sin datos de segmentos.</p>
        ) : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segmentData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="segment" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  formatter={countTooltipFormatter}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--card))',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>
    </div>
  );
}
