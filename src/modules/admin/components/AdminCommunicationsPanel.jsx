import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { MetricCard, MetricGrid } from '@/design-system/patterns/MetricCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Badge } from '@/design-system/ui/badge';
import { COMM_CATEGORY_LABELS } from '@/communication';
import {
  getAdminCommunicationOverview,
  getCommunicationWebhooks,
  upsertCommunicationWebhook,
  deleteCommunicationWebhook,
  getCommunicationTemplates,
  saveCommunicationTemplate,
  triggerCommRetryProcessor,
  triggerDailyDigest,
  getAdminDeliveryMetrics,
  getTemplateVariants,
  saveTemplateVariant,
  getCommunicationRateLimits,
  saveCommunicationRateLimit,
  getScheduledCommunications,
  scheduleCommunication,
  cancelScheduledCommunication,
  downloadDeliveryMetricsCsv,
  triggerScheduledProcessor,
} from '@/services/admin-communication.service';
import { listEventKeys } from '@/communication';
import { toast } from '@/utils/toast';
import Loader from '@/components/ui/Loader';

const EMPTY_WEBHOOK = { name: '', url: '', eventKeys: '' };
const EMPTY_TEMPLATE = { eventKey: '', titleTemplate: '', bodyTemplate: '' };
const EMPTY_VARIANT = { eventKey: '', variantKey: 'A', titleTemplate: '', bodyTemplate: '', weight: 50 };
const EMPTY_SCHEDULE = { recipientId: '', title: '', body: '', scheduledAt: '', eventKey: 'system_announcement' };
const RATE_CHANNELS = ['push', 'email', 'sms', 'whatsapp'];

