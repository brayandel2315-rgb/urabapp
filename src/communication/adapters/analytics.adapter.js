import { trackProductEvent } from '@/services/analytics.service';

export async function deliverAnalytics(eventKey, payload, userId) {
  await trackProductEvent(`comm_${eventKey}`, {
    ...payload,
    comm_event: eventKey,
    channel: 'communication_center',
  }, userId);
}
