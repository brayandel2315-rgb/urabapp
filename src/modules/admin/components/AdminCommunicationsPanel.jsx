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
  getAdminChannelSla,
  getCommunicationBroadcasts,
  countBroadcastRecipients,
  createCommunicationBroadcast,
  cancelCommunicationBroadcast,
  resendCommunicationBroadcast,
  previewTemplateLocal,
  triggerBroadcastProcessor,
  getTemplateVariablesForEvent,
  insertTemplateVariable,
  getCommunicationSlaAlerts,
  acknowledgeSlaAlert,
  triggerSlaCheck,
  getSlaWebhooks,
  upsertSlaWebhook,
  deleteSlaWebhook,
  downloadWeeklyReportMarkdown,
  triggerWeeklyReport,
  getBroadcastTemplates,
  saveBroadcastTemplate,
  createBroadcastFromTemplate,
  getCommunicationTrends,
  mergeTrendSeries,
  getAdminConsentAudit,
  getAdminRetryQueueStats,
  getConsentWebhooks,
  upsertConsentWebhook,
  deleteConsentWebhook,
  getAdminFinanceCommSummary,
  triggerConsentWebhookProcessor,
} from '@/services/admin-communication.service';
import { BROADCAST_SEGMENTS, USER_ROLES, MUNICIPIOS } from '@/communication';
import { listEventKeys } from '@/communication';
import { toast } from '@/utils/toast';
import Loader from '@/components/ui/Loader';
import { formatCOP } from '@/utils/currency';

const EMPTY_WEBHOOK = { name: '', url: '', eventKeys: '' };
const EMPTY_TEMPLATE = { eventKey: '', titleTemplate: '', bodyTemplate: '' };
const EMPTY_VARIANT = { eventKey: '', variantKey: 'A', titleTemplate: '', bodyTemplate: '', weight: 50 };
const EMPTY_SCHEDULE = { recipientId: '', title: '', body: '', scheduledAt: '', eventKey: 'system_announcement' };
const EMPTY_SLA_WEBHOOK = { name: '', url: '' };
const EMPTY_CONSENT_WEBHOOK = { name: '', url: '' };
const EMPTY_BROADCAST_TPL = {
  id: null, name: '', title: '', body: '', segmentType: 'all_active', role: 'CLIENT', municipio: 'Apartadó',
};
const EMPTY_BROADCAST = {
  name: '', title: '', body: '', segmentType: 'all_active', role: 'CLIENT', municipio: 'Apartadó', scheduledAt: '',
};
const RATE_CHANNELS = ['push', 'email', 'sms', 'whatsapp'];

