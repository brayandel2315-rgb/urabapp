import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBusinessCustomers, getBusinessCrmSummary } from '@/services/business-crm.service';
import { sendBusinessCampaign, getBusinessCampaignHistory } from '@/services/business-campaign.service';
import { generateWinbackMessage } from '@/services/ai.service';
import { formatCOP } from '@/utils/currency';
import { toast } from '@/utils/toast';
import Loader from '@/components/ui/Loader';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { MetricCard, MetricGrid } from '@/design-system/patterns/MetricCard';

const SEGMENTS = [
  { id: null, label: 'Todos' },
  { id: 'new', label: 'Nuevos' },
  { id: 'recurring', label: 'Recurrentes' },
  { id: 'loyal', label: 'Leales' },
  { id: 'at_risk', label: 'En riesgo' },
];

const SEGMENT_STYLES = {
  new: 'bg-sky-500/15 text-sky-800 dark:text-sky-200',
  recurring: 'bg-primary/15 text-primary',
  loyal: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200',
  at_risk: 'bg-amber-500/15 text-amber-800 dark:text-amber-200',
};

const SEGMENT_LABELS = {
  new: 'Nuevo',
  recurring: 'Recurrente',
  loyal: 'Leal',
  at_risk: 'En riesgo',
};

export default function BusinessCrmPanel({ business }) {
  const queryClient = useQueryClient();
  const [segment, setSegment] = useState(null);
  const [campaignMessage, setCampaignMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['business-crm-summary', business.id],
    queryFn: () => getBusinessCrmSummary(business.id),
    enabled: !!business?.id,
  });

  const { data: customers = [], isLoading: loadingCustomers } = useQuery({
    queryKey: ['business-crm-customers', business.id, segment],
    queryFn: () => getBusinessCustomers(business.id, { segment }),
    enabled: !!business?.id,
  });

  const { data: campaignHistory = [] } = useQuery({
    queryKey: ['business-campaign-history', business.id],
    queryFn: () => getBusinessCampaignHistory(business.id),
    enabled: !!business?.id,
  });

  const campaignMutation = useMutation({
    mutationFn: (payload) => sendBusinessCampaign({
      businessId: business.id,
      businessName: business.name,
      ...payload,
    }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['business-campaign-history', business.id] });
      toast(`Campaña enviada a ${result.sent} cliente(s) · ${result.pushed} push`);
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const handleGenerateMessage = async () => {
    setAiLoading(true);
    try {
      const { text } = await generateWinbackMessage({ business });
      setCampaignMessage(text);
      toast('Mensaje sugerido');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const sendToAtRisk = () => {
    if (!campaignMessage.trim()) {
      toast('Escribe o genera un mensaje primero', 'error');
      return;
    }
    campaignMutation.mutate({
      message: campaignMessage.trim(),
      targetSegment: 'at_risk',
      campaignType: 'winback',
    });
  };

  const sendToOne = (customerId) => {
    if (!campaignMessage.trim()) {
      toast('Escribe o genera un mensaje primero', 'error');
      return;
    }
    campaignMutation.mutate({
      message: campaignMessage.trim(),
      customerIds: [customerId],
      campaignType: 'winback',
    });
  };

  if (loadingSummary) {
    return <div className="flex justify-center py-12"><Loader /></div>;
  }

  return (
    <div className="space-y-4">
      <MetricGrid>
        <MetricCard label="Clientes" value={summary?.total_customers ?? 0} icon="users" />
        <MetricCard label="Nuevos" value={summary?.new_customers ?? 0} icon="star" />
        <MetricCard label="Recurrentes" value={summary?.recurring_customers ?? 0} icon="trend" accent />
        <MetricCard label="Recompra" value={`${summary?.repeat_rate ?? 0}%`} icon="chart" />
      </MetricGrid>

      <SurfaceCard className="flex items-start gap-3 border-primary/20 bg-primary/5 text-sm">
        <AppIcon name="users" size="sm" className="mt-0.5 shrink-0 text-primary" />
        <p className="text-muted-foreground">
          LTV total: <strong className="text-foreground">{formatCOP(summary?.total_ltv ?? 0)}</strong>
          {' · '}
          <strong className="text-foreground">{summary?.at_risk_customers ?? 0}</strong> en riesgo (30+ días sin pedir)
        </p>
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <SectionTitle>Campaña de regreso</SectionTitle>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={aiLoading}
            onClick={handleGenerateMessage}
            className="inline-flex items-center gap-1"
          >
            <AppIcon name="bolt" size="xs" />
            {aiLoading ? '…' : 'Sugerir texto'}
          </Button>
        </div>
        <textarea
          value={campaignMessage}
          onChange={(e) => setCampaignMessage(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Mensaje para clientes que hace tiempo no piden…"
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
        <Button
          className="w-full"
          disabled={campaignMutation.isPending || !(summary?.at_risk_customers > 0)}
          onClick={sendToAtRisk}
        >
          {campaignMutation.isPending
            ? 'Enviando…'
            : `Enviar a ${summary?.at_risk_customers ?? 0} en riesgo`}
        </Button>
        <p className="text-xs text-muted-foreground">
          Llega como notificación in-app y push (si el cliente las activó). Máx. 25 por envío.
        </p>
      </SurfaceCard>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {SEGMENTS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setSegment(s.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              segment === s.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <SectionTitle>Clientes ({customers.length})</SectionTitle>

      {loadingCustomers ? (
        <div className="flex justify-center py-8"><Loader /></div>
      ) : customers.length === 0 ? (
        <SurfaceCard className="py-8 text-center text-sm text-muted-foreground">
          Aún no hay clientes con pedidos. Comparte el link de tu tienda para conseguir los primeros.
        </SurfaceCard>
      ) : (
        customers.map((c) => (
          <SurfaceCard key={c.customer_id} className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">{c.display_name}</p>
              <p className="text-xs text-muted-foreground">
                {c.municipio || 'Urabá'} · {c.order_count} pedido{c.order_count !== 1 ? 's' : ''}
                {c.last_order_at && (
                  <> · Último {new Date(c.last_order_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</>
                )}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${SEGMENT_STYLES[c.segment] || 'bg-muted'}`}>
                {SEGMENT_LABELS[c.segment] || c.segment}
              </span>
              <p className="text-sm font-bold text-primary">{formatCOP(c.total_spent)}</p>
              {c.segment === 'at_risk' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={campaignMutation.isPending}
                  onClick={() => sendToOne(c.customer_id)}
                >
                  Recordar
                </Button>
              )}
            </div>
          </SurfaceCard>
        ))
      )}

      {campaignHistory.length > 0 && (
        <>
          <SectionTitle>Últimas campañas</SectionTitle>
          {campaignHistory.slice(0, 5).map((row) => (
            <SurfaceCard key={row.id} className="text-sm">
              <p className="line-clamp-2 text-muted-foreground">{row.message}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(row.created_at).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
            </SurfaceCard>
          ))}
        </>
      )}
    </div>
  );
}
