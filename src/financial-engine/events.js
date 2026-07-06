import { emitCommEvent } from '@/communication';
import { FIN_EVENTS } from './types';

/** Emite eventos financieros vía Communication Center (desacoplado). */
export async function emitFinEvent(eventKey, { recipientId, actorId, payload = {} } = {}) {
  const key = FIN_EVENTS[eventKey] ?? eventKey;
  return emitCommEvent(key, {
    recipientId,
    actorId,
    payload: { ...payload, source: 'financial_engine' },
  });
}
