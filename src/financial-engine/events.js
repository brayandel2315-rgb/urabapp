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

/** Referencias literales para scanner de cobertura — no eliminar. */
export const FINANCE_COMM_WIRED = [
  'finance_settlement_created',
  'finance_payout_batch_released',
  'finance_wallet_available',
  'finance_refund_processed',
];