export default function AdminCommunicationsPanel() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_WEBHOOK);
  const [slaWebhookForm, setSlaWebhookForm] = useState(EMPTY_SLA_WEBHOOK);
  const [consentWebhookForm, setConsentWebhookForm] = useState(EMPTY_CONSENT_WEBHOOK);
  const [editingConsentWebhookId, setEditingConsentWebhookId] = useState(null);
  const [editingSlaWebhookId, setEditingSlaWebhookId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [tplForm, setTplForm] = useState(EMPTY_TEMPLATE);
  const [variantForm, setVariantForm] = useState(EMPTY_VARIANT);
  const [scheduleForm, setScheduleForm] = useState(EMPTY_SCHEDULE);
  const [broadcastForm, setBroadcastForm] = useState(EMPTY_BROADCAST);
  const [broadcastTplForm, setBroadcastTplForm] = useState(EMPTY_BROADCAST_TPL);
  const [segmentCount, setSegmentCount] = useState(null);
  const [tplPreview, setTplPreview] = useState(null);
  const [tplField, setTplField] = useState('title');
  const [templateVariables, setTemplateVariables] = useState([]);
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

  const { data: slaWebhooks = [] } = useQuery({
    queryKey: ['admin-comm-sla-webhooks'],
    queryFn: getSlaWebhooks,
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

  const { data: channelSla = [] } = useQuery({
    queryKey: ['admin-comm-sla'],
    queryFn: () => getAdminChannelSla(7),
    refetchInterval: 60_000,
  });

  const { data: broadcasts = [] } = useQuery({
    queryKey: ['admin-comm-broadcasts'],
    queryFn: getCommunicationBroadcasts,
    refetchInterval: 30_000,
  });

  const { data: slaAlerts = [] } = useQuery({
    queryKey: ['admin-comm-sla-alerts'],
    queryFn: () => getCommunicationSlaAlerts(20),
    refetchInterval: 60_000,
  });

  const { data: broadcastTemplates = [] } = useQuery({
    queryKey: ['admin-comm-broadcast-templates'],
    queryFn: getBroadcastTemplates,
  });

  const { data: commTrends } = useQuery({
    queryKey: ['admin-comm-trends'],
    queryFn: () => getCommunicationTrends(30),
    refetchInterval: 120_000,
  });

  const { data: consentAudit } = useQuery({
    queryKey: ['admin-comm-consent'],
    queryFn: getAdminConsentAudit,
    refetchInterval: 120_000,
  });

  const { data: retryQueue } = useQuery({
    queryKey: ['admin-comm-retry-queue'],
    queryFn: getAdminRetryQueueStats,
    refetchInterval: 60_000,
  });

  const { data: consentWebhooks = [] } = useQuery({
    queryKey: ['admin-comm-consent-webhooks'],
    queryFn: getConsentWebhooks,
  });

  const { data: financeComm } = useQuery({
    queryKey: ['admin-finance-comm-summary'],
    queryFn: getAdminFinanceCommSummary,
    refetchInterval: 120_000,
  });

  const trendRows = mergeTrendSeries(commTrends);
  const maxTrendEvents = trendRows.reduce((m, r) => Math.max(m, r.events || 0), 1);
  const maxTrendDeliveries = trendRows.reduce((m, r) => Math.max(m, r.deliveries || 0), 1);

  useEffect(() => {
    if (!tplForm.eventKey) {
      setTemplateVariables([]);
      return;
    }
    getTemplateVariablesForEvent(tplForm.eventKey)
      .then(setTemplateVariables)
      .catch(() => setTemplateVariables([]));
  }, [tplForm.eventKey]);

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

  const saveSlaWebhookMutation = useMutation({
    mutationFn: () => upsertSlaWebhook({
      id: editingSlaWebhookId,
      name: slaWebhookForm.name,
      url: slaWebhookForm.url,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-sla-webhooks'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comm-overview'] });
      setSlaWebhookForm(EMPTY_SLA_WEBHOOK);
      setEditingSlaWebhookId(null);
      toast('Webhook SLA guardado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const deleteSlaWebhookMutation = useMutation({
    mutationFn: deleteSlaWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-sla-webhooks'] });
      toast('Webhook SLA eliminado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const saveConsentWebhookMutation = useMutation({
    mutationFn: () => upsertConsentWebhook({
      id: editingConsentWebhookId,
      name: consentWebhookForm.name,
      url: consentWebhookForm.url,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-consent-webhooks'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comm-overview'] });
      setConsentWebhookForm(EMPTY_CONSENT_WEBHOOK);
      setEditingConsentWebhookId(null);
      toast('Webhook de consentimiento guardado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const deleteConsentWebhookMutation = useMutation({
    mutationFn: deleteConsentWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-consent-webhooks'] });
      toast('Webhook de consentimiento eliminado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const consentWebhookMutation = useMutation({
    mutationFn: triggerConsentWebhookProcessor,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-finance-comm-summary'] });
      toast(`Consent webhooks: ${data?.delivered ?? 0} entregados`);
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

  const broadcastMutation = useMutation({
    mutationFn: () => {
      const segmentValue = broadcastForm.segmentType === 'role'
        ? { role: broadcastForm.role }
        : broadcastForm.segmentType === 'municipio'
          ? { municipio: broadcastForm.municipio }
          : {};
      return createCommunicationBroadcast({
        name: broadcastForm.name.trim(),
        title: broadcastForm.title.trim(),
        body: broadcastForm.body,
        segmentType: broadcastForm.segmentType,
        segmentValue,
        scheduledAt: broadcastForm.scheduledAt
          ? new Date(broadcastForm.scheduledAt).toISOString()
          : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-broadcasts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comm-overview'] });
      setBroadcastForm(EMPTY_BROADCAST);
      setSegmentCount(null);
      toast(broadcastForm.scheduledAt
        ? 'Broadcast programado'
        : 'Broadcast creado — usa "Procesar broadcasts" o espera el cron');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const cancelBroadcastMutation = useMutation({
    mutationFn: cancelCommunicationBroadcast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-broadcasts'] });
      toast('Broadcast cancelado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const resendBroadcastMutation = useMutation({
    mutationFn: resendCommunicationBroadcast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-broadcasts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comm-overview'] });
      toast('Broadcast reenviado — queda en cola pendiente');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const acknowledgeSlaMutation = useMutation({
    mutationFn: acknowledgeSlaAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-sla-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comm-overview'] });
      toast('Alerta reconocida');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const slaCheckMutation = useMutation({
    mutationFn: triggerSlaCheck,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-sla-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comm-overview'] });
      toast(`SLA: ${data?.alerts ?? 0} alertas, ${data?.webhooks ?? 0} webhooks, ${data?.escalated ?? 0} escaladas`);
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const weeklyReportMutation = useMutation({
    mutationFn: triggerWeeklyReport,
    onSuccess: (data) => toast(`Informe enviado a ${data?.sent ?? 0} admins`),
    onError: (err) => toast(err.message, 'error'),
  });

  const saveBroadcastTplMutation = useMutation({
    mutationFn: () => {
      const segmentValue = broadcastTplForm.segmentType === 'role'
        ? { role: broadcastTplForm.role }
        : broadcastTplForm.segmentType === 'municipio'
          ? { municipio: broadcastTplForm.municipio }
          : {};
      return saveBroadcastTemplate({
        id: broadcastTplForm.id,
        name: broadcastTplForm.name.trim(),
        title: broadcastTplForm.title.trim(),
        body: broadcastTplForm.body,
        segmentType: broadcastTplForm.segmentType,
        segmentValue,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-broadcast-templates'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comm-overview'] });
      setBroadcastTplForm(EMPTY_BROADCAST_TPL);
      toast('Plantilla de broadcast guardada');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const launchBroadcastTplMutation = useMutation({
    mutationFn: (templateId) => createBroadcastFromTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-broadcasts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comm-overview'] });
      toast('Broadcast creado desde plantilla');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const processBroadcastMutation = useMutation({
    mutationFn: triggerBroadcastProcessor,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-comm-broadcasts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comm-overview'] });
      toast(`Broadcast: ${data?.sent ?? 0} enviados, ${data?.completed ? 'completado' : 'en progreso'}`);
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const previewSegmentCount = async () => {
    try {
      const segmentValue = broadcastForm.segmentType === 'role'
        ? { role: broadcastForm.role }
        : broadcastForm.segmentType === 'municipio'
          ? { municipio: broadcastForm.municipio }
          : {};
      const count = await countBroadcastRecipients(broadcastForm.segmentType, segmentValue);
      setSegmentCount(count);
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const runTplPreview = () => {
    const result = previewTemplateLocal(
      tplForm.titleTemplate,
      tplForm.bodyTemplate,
      tplForm.eventKey,
    );
    setTplPreview(result);
  };

  const insertVariable = (key) => {
    if (tplField === 'body') {
      setTplForm({
        ...tplForm,
        bodyTemplate: insertTemplateVariable(tplForm.bodyTemplate, key),
      });
    } else {
      setTplForm({
        ...tplForm,
        titleTemplate: insertTemplateVariable(tplForm.titleTemplate, key),
      });
    }
  };

  const exportCsv = async () => {
    try {
      await downloadDeliveryMetricsCsv(7);
      toast('CSV descargado');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const exportWeeklyReport = async () => {
    try {
      await downloadWeeklyReportMarkdown();
      toast('Informe semanal descargado');
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
        <MetricCard label="Reintentos críticos" value={overview?.retries_critical ?? 0} accent={overview?.retries_critical > 0} />
        <MetricCard label="Marketing opt-in" value={overview?.marketing_opt_in ?? 0} />
        <MetricCard label="Eventos finance 7d" value={overview?.finance_events_7d ?? financeComm?.finance_events_7d ?? 0} />
        <MetricCard label="Cambios consent. pend." value={overview?.consent_changes_pending ?? financeComm?.consent_changes_pending ?? 0} />
        <MetricCard label="Suscriptores digest" value={overview?.digest_subscribers ?? 0} />
        <MetricCard label="Entregas 7d" value={overview?.deliveries_7d ?? 0} />
        <MetricCard label="Éxito entrega" value={`${overview?.delivery_success_rate ?? 0}%`} />
        <MetricCard label="Variantes A/B" value={overview?.ab_variants_active ?? 0} />
        <MetricCard label="Prog. pendientes" value={overview?.scheduled_pending ?? 0} />
        <MetricCard label="Broadcasts activos" value={overview?.broadcasts_pending ?? 0} />
        <MetricCard label="Alertas SLA" value={overview?.sla_alerts_open ?? 0} />
        <MetricCard label="SLA escaladas" value={overview?.sla_alerts_escalated ?? 0} />
        <MetricCard label="Plantillas broadcast" value={overview?.broadcast_templates_active ?? 0} />
        <MetricCard label="Broadcasts prog." value={overview?.broadcasts_scheduled ?? 0} />
      </MetricGrid>

      {consentAudit && (
        <SurfaceCard className="space-y-3 p-5">
          <SectionTitle>Auditoría de consentimiento</SectionTitle>
          <p className="text-sm text-muted-foreground">
            Preferencias por canal y categoría. {consentAudit.with_preferences ?? 0} usuarios con prefs explícitas de {consentAudit.total_users ?? 0}.
          </p>
          <MetricGrid>
            <MetricCard label="Marketing opt-in" value={consentAudit.marketing_opt_in ?? 0} />
            <MetricCard label="Marketing opt-out" value={consentAudit.marketing_opt_out ?? 0} />
            <MetricCard label="Digest activo" value={consentAudit.digest_subscribers ?? 0} />
            <MetricCard label="Horario silencio" value={consentAudit.quiet_hours_configured ?? 0} />
            <MetricCard label="Push habilitado" value={consentAudit.channel_totals?.push_enabled ?? 0} />
            <MetricCard label="Email habilitado" value={consentAudit.channel_totals?.email_enabled ?? 0} />
          </MetricGrid>
          {consentAudit.by_category && Object.keys(consentAudit.by_category).length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-3">Categoría</th>
                    <th className="py-2 pr-3">Push ON</th>
                    <th className="py-2 pr-3">Push OFF</th>
                    <th className="py-2 pr-3">Email ON</th>
                    <th className="py-2">In-app ON</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(consentAudit.by_category).map(([cat, stats]) => (
                    <tr key={cat} className="border-b border-border/40">
                      <td className="py-1.5 pr-3 font-medium">{COMM_CATEGORY_LABELS[cat] || cat}</td>
                      <td className="py-1.5 pr-3">{stats.push_on ?? 0}</td>
                      <td className="py-1.5 pr-3">{stats.push_off ?? 0}</td>
                      <td className="py-1.5 pr-3">{stats.email_on ?? 0}</td>
                      <td className="py-1.5">{stats.in_app_on ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SurfaceCard>
      )}

      {financeComm && (
        <SurfaceCard className="space-y-3 p-5">
          <SectionTitle>Finance + Communication (7d)</SectionTitle>
          <p className="text-sm text-muted-foreground">
            Eventos financieros emitidos vía Communication Center y actividad del motor financiero.
          </p>
          <MetricGrid>
            <MetricCard label="Eventos finance" value={financeComm.finance_events_7d ?? 0} accent />
            <MetricCard label="Liquidaciones" value={financeComm.settlements_7d ?? 0} />
            <MetricCard label="Lotes payout" value={financeComm.payout_batches_7d ?? 0} />
            <MetricCard label="Reembolsos" value={financeComm.refunds_7d ?? 0} />
            <MetricCard label="Pendiente pagar" value={formatCOP(financeComm.pending_payouts ?? 0)} />
            <MetricCard label="Ingresos semana" value={formatCOP(financeComm.revenue_week ?? 0)} />
          </MetricGrid>
          {financeComm.by_finance_event && Object.keys(financeComm.by_finance_event).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(financeComm.by_finance_event).map(([key, cnt]) => (
                <Badge key={key} variant="outline">{key}: {cnt}</Badge>
              ))}
            </div>
          )}
          {(financeComm.recent_finance_events?.length ?? 0) > 0 && (
            <ul className="space-y-1 text-xs text-muted-foreground">
              {financeComm.recent_finance_events.map((ev, i) => (
                <li key={i} className="flex flex-wrap gap-2 border-b border-border/30 py-1">
                  <span className="font-medium text-foreground">{ev.event_key}</span>
                  <span>{ev.title}</span>
                  <span>{new Date(ev.created_at).toLocaleString('es-CO')}</span>
                </li>
              ))}
            </ul>
          )}
        </SurfaceCard>
      )}

      {retryQueue && (retryQueue.pending_total > 0 || (retryQueue.recent?.length ?? 0) > 0) && (
        <SurfaceCard className="space-y-3 p-5">
          <SectionTitle>Cola prioritaria de reintentos</SectionTitle>
          <p className="text-sm text-muted-foreground">
            Critical primero. Pendientes: {retryQueue.pending_total ?? 0}
            {retryQueue.critical_pending > 0 ? ` · ${retryQueue.critical_pending} críticos` : ''}.
          </p>
          {retryQueue.by_priority && Object.keys(retryQueue.by_priority).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(retryQueue.by_priority).map(([prio, cnt]) => (
                <Badge key={prio} variant={prio === 'critical' ? 'destructive' : 'secondary'}>
                  {prio}: {cnt}
                </Badge>
              ))}
            </div>
          )}
          {(retryQueue.recent?.length ?? 0) > 0 && (
            <ul className="space-y-1 text-xs text-muted-foreground">
              {retryQueue.recent.map((row) => (
                <li key={row.id} className="flex flex-wrap gap-2 border-b border-border/30 py-1">
                  <span className="font-medium text-foreground">{row.event_key}</span>
                  <span>{row.channel}</span>
                  <span>p{row.priority}</span>
                  <span>intento {row.attempt_count}</span>
                  <span>{new Date(row.next_retry_at).toLocaleString('es-CO')}</span>
                </li>
              ))}
            </ul>
          )}
        </SurfaceCard>
      )}

      {channelSla.length > 0 && (
        <SurfaceCard className="space-y-3 p-5">
          <SectionTitle>SLA por canal (7d)</SectionTitle>
          <p className="text-sm text-muted-foreground">
            Latencia p95 y tasa de éxito vs objetivos configurados.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-3">Canal</th>
                  <th className="py-2 pr-3">Entregas</th>
                  <th className="py-2 pr-3">Éxito</th>
                  <th className="py-2 pr-3">p95 ms</th>
                  <th className="py-2 pr-3">Objetivo</th>
                  <th className="py-2">SLA</th>
                </tr>
              </thead>
              <tbody>
                {channelSla.map((row) => (
                  <tr key={row.channel} className="border-b border-border/50">
                    <td className="py-2 pr-3 font-medium">{row.channel}</td>
                    <td className="py-2 pr-3">{row.delivered}/{row.total}</td>
                    <td className="py-2 pr-3">{row.success_rate}%</td>
                    <td className="py-2 pr-3">{row.p95_latency_ms ?? '—'}</td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">
                      ≤{row.max_latency_ms}ms · ≥{row.min_success_rate}%
                    </td>
                    <td className="py-2">
                      <Badge variant={row.sla_met ? 'default' : 'destructive'}>
                        {row.sla_met ? 'OK' : 'Fuera'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SurfaceCard>
      )}

      {trendRows.length > 0 && (
        <SurfaceCard className="space-y-3 p-5">
          <SectionTitle>Tendencias 30 días</SectionTitle>
          <p className="text-sm text-muted-foreground">
            Eventos, entregas y engagement por día. Totales: {commTrends?.totals?.events ?? 0} eventos, {commTrends?.totals?.deliveries ?? 0} entregas.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-3">Día</th>
                  <th className="py-2 pr-3">Eventos</th>
                  <th className="py-2 pr-3">Entregas</th>
                  <th className="py-2">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {trendRows.slice(-14).map((row) => (
                  <tr key={row.day} className="border-b border-border/40">
                    <td className="py-1.5 pr-3 whitespace-nowrap">
                      {new Date(row.day).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="py-1.5 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 rounded-full bg-primary/70" style={{ width: `${Math.max(8, (row.events / maxTrendEvents) * 80)}px` }} />
                        <span>{row.events}</span>
                      </div>
                    </td>
                    <td className="py-1.5 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 rounded-full bg-emerald-500/70" style={{ width: `${Math.max(8, (row.deliveries / maxTrendDeliveries) * 80)}px` }} />
                        <span>{row.delivered}/{row.deliveries}</span>
                      </div>
                    </td>
                    <td className="py-1.5">{row.engagement} <span className="text-muted-foreground">({row.opened} abr)</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SurfaceCard>
      )}

      {slaAlerts.length > 0 && (
        <SurfaceCard className="space-y-3 p-5">
          <SectionTitle>Alertas SLA</SectionTitle>
          <p className="text-sm text-muted-foreground">
            Brechas detectadas automáticamente cuando un canal sale del objetivo.
          </p>
          <ul className="space-y-2 text-sm">
            {slaAlerts.map((alert) => (
              <li key={alert.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3">
                <div>
                  <p className="font-semibold">{alert.channel} · {alert.alert_type}</p>
                  <p className="text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(alert.created_at).toLocaleString('es-CO')} · {alert.status}
                    {alert.escalation_level > 0 ? ` · escalada nivel ${alert.escalation_level}` : ''}
                  </p>
                </div>
                {alert.status === 'open' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acknowledgeSlaMutation.mutate(alert.id)}
                    loading={acknowledgeSlaMutation.isPending}
                  >
                    Reconocer
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </SurfaceCard>
      )}

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
        <Button
          size="sm"
          variant="outline"
          onClick={() => processBroadcastMutation.mutate()}
          loading={processBroadcastMutation.isPending}
        >
          Procesar broadcasts
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => slaCheckMutation.mutate()}
          loading={slaCheckMutation.isPending}
        >
          Verificar SLA
        </Button>
        <Button size="sm" variant="outline" onClick={exportWeeklyReport}>
          Informe semanal (.md)
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => weeklyReportMutation.mutate()}
          loading={weeklyReportMutation.isPending}
        >
          Enviar informe a admins
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => consentWebhookMutation.mutate()}
          loading={consentWebhookMutation.isPending}
        >
          Procesar webhooks consent.
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
        <SectionTitle>Plantillas de broadcast</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Guarda segmentos y mensajes reutilizables. Lanza un broadcast con un clic.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Nombre plantilla"
            value={broadcastTplForm.name}
            onChange={(e) => setBroadcastTplForm({ ...broadcastTplForm, name: e.target.value })}
          />
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">Segmento</span>
            <select
              value={broadcastTplForm.segmentType}
              onChange={(e) => setBroadcastTplForm({ ...broadcastTplForm, segmentType: e.target.value })}
              className="h-10 w-full rounded-xl border border-input bg-background px-3"
            >
              {BROADCAST_SEGMENTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
          <Input
            label="Título"
            value={broadcastTplForm.title}
            onChange={(e) => setBroadcastTplForm({ ...broadcastTplForm, title: e.target.value })}
            className="sm:col-span-2"
          />
          <Input
            label="Cuerpo"
            value={broadcastTplForm.body}
            onChange={(e) => setBroadcastTplForm({ ...broadcastTplForm, body: e.target.value })}
            className="sm:col-span-2"
          />
        </div>
        <Button
          onClick={() => saveBroadcastTplMutation.mutate()}
          loading={saveBroadcastTplMutation.isPending}
          disabled={!broadcastTplForm.name || !broadcastTplForm.title}
        >
          Guardar plantilla
        </Button>
        <ul className="space-y-2 text-sm">
          {broadcastTemplates.map((tpl) => (
            <li key={tpl.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3">
              <div>
                <p className="font-semibold">{tpl.name}</p>
                <p className="text-muted-foreground">{tpl.title}</p>
                <p className="text-xs text-muted-foreground">{tpl.segment_type}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBroadcastTplForm({
                    id: tpl.id,
                    name: tpl.name,
                    title: tpl.title,
                    body: tpl.body || '',
                    segmentType: tpl.segment_type,
                    role: tpl.segment_value?.role || 'CLIENT',
                    municipio: tpl.segment_value?.municipio || 'Apartadó',
                  })}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  onClick={() => launchBroadcastTplMutation.mutate(tpl.id)}
                  loading={launchBroadcastTplMutation.isPending}
                >
                  Lanzar
                </Button>
              </div>
            </li>
          ))}
          {!broadcastTemplates.length && (
            <p className="text-muted-foreground">Sin plantillas — guarda una desde el formulario o un broadcast enviado.</p>
          )}
        </ul>
      </SurfaceCard>

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Broadcast por segmento</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Envío masivo a un grupo de usuarios. Se procesa en lotes de 20 vía cron o el botón &quot;Procesar broadcasts&quot;.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Nombre interno"
            value={broadcastForm.name}
            onChange={(e) => setBroadcastForm({ ...broadcastForm, name: e.target.value })}
            placeholder="Promo marzo"
          />
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">Segmento</span>
            <select
              value={broadcastForm.segmentType}
              onChange={(e) => {
                setBroadcastForm({ ...broadcastForm, segmentType: e.target.value });
                setSegmentCount(null);
              }}
              className="h-10 w-full rounded-xl border border-input bg-background px-3"
            >
              {BROADCAST_SEGMENTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
          {broadcastForm.segmentType === 'role' && (
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Rol</span>
              <select
                value={broadcastForm.role}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, role: e.target.value })}
                className="h-10 w-full rounded-xl border border-input bg-background px-3"
              >
                {USER_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>
          )}
          {broadcastForm.segmentType === 'municipio' && (
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Municipio</span>
              <select
                value={broadcastForm.municipio}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, municipio: e.target.value })}
                className="h-10 w-full rounded-xl border border-input bg-background px-3"
              >
                {MUNICIPIOS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
          )}
          <Input
            label="Título"
            value={broadcastForm.title}
            onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
            className="sm:col-span-2"
          />
          <Input
            label="Cuerpo"
            value={broadcastForm.body}
            onChange={(e) => setBroadcastForm({ ...broadcastForm, body: e.target.value })}
            className="sm:col-span-2"
          />
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block text-muted-foreground">Programar envío (opcional)</span>
            <input
              type="datetime-local"
              value={broadcastForm.scheduledAt}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, scheduledAt: e.target.value })}
              className="h-10 w-full rounded-xl border border-input bg-background px-3"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={previewSegmentCount}>
            Contar destinatarios
          </Button>
          {segmentCount != null && (
            <Badge variant="outline">{segmentCount} usuarios en el segmento</Badge>
          )}
          <Button
            onClick={() => broadcastMutation.mutate()}
            loading={broadcastMutation.isPending}
            disabled={!broadcastForm.name || !broadcastForm.title}
          >
            Crear broadcast
          </Button>
        </div>

        <ul className="space-y-2 text-sm">
          {broadcasts.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3">
              <div>
                <p className="font-semibold">{b.name}</p>
                <p className="text-muted-foreground">{b.title}</p>
                <p className="text-xs text-muted-foreground">
                  {b.segment_type} · {b.recipients_sent}/{b.recipients_total} enviados · {b.status}
                  {b.scheduled_at && b.status === 'pending'
                    ? ` · programado ${new Date(b.scheduled_at).toLocaleString('es-CO')}`
                    : ''}
                  {b.resend_count > 0 ? ` · ${b.resend_count} reenvío(s)` : ''}
                  {b.parent_broadcast_id ? ' · reenvío' : ''}
                </p>
                {b.completed_at && (
                  <p className="text-xs text-muted-foreground">
                    Completado: {new Date(b.completed_at).toLocaleString('es-CO')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {['pending', 'processing'].includes(b.status) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => cancelBroadcastMutation.mutate(b.id)}
                    loading={cancelBroadcastMutation.isPending}
                  >
                    Cancelar
                  </Button>
                )}
                {['completed', 'cancelled', 'failed'].includes(b.status) && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resendBroadcastMutation.mutate(b.id)}
                      loading={resendBroadcastMutation.isPending}
                    >
                      Reenviar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const segmentValue = b.segment_value || {};
                        saveBroadcastTemplate({
                          name: `${b.name} (plantilla)`,
                          title: b.title,
                          body: b.body,
                          segmentType: b.segment_type,
                          segmentValue,
                          eventKey: b.event_key,
                        }).then(() => {
                          queryClient.invalidateQueries({ queryKey: ['admin-comm-broadcast-templates'] });
                          toast('Guardado como plantilla');
                        }).catch((err) => toast(err.message, 'error'));
                      }}
                    >
                      Guardar plantilla
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
          {!broadcasts.length && (
            <p className="text-muted-foreground">Sin broadcasts creados.</p>
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
            onFocus={() => setTplField('title')}
            placeholder="Pedido {{orderNumber}}"
            className="sm:col-span-2"
          />
          <Input
            label="Cuerpo"
            value={tplForm.bodyTemplate}
            onChange={(e) => setTplForm({ ...tplForm, bodyTemplate: e.target.value })}
            onFocus={() => setTplField('body')}
            placeholder="Tu pedido está {{status}}"
            className="sm:col-span-2"
          />
        </div>

        {templateVariables.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Variables disponibles
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                (inserta en {tplField === 'body' ? 'cuerpo' : 'título'})
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {templateVariables.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  title={v.example ? `Ej: ${v.example}` : v.label}
                  onClick={() => insertVariable(v.key)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs hover:border-primary hover:text-primary"
                >
                  {v.placeholder}
                  <span className="ml-1 text-muted-foreground">{v.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => saveTplMutation.mutate()}
            loading={saveTplMutation.isPending}
            disabled={!tplForm.eventKey || !tplForm.titleTemplate}
          >
            Guardar plantilla
          </Button>
          <Button
            variant="outline"
            onClick={runTplPreview}
            disabled={!tplForm.eventKey || !tplForm.titleTemplate}
          >
            Vista previa
          </Button>
        </div>

        {tplPreview && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
            <p className="mb-1 font-semibold text-primary-dark">Vista previa</p>
            <p className="font-medium">{tplPreview.title}</p>
            {tplPreview.body && <p className="mt-1 text-muted-foreground">{tplPreview.body}</p>}
          </div>
        )}

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
        <SectionTitle>Webhooks SLA (Slack / n8n)</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Reciben POST JSON automático cuando se detecta una brecha SLA. Compatible con Slack incoming webhooks y n8n.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Nombre"
            value={slaWebhookForm.name}
            onChange={(e) => setSlaWebhookForm({ ...slaWebhookForm, name: e.target.value })}
            placeholder="Slack #alertas"
          />
          <Input
            label="URL"
            value={slaWebhookForm.url}
            onChange={(e) => setSlaWebhookForm({ ...slaWebhookForm, url: e.target.value })}
            placeholder="https://hooks.slack.com/..."
            className="sm:col-span-2"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => saveSlaWebhookMutation.mutate()}
            loading={saveSlaWebhookMutation.isPending}
            disabled={!slaWebhookForm.name || !slaWebhookForm.url}
          >
            {editingSlaWebhookId ? 'Actualizar' : 'Agregar webhook SLA'}
          </Button>
          {editingSlaWebhookId && (
            <Button variant="outline" onClick={() => { setEditingSlaWebhookId(null); setSlaWebhookForm(EMPTY_SLA_WEBHOOK); }}>
              Cancelar
            </Button>
          )}
        </div>
        <ul className="space-y-2">
          {slaWebhooks.map((wh) => (
            <li key={wh.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm">
              <div>
                <p className="font-semibold">{wh.name}</p>
                <p className="text-xs text-muted-foreground break-all">{wh.url}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingSlaWebhookId(wh.id);
                    setSlaWebhookForm({ name: wh.name, url: wh.url });
                  }}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteSlaWebhookMutation.mutate(wh.id)}
                  loading={deleteSlaWebhookMutation.isPending}
                >
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
          {!slaWebhooks.length && (
            <p className="text-sm text-muted-foreground">Sin webhooks SLA — las alertas solo llegan por push/in-app.</p>
          )}
        </ul>
      </SurfaceCard>

      <SurfaceCard className="space-y-3 p-5">
        <SectionTitle>Webhooks de consentimiento</SectionTitle>
        <p className="text-sm text-muted-foreground">
          POST automático cuando un usuario cambia marketing, digest, categorías o horario silencio.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Nombre"
            value={consentWebhookForm.name}
            onChange={(e) => setConsentWebhookForm({ ...consentWebhookForm, name: e.target.value })}
            placeholder="CRM / compliance"
          />
          <Input
            label="URL"
            value={consentWebhookForm.url}
            onChange={(e) => setConsentWebhookForm({ ...consentWebhookForm, url: e.target.value })}
            placeholder="https://..."
            className="sm:col-span-2"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => saveConsentWebhookMutation.mutate()}
            loading={saveConsentWebhookMutation.isPending}
            disabled={!consentWebhookForm.name || !consentWebhookForm.url}
          >
            {editingConsentWebhookId ? 'Actualizar' : 'Agregar webhook consent.'}
          </Button>
          {editingConsentWebhookId && (
            <Button variant="outline" onClick={() => { setEditingConsentWebhookId(null); setConsentWebhookForm(EMPTY_CONSENT_WEBHOOK); }}>
              Cancelar
            </Button>
          )}
        </div>
        <ul className="space-y-2">
          {consentWebhooks.map((wh) => (
            <li key={wh.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm">
              <div>
                <p className="font-semibold">{wh.name}</p>
                <p className="text-xs text-muted-foreground break-all">{wh.url}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingConsentWebhookId(wh.id);
                    setConsentWebhookForm({ name: wh.name, url: wh.url });
                  }}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteConsentWebhookMutation.mutate(wh.id)}
                  loading={deleteConsentWebhookMutation.isPending}
                >
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
          {!consentWebhooks.length && (
            <p className="text-sm text-muted-foreground">Sin webhooks — los cambios se registran en cola interna.</p>
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
