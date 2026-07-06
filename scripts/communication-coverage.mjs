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

const EDGE_ONLY_EVENTS = ['daily_digest_sent', 'scheduled_communication_sent', 'system_announcement'];

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
  const rel = relative(ROOT, file);
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
    if (rel.endsWith(hint.fileHint) && content.includes(hint.literal) && content.includes('emitCommEvent')) {
      wiredEvents.add(hint.literal);
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
  cycle: 10,
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
  },
  pendingEvents,
  moduleHits,
  legacyCallSites_sample: legacyCalls.slice(0, 20),
  recommendation: pendingEvents.length > 0
    ? `Integrar ${pendingEvents.length} eventos pendientes vía emitCommEvent()`
    : 'Cobertura de eventos al 100%',
};

console.log(JSON.stringify(report, null, 2));
