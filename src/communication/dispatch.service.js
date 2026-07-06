import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch, sbExec } from '@/lib/supabase-query';
import { getEventDef, resolveDeepLink } from './event-library';
import { resolveCommunicationMessage } from './templates.service';
import { enqueueCommunicationRetry } from './retry.service';
import { COMM_CHANNELS } from './priorities';
import { deliverPush } from './adapters/push.adapter';
import { deliverAnalytics } from './adapters/analytics.adapter';
import { deliverAudit } from './adapters/audit.adapter';
import { deliverInApp } from './adapters/in-app.adapter';
import { deliverEmail, resolveUserEmail } from './adapters/email.adapter';
import { deliverWhatsApp } from './adapters/whatsapp.adapter';
import { deliverBanner } from './adapters/banner.adapter';
import { deliverSnackbar } from './adapters/snackbar.adapter';
import { deliverSms } from './adapters/sms.adapter';
import { deliverWebhook } from './adapters/webhook.adapter';
import { getCommunicationPreferences, isChannelAllowed, isQuietHours } from './preferences.service';
import { isChannelRateLimited, logCommunicationDelivery } from './delivery.service';

const RATE_LIMITED = new Set(['push', 'email', 'sms', 'whatsapp']);

async function deliverChannel({
  key, recipientId, eventId, channel, variantKey, attempt,
}) {
  if (recipientId && RATE_LIMITED.has(channel)) {
    const limited = await isChannelRateLimited(recipientId, channel);
    if (limited) {
      await logCommunicationDelivery({
        eventKey: key, recipientId, channel, status: 'rate_limited', eventId, variantKey,
      });
      return false;
    }
  }
  const t0 = performance.now();
  const sent = await attempt();
  await logCommunicationDelivery({
    eventKey: key,
    recipientId,
    channel,
    status: sent ? 'delivered' : 'failed',
    eventId,
    variantKey,
    latencyMs: Math.round(performance.now() - t0),
    error: sent ? null : `${channel}_failed`,
  });
  return sent;
}

