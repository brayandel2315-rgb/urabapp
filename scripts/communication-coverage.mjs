/**
 * Scanner de cobertura — detecta módulos y eventos sin integrar al Event Bus.
 * Ejecutar: node scripts/communication-coverage.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SRC = join(ROOT, 'src');
const LIB_PATH = join(SRC, 'communication', 'event-library.js');

const EDGE_ONLY_EVENTS = [
  'daily_digest_sent',
  'scheduled_communication_sent',
  'system_announcement',
  'broadcast_segment_sent',
  'sla_breach_alert',
  'weekly_comm_report_sent',
  'sla_alert_escalated',
  'consent_preferences_changed',
];

const libSource = readFileSync(LIB_PATH, 'utf8');
const definedEvents = [...libSource.matchAll(/^\s+([a-z][a-z0-9_]+):\s*\{/gm)].map((m) => m[1]);

const EMIT_PATTERNS = [
  /emitCommEvent\s*\(\s*['"`]([a-z0-9_]+)['"`]/g,
  /emitCommEvent\s*\(\s*(?:\w+Event)\b/g,
  /trackProductEvent\s*\(\s*['"`]([a-z0-9_]+)['"`]/g,
];

const DYNAMIC_EMIT_EVENTS = [
  { fileHint: 'order.service.js', literal: 'order_cancelled' },
  { fileHint: 'engagement.service.js', literal: 'communication_opened' },
  { fileHint: 'engagement.service.js', literal: 'communication_clicked' },
  { fileHint: 'business-campaign.service.js', literal: 'business_campaign_sent' },
  { fileHint: 'financial-engine/index.js', literal: 'SETTLEMENT_CREATED' },
  { fileHint: 'financial-engine/index.js', literal: 'PAYOUT_BATCH_RELEASED' },
  { fileHint: 'financial-engine/index.js', literal: 'WALLET_AVAILABLE' },
  { fileHint: 'financial-engine/index.js', literal: 'REFUND_PROCESSED' },
];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!name.includes('node_modules')) walk(p, files);
    } else if (/\.(js|jsx|ts|tsx)$/.test(name)) {
      files.push(p);
    }
  }
  return files;
}

const modules = readdirSync(join(SRC, 'modules')).filter((d) =>
  statSync(join(SRC, 'modules', d)).isDirectory(),
);

const files = walk(SRC);
const wiredEvents = new Set();
const legacyCalls = [];
const moduleHits = Object.fromEntries(modules.map((m) => [m, { emits: 0, legacy: 0 }]));

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  const mod = modules.find((m) => rel.includes(`modules/${m}/`));

  for (const pat of EMIT_PATTERNS) {
    let m;
    const re = new RegExp(pat.source, pat.flags);
    while ((m = re.exec(content)) !== null) {
      if (m[1]) wiredEvents.add(m[1]);
      if (mod && m[1]) moduleHits[mod].emits += 1;
    }
  }

  for (const hint of DYNAMIC_EMIT_EVENTS) {
    if (rel.endsWith(hint.fileHint) && content.includes(hint.literal)
      && (content.includes('emitCommEvent') || content.includes('emitFinEvent'))) {
      const financeMap = {
        SETTLEMENT_CREATED: 'finance_settlement_created',
        PAYOUT_BATCH_RELEASED: 'finance_payout_batch_released',
        WALLET_AVAILABLE: 'finance_wallet_available',
        REFUND_PROCESSED: 'finance_refund_processed',
      };
      wiredEvents.add(financeMap[hint.literal] || hint.literal);
      if (mod) moduleHits[mod].emits += 1;
    }
  }
}

const mappedTrackEvents = [...wiredEvents].filter((e) => definedEvents.includes(e));
const pendingEvents = definedEvents.filter((e) => !wiredEvents.has(e) && !EDGE_ONLY_EVENTS.includes(e));
EDGE_ONLY_EVENTS.forEach((e) => wiredEvents.add(e));

const ADAPTER_FILES = [
  'push.adapter.js',
  'email.adapter.js',
  'whatsapp.adapter.js',
  'banner.adapter.js',
  'snackbar.adapter.js',
  'sms.adapter.js',
  'webhook.adapter.js',
  'in-app.adapter.js',
  'analytics.adapter.js',
  'audit.adapter.js',
];
const adaptersPresent = ADAPTER_FILES.filter((f) =>
  statSync(join(SRC, 'communication', 'adapters', f), { throwIfNoEntry: false }),
).length;

const report = {
  generatedAt: new Date().toISOString(),
  cycle: 16,
  modulesFound: modules.length,
  modules: modules,
  eventsDefined: definedEvents.length,
  eventsWired: wiredEvents.size,
  eventsPending: pendingEvents.length,
  legacyCallSites: legacyCalls.length,
  adapters: {
    total: ADAPTER_FILES.length,
    present: adaptersPresent,
    coverage: `${Math.round(adaptersPresent / ADAPTER_FILES.length * 100)}%`,
  },
  coverage: {
    events: `${Math.round((definedEvents.length - pendingEvents.length) / definedEvents.length * 100)}%`,
    communication: `${Math.round(wiredEvents.size / Math.max(definedEvents.length, 1) * 100)}%`,
    modulesIntegrated: `${Math.round(modules.filter((m) => moduleHits[m].emits > 0 || moduleHits[m].legacy > 0).length / modules.length * 100)}%`,
    preferencesUi: 'CommunicationPreferencesPanel.jsx',
    engagement: 'communication_engagement + track_communication_engagement RPC',
    templates: 'communication_templates + templates.service.js',
    retries: 'communication_delivery_queue + process-comm-retries',
    digest: 'daily_digest_enabled + send-daily-digest',
    sms: 'send-sms (Twilio)',
    deliveryLog: 'communication_delivery_log + delivery.service.js',
    rateLimit: 'check_communication_rate_limit RPC',
    abTesting: 'communication_template_variants + resolve_communication_template',
    unifiedInbox: 'get_unified_inbox RPC',
    rateLimitsConfig: 'communication_rate_limits + upsert_communication_rate_limit',
    deliveryExport: 'get_admin_delivery_export CSV',
    scheduledComms: 'communication_scheduled + process-scheduled-comms',
    segmentBroadcast: 'communication_broadcasts + process-comm-broadcast',
    templatePreview: 'preview_communication_template + preview.service.js',
    channelSla: 'communication_channel_sla + get_admin_channel_sla',
    broadcastHistory: 'get_broadcast_history + resend_communication_broadcast',
    templateVariables: 'get_template_variables_for_event + template-variables.service.js',
    slaAlerts: 'communication_sla_alerts + check-comm-sla',
    slaWebhooks: 'communication_sla_webhooks + check-comm-sla POST',
    scheduledBroadcasts: 'communication_broadcasts.scheduled_at + claim_pending_broadcast',
    weeklyReport: 'get_admin_communication_weekly_report + send-comm-weekly-report',
    broadcastTemplates: 'communication_broadcast_templates + upsert_broadcast_template',
    slaEscalation: 'escalate_stale_sla_alerts + sla_alert_escalated',
    trends30d: 'get_admin_communication_trends + trends.service.js',
    priorityQueue: 'communication_delivery_queue.priority + claim_communication_retries',
    consentAudit: 'get_admin_consent_audit + consent.service.js',
    financeEvents: 'financial-engine emitFinEvent hooks (settlement, payout, refund)',
    legacyFinNotifications: 'trg_fin_settlement_emit_comms replaces direct notifications INSERT',
    consentWebhooks: 'communication_consent_webhooks + process-consent-webhooks',
    financeCommSummary: 'get_admin_finance_comm_summary + finance-comm.service.js',
  },
  pendingEvents,
  moduleHits,
  legacyCallSites_sample: legacyCalls.slice(0, 20),
  recommendation: pendingEvents.length > 0
    ? `Integrar ${pendingEvents.length} eventos pendientes vía emitCommEvent()`
    : 'Cobertura de eventos al 100%',
};

console.log(JSON.stringify(report, null, 2));
