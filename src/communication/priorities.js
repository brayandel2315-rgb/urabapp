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
