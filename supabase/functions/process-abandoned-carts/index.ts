import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireCronServiceOrAdmin } from '../_shared/cron.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { emitCommunicationEvent } from '../_shared/notifications.ts';

const MIN_IDLE_MS = 25 * 60 * 1000; // 25 min sin actividad
const NUDGE_COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 h entre avisos
const MAX_NUDGES = 3;
const BATCH = 40;

function formatCop(n: number) {
  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(n || 0);
  } catch {
    return `$${n || 0}`;
  }
}

function stageFor(count: number): 'nudge' | 'return' | 'urgent' {
  if (count >= 2) return 'urgent';
  if (count === 1) return 'return';
  return 'nudge';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    await requireCronServiceOrAdmin(req);
    const supabase = getServiceClient();
    const now = Date.now();
    const idleBefore = new Date(now - MIN_IDLE_MS).toISOString();

    const { data: carts, error } = await supabase
      .from('abandoned_carts')
      .select('id, user_id, business_id, business_name, subtotal, updated_at, last_nudge_at, nudge_count')
      .is('recovered_at', null)
      .lt('updated_at', idleBefore)
      .order('updated_at', { ascending: true })
      .limit(BATCH);

    if (error) throw error;

    let sent = 0;
    let skipped = 0;

    for (const cart of carts ?? []) {
      const nudgeCount = Number(cart.nudge_count || 0);
      if (nudgeCount >= MAX_NUDGES) {
        skipped += 1;
        continue;
      }
      if (cart.last_nudge_at) {
        const last = new Date(cart.last_nudge_at).getTime();
        if (now - last < NUDGE_COOLDOWN_MS) {
          skipped += 1;
          continue;
        }
      }

      const stage = stageFor(nudgeCount);
      const store = cart.business_name || 'tu tienda';
      const total = formatCop(cart.subtotal || 0);
      const deepLink = cart.business_id ? `/tienda/${cart.business_id}` : '/carrito';

      const titles = {
        nudge: '¿Seguimos con tu pedido?',
        return: `¡${store} te espera!`,
        urgent: 'Tu pedido está a un toque',
      };
      const bodies = {
        nudge: `Dejaste productos en ${store} · ${total}. Toca y completa en segundos.`,
        return: `Vuelve y termina tu compra por ${total}. En minutos lo tienes en casa.`,
        urgent: `Último aviso: completa lo de ${store} (${total}) y te llega a domicilio.`,
      };

      await emitCommunicationEvent({
        eventKey: 'cart_recovery',
        recipientId: cart.user_id,
        category: 'reminders',
        priority: stage === 'urgent' ? 'high' : 'high',
        title: titles[stage],
        body: bodies[stage],
        deepLink,
        payload: {
          cartId: cart.id,
          businessId: cart.business_id,
          businessName: store,
          subtotal: cart.subtotal,
          subtotalLabel: total,
          stage,
          url: deepLink,
          ctaLabel: 'Completar pedido',
        },
        push: true,
      });

      await supabase
        .from('abandoned_carts')
        .update({
          last_nudge_at: new Date().toISOString(),
          nudge_count: nudgeCount + 1,
        })
        .eq('id', cart.id);

      sent += 1;
    }

    return jsonResponse({ ok: true, sent, skipped, scanned: (carts ?? []).length });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const status = message.includes('Unauthorized') ? 401 : 500;
    return jsonResponse({ ok: false, error: message }, status);
  }
});
