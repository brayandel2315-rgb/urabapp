import { invokeEdgeFunction } from '@/services/edge.service';

/** Relay de webhooks — solo activo con VITE_COMM_WEBHOOK_RELAY; la entrega real es server-side en edge. */
export async function deliverWebhook({ eventKey, payload, recipientId }) {
  if (import.meta.env.VITE_COMM_WEBHOOK_RELAY !== 'true') return false;
  try {
    const result = await invokeEdgeFunction('dispatch-comm-webhook', {
      eventKey,
      payload,
      recipientId,
    });
    return (result?.delivered ?? 0) > 0;
  } catch (err) {
    console.warn('[comm-webhook]', err.message);
    return false;
  }
}