export default function AdminCommunicationsPanel() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_WEBHOOK);
  const [editingId, setEditingId] = useState(null);
  const [tplForm, setTplForm] = useState(EMPTY_TEMPLATE);
  const [variantForm, setVariantForm] = useState(EMPTY_VARIANT);
  const [scheduleForm, setScheduleForm] = useState(EMPTY_SCHEDULE);
  const [rateLimits, setRateLimits] = useState({});

  const { data: overview, isLoading } = useQuery({
    queryKey: ['admin-comm-overview'],
    queryFn: getAdminCommunicationOverview,
    refetchInterval: 60_000,
  });

  const { data: webhooks = [] } = useQuery({
    queryKey: ['admin-comm-webhooks'],
    queryFn: getCommunicationWebhooks,
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['admin-comm-templates'],
    queryFn: getCommunicationTemplates,
  });

  const { data: deliveryMetrics } = useQuery({
    queryKey: ['admin-comm-delivery'],
    queryFn: getAdminDeliveryMetrics,
    refetchInterval: 60_000,
  });

  const { data: variants = [] } = useQuery({
    queryKey: ['admin-comm-variants'],
    queryFn: getTemplateVariants,
  });

  const { data: rateLimitRows = [] } = useQuery({
    queryKey: ['admin-comm-rate-limits'],
    queryFn: getCommunicationRateLimits,
  });

  useEffect(() => {
    const map = {};
    (rateLimitRows || []).forEach((r) => { map[r.channel] = r; });
    setRateLimits(map);
  }, [rateLimitRows]);

  const { data: scheduledComms = [] } = useQuery({
    queryKey: ['admin-comm-scheduled'],
    queryFn: getScheduledCommunications,
    refetchInterval: 30_000,
  });

  const eventKeys = listEventKeys();

  const saveMutation = useMutation({
    mutationFn: () => upsertCommunicationWebhook({
      id: editingId,
      name: form.name,
      url: form.url,
      eventKeys: form.eventKeys
        ? form.eventKeys.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-webhooks'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comm-overview'] });
      setForm(EMPTY_WEBHOOK);
      setEditingId(null);
      toast('Webhook guardado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCommunicationWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-webhooks'] });
      toast('Webhook eliminado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const saveTplMutation = useMutation({
    mutationFn: () => saveCommunicationTemplate(tplForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-templates'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comm-overview'] });
      setTplForm(EMPTY_TEMPLATE);
      toast('Plantilla guardada');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const retryMutation = useMutation({
    mutationFn: triggerCommRetryProcessor,
    onSuccess: (data) => toast(`Reintentos: ${data?.completed ?? 0} completados`),
    onError: (err) => toast(err.message, 'error'),
  });

  const digestMutation = useMutation({
    mutationFn: triggerDailyDigest,
    onSuccess: (data) => toast(`Digest enviado a ${data?.sent ?? 0} usuarios`),
    onError: (err) => toast(err.message, 'error'),
  });

  const saveVariantMutation = useMutation({
    mutationFn: () => saveTemplateVariant(variantForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-variants'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comm-delivery'] });
      setVariantForm(EMPTY_VARIANT);
      toast('Variante A/B guardada');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const saveRateLimitsMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(RATE_CHANNELS.map((ch) => saveCommunicationRateLimit({
        channel: ch,
        maxPerHour: Number(rateLimits[ch]?.max_per_hour ?? 40),
        isActive: rateLimits[ch]?.is_active !== false,
      })));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-rate-limits'] });
      toast('Límites de envío guardados');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const scheduleMutation = useMutation({
    mutationFn: () => scheduleCommunication({
      recipientId: scheduleForm.recipientId.trim(),
      title: scheduleForm.title.trim(),
      body: scheduleForm.body,
      scheduledAt: scheduleForm.scheduledAt ? new Date(scheduleForm.scheduledAt).toISOString() : new Date().toISOString(),
      eventKey: scheduleForm.eventKey || 'system_announcement',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-scheduled'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comm-overview'] });
      setScheduleForm(EMPTY_SCHEDULE);
      toast('Comunicación programada');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const cancelScheduleMutation = useMutation({
    mutationFn: cancelScheduledCommunication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-scheduled'] });
      toast('Programación cancelada');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const scheduledMutation = useMutation({
    mutationFn: triggerScheduledProcessor,
    onSuccess: (data) => toast(`Programadas enviadas: ${data?.sent ?? 0}`),
    onError: (err) => toast(err.message, 'error'),
  });

  const exportCsv = async () => {
    try {
      await downloadDeliveryMetricsCsv(7);
      toast('CSV descargado');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader /></div>;
  }

  const ctr = overview?.opened_7d > 0
    ? Math.round((overview.clicked_7d / overview.opened_7d) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <SurfaceCard variant="highlight" className="text-sm">
        <p className="font-semibold text-primary-dark">Centro de Comunicación — Operaciones</p>
        <p className="mt-1 text-muted-foreground">
          Eventos, engagement, campañas y webhooks salientes (últimos 7 días).
        </p>
      </SurfaceCard>

      <MetricGrid>
        <MetricCard label="Eventos" value={overview?.events_7d ?? 0} accent />
        <MetricCard label="Notificaciones" value={overview?.notifications_7d ?? 0} />
        <MetricCard label="Engagement" value={overview?.engagement_7d ?? 0} />
        <MetricCard label="CTR" value={`${ctr}%`} trend={`${overview?.opened_7d ?? 0} aperturas`} />
        <MetricCard label="Campañas CRM" value={overview?.campaigns_7d ?? 0} />
        <MetricCard label="Webhooks activos" value={overview?.webhooks_active ?? 0} />
        <MetricCard label="Plantillas" value={overview?.templates_active ?? 0} />
        <MetricCard label="Reintentos pend." value={overview?.retries_pending ?? 0} />
        <MetricCard label="Suscriptores digest" value={overview?.digest_subscribers ?? 0} />
        <MetricCard label="Entregas 7d" value={overview?.deliveries_7d ?? 0} />
        <MetricCard label="Éxito entrega" value={`${overview?.delivery_success_rate ?? 0}%`} />
        <MetricCard label="Variantes A/B" value={overview?.ab_variants_active ?? 0} />
        <MetricCard label="Prog. pendientes" value={overview?.scheduled_pending ?? 0} />
      </MetricGrid>

      {deliveryMetrics?.by_channel && Object.keys(deliveryMetrics.by_channel).length > 0 && (
        <SurfaceCard className="flex flex-wrap gap-2 p-4">
          <span className="w-full text-sm font-semibold">Entregas por canal (7d)</span>
          {Object.entries(deliveryMetrics.by_channel).map(([ch, stats]) => (
            <Badge key={ch} variant="outline">
              {ch}: {stats.delivered ?? 0} ok · {stats.failed ?? 0} fallo
              {(stats.rate_limited ?? 0) > 0 ? ` · ${stats.rate_limited} limitado` : ''}
            </Badge>
          ))}
          <Badge variant="muted">Tasa global: {deliveryMetrics.delivery_rate}%</Badge>
        </SurfaceCard>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => retryMutation.mutate()}
          loading={retryMutation.isPending}
        >
          Procesar reintentos
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => digestMutation.mutate()}
          loading={digestMutation.isPending}
        >
          Enviar digest ahora
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => scheduledMutation.mutate()}
          loading={scheduledMutation.isPending}
        >
          Procesar programadas
        </Button>
        <Button size="sm" variant="outline" onClick={exportCsv}>
          Exportar CSV (7d)
        </Button>
      </div>

      {overview?.by_category && Object.keys(overview.by_category).length > 0 && (
        <SurfaceCard className="flex flex-wrap gap-2 p-4">
          {Object.entries(overview.by_category).map(([cat, count]) => (
            <Badge key={cat} variant="outline">
              {COMM_CATEGORY_LABELS[cat] || cat}: {count}
            </Badge>
          ))}
        </SurfaceCard>
      )}

      <SurfaceCard className="space-y-3 p-5">
        <SectionTitle>Eventos recientes</SectionTitle>
        <ul className="space-y-2 text-sm">
          {(overview?.recent_events || []).map((ev, i) => (
            <li key={`${ev.event_key}-${i}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-3 py-2">
              <span className="font-semibold">{ev.title || ev.event_key}</span>
              <Badge variant="muted">{COMM_CATEGORY_LABELS[ev.category] || ev.category}</Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(ev.created_at).toLocaleString('es-CO')}
              </span>
            </li>
          ))}
          {!overview?.recent_events?.length && (
            <p className="text-muted-foreground">Sin eventos recientes.</p>
          )}
        </ul>
      </SurfaceCard>

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Límites de envío por canal</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Máximo de entregas por usuario y canal en una hora (anti-spam).
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {RATE_CHANNELS.map((ch) => (
            <label key={ch} className="flex items-center gap-3 text-sm">
              <span className="w-20 font-medium capitalize">{ch}</span>
              <input
                type="number"
                min={1}
                max={500}
                value={rateLimits[ch]?.max_per_hour ?? ''}
                onChange={(e) => setRateLimits((prev) => ({
                  ...prev,
                  [ch]: { ...prev[ch], channel: ch, max_per_hour: Number(e.target.value) },
                }))}
                className="h-9 w-20 rounded-lg border border-input px-2"
              />
              <span className="text-xs text-muted-foreground">/ hora</span>
            </label>
          ))}
        </div>
        <Button
          size="sm"
          onClick={() => saveRateLimitsMutation.mutate()}
          loading={saveRateLimitsMutation.isPending}
        >
          Guardar límites
        </Button>
      </SurfaceCard>

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Comunicaciones programadas</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="ID usuario destino"
            value={scheduleForm.recipientId}
            onChange={(e) => setScheduleForm({ ...scheduleForm, recipientId: e.target.value })}
            placeholder="uuid del usuario"
            className="sm:col-span-2"
          />
          <Input
            label="Título"
            value={scheduleForm.title}
            onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
            className="sm:col-span-2"
          />
          <Input
            label="Cuerpo"
            value={scheduleForm.body}
            onChange={(e) => setScheduleForm({ ...scheduleForm, body: e.target.value })}
            className="sm:col-span-2"
          />
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block text-muted-foreground">Fecha y hora</span>
            <input
              type="datetime-local"
              value={scheduleForm.scheduledAt}
              onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledAt: e.target.value })}
              className="h-10 w-full rounded-xl border border-input bg-background px-3"
            />
          </label>
        </div>
        <Button
          onClick={() => scheduleMutation.mutate()}
          loading={scheduleMutation.isPending}
          disabled={!scheduleForm.recipientId || !scheduleForm.title}
        >
          Programar envío
        </Button>
        <ul className="space-y-2 text-sm">
          {scheduledComms.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3">
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(s.scheduled_at).toLocaleString('es-CO')} · {s.status}
                </p>
              </div>
              {s.status === 'pending' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => cancelScheduleMutation.mutate(s.id)}
                  loading={cancelScheduleMutation.isPending}
                >
                  Cancelar
                </Button>
              )}
            </li>
          ))}
          {!scheduledComms.length && (
            <p className="text-muted-foreground">Sin comunicaciones programadas.</p>
          )}
        </ul>
      </SurfaceCard>

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Variantes A/B de plantillas</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Prueba dos mensajes por evento. El peso define la probabilidad (ej. A=50, B=50).
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block text-muted-foreground">Evento</span>
            <select
              value={variantForm.eventKey}
              onChange={(e) => setVariantForm({ ...variantForm, eventKey: e.target.value })}
              className="h-10 w-full rounded-xl border border-input bg-background px-3"
            >
              <option value="">Seleccionar…</option>
              {eventKeys.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </label>
          <Input
            label="Variante"
            value={variantForm.variantKey}
            onChange={(e) => setVariantForm({ ...variantForm, variantKey: e.target.value })}
            placeholder="A"
          />
          <Input
            label="Peso %"
            type="number"
            min={1}
            max={100}
            value={variantForm.weight}
            onChange={(e) => setVariantForm({ ...variantForm, weight: Number(e.target.value) })}
          />
          <Input
            label="Título"
            value={variantForm.titleTemplate}
            onChange={(e) => setVariantForm({ ...variantForm, titleTemplate: e.target.value })}
            className="sm:col-span-2"
          />
          <Input
            label="Cuerpo"
            value={variantForm.bodyTemplate}
            onChange={(e) => setVariantForm({ ...variantForm, bodyTemplate: e.target.value })}
            className="sm:col-span-2"
          />
        </div>

        <Button
          onClick={() => saveVariantMutation.mutate()}
          loading={saveVariantMutation.isPending}
          disabled={!variantForm.eventKey || !variantForm.variantKey || !variantForm.titleTemplate}
        >
          Guardar variante
        </Button>

        <ul className="space-y-2">
          {variants.map((v) => (
            <li key={v.id} className="rounded-xl border border-border p-3 text-sm">
              <p className="font-semibold">{v.event_key} · variante {v.variant_key} ({v.weight}%)</p>
              <p className="text-muted-foreground">{v.title_template}</p>
            </li>
          ))}
          {!variants.length && (
            <p className="text-sm text-muted-foreground">Sin variantes A/B activas.</p>
          )}
        </ul>

        {(deliveryMetrics?.ab_variants?.length ?? 0) > 0 && (
          <div className="rounded-xl border border-border p-3 text-sm">
            <p className="mb-2 font-semibold">Rendimiento A/B (7d)</p>
            <ul className="space-y-1">
              {deliveryMetrics.ab_variants.map((row) => (
                <li key={`${row.event_key}-${row.variant_key}`}>
                  {row.event_key} / {row.variant_key}: {row.delivered}/{row.total} entregas
                </li>
              ))}
            </ul>
          </div>
        )}
      </SurfaceCard>

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Plantillas por evento</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Sobrescriben título y cuerpo del dispatch. Usa placeholders como {'{{orderNumber}}'} o {'{{body}}'}.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block text-muted-foreground">Evento</span>
            <select
              value={tplForm.eventKey}
              onChange={(e) => setTplForm({ ...tplForm, eventKey: e.target.value })}
              className="h-10 w-full rounded-xl border border-input bg-background px-3"
            >
              <option value="">Seleccionar…</option>
              {eventKeys.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </label>
          <Input
            label="Título"
            value={tplForm.titleTemplate}
            onChange={(e) => setTplForm({ ...tplForm, titleTemplate: e.target.value })}
            placeholder="Pedido {{orderNumber}}"
            className="sm:col-span-2"
          />
          <Input
            label="Cuerpo"
            value={tplForm.bodyTemplate}
            onChange={(e) => setTplForm({ ...tplForm, bodyTemplate: e.target.value })}
            placeholder="Tu pedido está {{status}}"
            className="sm:col-span-2"
          />
        </div>

        <Button
          onClick={() => saveTplMutation.mutate()}
          loading={saveTplMutation.isPending}
          disabled={!tplForm.eventKey || !tplForm.titleTemplate}
        >
          Guardar plantilla
        </Button>

        <ul className="space-y-2">
          {templates.map((tpl) => (
            <li key={tpl.id} className="rounded-xl border border-border p-3 text-sm">
              <p className="font-semibold">{tpl.event_key}</p>
              <p className="text-muted-foreground">{tpl.title_template}</p>
              {tpl.body_template && <p className="mt-1 text-xs">{tpl.body_template}</p>}
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => setTplForm({
                  eventKey: tpl.event_key,
                  titleTemplate: tpl.title_template,
                  bodyTemplate: tpl.body_template || '',
                })}
              >
                Editar
              </Button>
            </li>
          ))}
          {!templates.length && (
            <p className="text-sm text-muted-foreground">Sin plantillas — se usa la biblioteca de eventos.</p>
          )}
        </ul>
      </SurfaceCard>

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Webhooks salientes</SectionTitle>
        <p className="text-sm text-muted-foreground">
          POST JSON a estas URLs cuando ocurren eventos en edge functions (pagos, campañas, etc.).
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="n8n producción"
          />
          <Input
            label="URL"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://..."
          />
          <Input
            label="Eventos (vacío = todos)"
            value={form.eventKeys}
            onChange={(e) => setForm({ ...form, eventKeys: e.target.value })}
            placeholder="payment_approved, business_campaign_sent"
            className="sm:col-span-2"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => saveMutation.mutate()}
            loading={saveMutation.isPending}
            disabled={!form.name || !form.url}
          >
            {editingId ? 'Actualizar' : 'Agregar webhook'}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={() => { setEditingId(null); setForm(EMPTY_WEBHOOK); }}>
              Cancelar
            </Button>
          )}
        </div>

        <ul className="space-y-2">
          {webhooks.map((wh) => (
            <li key={wh.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm">
              <div>
                <p className="font-semibold">{wh.name}</p>
                <p className="text-xs text-muted-foreground break-all">{wh.url}</p>
                {wh.event_keys?.length > 0 && (
                  <p className="mt-1 text-xs">{wh.event_keys.join(', ')}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(wh.id);
                    setForm({
                      name: wh.name,
                      url: wh.url,
                      eventKeys: (wh.event_keys || []).join(', '),
                    });
                  }}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteMutation.mutate(wh.id)}
                  loading={deleteMutation.isPending}
                >
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
          {!webhooks.length && <p className="text-sm text-muted-foreground">Sin webhooks configurados.</p>}
        </ul>
      </SurfaceCard>
    </div>
  );
}
