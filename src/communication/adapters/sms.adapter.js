import { invokeEdgeFunction } from '@/services/edge.service';

/** Canal SMS — Twilio vía edge function send-sms. */
export async function deliverSms({ phone, body, eventKey }) {
  if (!phone || !body) return false;
  try {
    const result = await invokeEdgeFunction('send-sms', { phone, body, eventKey });
    return (result?.sent ?? 0) > 0;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[comm-sms]', err.message);
    }
    return false;
  }
}
