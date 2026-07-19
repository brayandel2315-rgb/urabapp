/**
 * Centro de Comunicación Urabapp.
 *
 * Contratos listos para fase nativa (Capacitor / Live Activity / notch):
 * imageUrl, stage, kind, deepLink, orderId — ver notification-visuals.js
 */
export { emitCommEvent, onCommEvent, onAnyCommEvent, registerCommMiddleware } from './event-bus';
export { EVENT_LIBRARY, getEventDef, listEventKeys, resolveDeepLink } from './event-library';
export { COMM_CATEGORIES, COMM_CATEGORY_LABELS, COMM_CATEGORY_ICONS } from './categories';
export { COMM_PRIORITIES, COMM_PRIORITY_LABELS, COMM_CHANNELS } from './priorities';
export {
  dispatchCommunication,
  getCommunicationTimeline,
  getCommunicationStats,
  acknowledgeCommunicationEvent,
} from './dispatch.service';
export { getCommunicationBadgeCount } from './badge.service';
export {
  getCommunicationPreferences,
  upsertCommunicationPreferences,
  syncLocalPrefsToServer,
  isChannelAllowed,
  isQuietHours,
} from './preferences.service';
export { trackCommunicationEngagement, getEngagementStats } from './engagement.service';
export { resolveCommunicationMessage, applyTemplateString, resolveCommunicationTemplate, clearTemplateCache } from './templates.service';
export { enqueueCommunicationRetry } from './retry.service';
export { logCommunicationDelivery, getAdminDeliveryMetrics, isChannelRateLimited } from './delivery.service';
export { getUnifiedInbox, resolveInboxSince } from './inbox.service';
export {
  getCommunicationRateLimits,
  saveCommunicationRateLimit,
  getScheduledCommunications,
  scheduleCommunication,
  cancelScheduledCommunication,
  downloadDeliveryMetricsCsv,
  rowsToCsv,
} from './schedule.service';
export {
  getCommunicationBroadcasts,
  countBroadcastRecipients,
  createCommunicationBroadcast,
  cancelCommunicationBroadcast,
  BROADCAST_SEGMENTS,
  USER_ROLES,
  MUNICIPIOS,
} from './broadcast.service';
export {
  previewTemplateLocal,
  previewTemplateRemote,
  getPreviewPayloadForEvent,
  TEMPLATE_PREVIEW_PAYLOADS,
} from './preview.service';
export {
  getLocalTemplateVariables,
  getTemplateVariablesForEvent,
  insertTemplateVariable,
} from './template-variables.service';
export {
  getCommunicationSlaAlerts,
  acknowledgeSlaAlert,
} from './sla.service';
export {
  getSlaWebhooks,
  upsertSlaWebhook,
  deleteSlaWebhook,
} from './sla-webhook.service';
export {
  getWeeklyCommunicationReport,
  downloadWeeklyReportMarkdown,
  formatReportMarkdown,
} from './report.service';
export {
  getBroadcastTemplates,
  saveBroadcastTemplate,
  createBroadcastFromTemplate,
} from './broadcast-template.service';
export {
  getCommunicationTrends,
  mergeTrendSeries,
  getTrendMax,
} from './trends.service';