/** Orquestador central — ningún módulo debe llamar push/notifications/analytics directamente. */
export async function dispatchCommunication({ key, recipientId, actorId, payload = {}, meta = {} }) {
  const def = getEventDef(key);
  const category = payload.category || def?.category || 'system';
  const priority = payload.priority || def?.priority || 'medium';
  const resolved = await resolveCommunicationMessage(key, payload, recipientId);
  const variantKey = resolved.variantKey;
  const channels = payload.channels || resolved.channelsOverride || def?.channels || [COMM_CHANNELS.IN_APP, COMM_CHANNELS.PUSH];
  const title = payload.title || resolved.title || key;
  const body = payload.body || resolved.body || '';
  const deepLink = resolveDeepLink(key, payload);

  const enrichedPayload = {
    ...payload,
    event_key: key,
    deep_link: deepLink,
    actor_id: actorId,
  };

  const prefs = recipientId
    ? await getCommunicationPreferences(recipientId).catch(() => null)
    : null;
  const quiet = prefs && isQuietHours(prefs);
  const marketingBlocked = category === 'marketing' && !prefs?.marketing_enabled;

  const delivered = [];
  let eventId = null;

  if (recipientId && isSupabaseConfigured && !marketingBlocked) {
    const inAppOk = !prefs || isChannelAllowed(prefs, category, 'in_app');
    if (inAppOk) {
      try {
        eventId = await sbFetch(
          supabase.rpc('emit_communication_event', {
            p_event_key: key,
            p_category: category,
            p_priority: priority,
            p_recipient_id: recipientId,
            p_title: title,
            p_body: body,
            p_payload: enrichedPayload,
            p_deep_link: deepLink,
            p_actor_id: actorId,
            p_icon: def?.icon || null,
            p_color: def?.color || null,
            p_channels: channels,
          }),
          'Tiempo agotado emitiendo comunicación',
        );
        if (channels.includes(COMM_CHANNELS.IN_APP)) delivered.push(COMM_CHANNELS.IN_APP);
        await logCommunicationDelivery({
          eventKey: key, recipientId, channel: 'in_app', status: 'delivered', eventId, variantKey,
        });
      } catch (err) {
        if (channels.includes(COMM_CHANNELS.IN_APP)) {
          await deliverInApp({
            userId: recipientId,
            title,
            body,
            type: category,
            category,
            priority,
            data: { ...enrichedPayload, url: deepLink },
            eventId,
          }).catch(() => {});
          delivered.push(COMM_CHANNELS.IN_APP);
        }
        console.warn('[comm-dispatch] rpc fallback:', err.message);
      }
    }
  } else if (recipientId && channels.includes(COMM_CHANNELS.IN_APP) && !marketingBlocked) {
    await deliverInApp({
      userId: recipientId,
      title,
      body,
      type: category,
      category,
      priority,
      data: { ...enrichedPayload, url: deepLink },
    }).catch(() => {});
    delivered.push(COMM_CHANNELS.IN_APP);
  }

  const pushAllowed = (!prefs || isChannelAllowed(prefs, category, 'push'))
    && !(quiet && priority !== 'critical');
  if (recipientId && channels.includes(COMM_CHANNELS.PUSH) && pushAllowed && !marketingBlocked) {
    const sent = await deliverChannel({
      key, recipientId, eventId, channel: 'push', variantKey,
      attempt: () => deliverPush({
        userId: recipientId,
        title,
        body,
        data: { url: deepLink, event_key: key, ...enrichedPayload },
        priority,
      }),
    });
    if (sent) {
      delivered.push(COMM_CHANNELS.PUSH);
    } else {
      await enqueueCommunicationRetry({
        eventKey: key,
        recipientId,
        channel: 'push',
        eventId,
        payload: { title, body, deepLink, ...enrichedPayload },
        error: 'push_failed',
      });
    }
  }

  if (channels.includes(COMM_CHANNELS.ANALYTICS)) {
    await deliverAnalytics(key, enrichedPayload, recipientId);
    delivered.push(COMM_CHANNELS.ANALYTICS);
  }

  if (channels.includes(COMM_CHANNELS.AUDIT)) {
    await deliverAudit({ key, actorId, recipientId, payload: enrichedPayload, meta });
    delivered.push(COMM_CHANNELS.AUDIT);
  }

  const emailAllowed = !prefs || isChannelAllowed(prefs, category, 'email');
  if (recipientId && channels.includes(COMM_CHANNELS.EMAIL) && emailAllowed) {
    const email = payload.email || await resolveUserEmail(recipientId);
    if (email) {
      const sent = await deliverChannel({
        key, recipientId, eventId, channel: 'email', variantKey,
        attempt: () => deliverEmail({
          to: email,
          subject: title,
          body: body || title,
          userId: recipientId,
        }),
      });
      if (sent) {
        delivered.push(COMM_CHANNELS.EMAIL);
      } else {
        await enqueueCommunicationRetry({
          eventKey: key,
          recipientId,
          channel: 'email',
          eventId,
          payload: { to: email, subject: title, body: body || title },
          error: 'email_failed',
        });
      }
    }
  }

  if (channels.includes(COMM_CHANNELS.WHATSAPP) && payload.phone) {
    const sent = await deliverChannel({
      key, recipientId, eventId, channel: 'whatsapp', variantKey,
      attempt: () => deliverWhatsApp({
        phone: payload.phone,
        orderNumber: payload.orderNumber,
        status: payload.status,
        orderId: payload.orderId,
        text: body,
      }),
    });
    if (sent) {
      delivered.push(COMM_CHANNELS.WHATSAPP);
    } else {
      await enqueueCommunicationRetry({
        eventKey: key,
        recipientId,
        channel: 'whatsapp',
        eventId,
        payload: { phone: payload.phone, body, ...enrichedPayload },
        error: 'whatsapp_failed',
      });
    }
  }

  if (channels.includes(COMM_CHANNELS.BANNER)) {
    const sent = await deliverBanner({ title, body, deepLink, priority });
    if (sent) delivered.push(COMM_CHANNELS.BANNER);
  }

  if (channels.includes(COMM_CHANNELS.SNACKBAR)) {
    const sent = await deliverSnackbar({ title, body, priority });
    if (sent) delivered.push(COMM_CHANNELS.SNACKBAR);
  }

  if (channels.includes(COMM_CHANNELS.SMS) && (payload.phone || payload.email)) {
    const sent = await deliverChannel({
      key, recipientId, eventId, channel: 'sms', variantKey,
      attempt: () => deliverSms({
        phone: payload.phone,
        body: body || title,
        eventKey: key,
      }),
    });
    if (sent) {
      delivered.push(COMM_CHANNELS.SMS);
    } else {
      await enqueueCommunicationRetry({
        eventKey: key,
        recipientId,
        channel: 'sms',
        eventId,
        payload: { phone: payload.phone, body: body || title },
        error: 'sms_failed',
      });
    }
  }

  if (channels.includes(COMM_CHANNELS.WEBHOOK)) {
    const sent = await deliverWebhook({
      eventKey: key,
      payload: enrichedPayload,
      recipientId,
    });
    if (sent) {
      delivered.push(COMM_CHANNELS.WEBHOOK);
    } else {
      await enqueueCommunicationRetry({
        eventKey: key,
        recipientId,
        channel: 'webhook',
        eventId,
        payload: enrichedPayload,
        error: 'webhook_failed',
      });
    }
  }

  return { eventId, delivered, key, deepLink };
}

export async function getCommunicationTimeline(userId, { limit = 50, category = null } = {}) {
  if (!isSupabaseConfigured || !userId) return [];
  let q = supabase
    .from('communication_events')
    .select('*')
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (category && category !== 'all') q = q.eq('category', category);
  const data = await sbFetch(q, 'Tiempo agotado cargando timeline');
  return data ?? [];
}

export async function acknowledgeCommunicationEvent(eventId) {
  if (!isSupabaseConfigured || !eventId) return;
  await sbExec(
    supabase
      .from('communication_events')
      .update({ acknowledged: true, acknowledged_at: new Date().toISOString(), status: 'acknowledged' })
      .eq('id', eventId),
    'Tiempo agotado confirmando evento',
  );
}

export async function getCommunicationStats(userId) {
  if (!isSupabaseConfigured || !userId) {
    return { total: 0, unread: 0, byCategory: {} };
  }
  const [events, notifications] = await Promise.all([
    sbFetch(
      supabase.from('communication_events').select('category').eq('recipient_id', userId).limit(500),
      'stats events',
    ).catch(() => []),
    sbFetch(
      supabase.from('notifications').select('category, is_read').eq('user_id', userId).eq('is_archived', false).limit(500),
      'stats notifications',
    ).catch(() => []),
  ]);
  const byCategory = {};
  (events || []).forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + 1;
  });
  const unread = (notifications || []).filter((n) => !n.is_read).length;
  return { total: (notifications || []).length, unread, byCategory };
}
