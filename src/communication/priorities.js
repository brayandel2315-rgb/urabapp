/** Prioridades — determinan sonido, persistencia y canal */
export const COMM_PRIORITIES = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  SILENT: 'silent',
};

export const COMM_PRIORITY_LABELS = {
  critical: 'Crítica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
  silent: 'Silenciosa',
};

export const COMM_PRIORITY_ORDER = ['critical', 'high', 'medium', 'low', 'silent'];

export const COMM_PRIORITY_SCORES = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  silent: 0,
};

export function priorityToScore(priority) {
  return COMM_PRIORITY_SCORES[priority] ?? COMM_PRIORITY_SCORES.medium;
}

/** Canales de entrega */
export const COMM_CHANNELS = {
  PUSH: 'push',
  IN_APP: 'in_app',
  CENTER: 'center',
  CHAT: 'chat',
  BANNER: 'banner',
  SNACKBAR: 'snackbar',
  MODAL: 'modal',
  EMAIL: 'email',
  SMS: 'sms',
  WEBHOOK: 'webhook',
  WHATSAPP: 'whatsapp',
  ANALYTICS: 'analytics',
  AUDIT: 'audit',
  LOG: 'log',
};
