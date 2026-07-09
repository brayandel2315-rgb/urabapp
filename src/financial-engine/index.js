import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';
import { mapApiError } from '@/utils/errors';
import { WALLET_OWNER } from './types';

function parseRpc(data) {
  if (typeof data === 'string') return JSON.parse(data);
  return data;
}

async function loadOrderParties(orderId) {
  if (!isSupabaseConfigured || !orderId) return null;
  const { data, error } = await supabase
    .from('orders')
    .select('order_number, driver_id, business_id, customer_id, drivers(user_id), businesses(owner_id)')
    .eq('id', orderId)
    .maybeSingle();
  if (error) throw new Error(mapApiError(error));
  return data;
}

async function emitPayoutNotifications(batchId, total) {
  if (!batchId) return;
  const { emitFinEvent } = await import('./events');
  const { data: items, error } = await supabase
    .from('fin_payout_batch_items')
    .select('owner_type, owner_id, amount')
    .eq('batch_id', batchId);
  if (error) return;

  for (const item of items ?? []) {
    let recipientId = null;
    if (item.owner_type === 'rider' && item.owner_id) {
      const { data: driver } = await supabase
        .from('drivers')
        .select('user_id')
        .eq('id', item.owner_id)
        .maybeSingle();
      recipientId = driver?.user_id;
      if (recipientId) {
        await emitFinEvent('PAYOUT_BATCH_RELEASED', {
          recipientId,
          payload: { amount: item.amount, ownerType: item.owner_type, batchId, total },
        });
      }
    } else if (item.owner_type === 'business' && item.owner_id) {
      const { data: business } = await supabase
        .from('businesses')
        .select('owner_id')
        .eq('id', item.owner_id)
        .maybeSingle();
      recipientId = business?.owner_id;
      if (recipientId) {
        await emitFinEvent('WALLET_AVAILABLE', {
          recipientId,
          payload: { amount: item.amount, ownerType: item.owner_type, batchId },
        });
      }
    }
  }
}

async function emitRefundNotification(orderId) {
  const { emitFinEvent } = await import('./events');
  const order = await loadOrderParties(orderId);
  if (!order?.customer_id) return;
  await emitFinEvent('REFUND_PROCESSED', {
    recipientId: order.customer_id,
    payload: { orderId, orderNumber: order.order_number },
  });
}

export const WalletService = {
  async getDashboard(ownerType, ownerId = null) {
    if (!isSupabaseConfigured) return null;
    const data = await sbFetch(
      supabase.rpc('fin_get_wallet_dashboard', {
        p_owner_type: ownerType,
        p_owner_id: ownerId,
      }),
      'Error cargando billetera financiera',
    );
    return parseRpc(data);
  },

  async getRiderDashboard(driverId) {
    return this.getDashboard(WALLET_OWNER.RIDER, driverId);
  },

  async getBusinessDashboard(businessId) {
    return this.getDashboard(WALLET_OWNER.BUSINESS, businessId);
  },
};

export const LedgerService = {
  async listEntries({ walletId, orderId, limit = 50 } = {}) {
    if (!isSupabaseConfigured) return [];
    let q = supabase
      .from('fin_ledger_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (walletId) q = q.eq('wallet_id', walletId);
    if (orderId) q = q.eq('order_id', orderId);
    const { data, error } = await q;
    if (error) throw new Error(mapApiError(error));
    return data ?? [];
  },
};

export const SettlementEngine = {
  /** Liquidación manual / retry — normalmente lo ejecuta el trigger en delivered. */
  async settleOrder(orderId) {
    if (!isSupabaseConfigured || !orderId) {
      return { success: false, reason: 'not_configured' };
    }
    const data = await sbFetch(
      supabase.rpc('fin_settle_order', { p_order_id: orderId }),
      'Error en liquidación del pedido',
    );
    const result = parseRpc(data);
    return result;
  },
};

export const PayoutEngine = {
  async releaseBatch(ownerType, cycle = 'weekly') {
    if (!isSupabaseConfigured) return { success: false };
    const data = await sbFetch(
      supabase.rpc('fin_release_payout_batch', {
        p_owner_type: ownerType,
        p_cycle: cycle,
      }),
      'Error procesando lote de liquidación',
    );
    const result = parseRpc(data);
    if (result?.success) {
      await emitPayoutNotifications(result.batch_id, result.total).catch(() => {});
    }
    return result;
  },
};

export const RefundService = {
  async processRefund(orderId, reason) {
    if (!isSupabaseConfigured) return { success: false };
    const data = await sbFetch(
      supabase.rpc('fin_process_refund', {
        p_order_id: orderId,
        p_reason: reason ?? null,
      }),
      'Error procesando reembolso',
    );
    const result = parseRpc(data);
    if (result?.success) {
      await emitRefundNotification(orderId).catch(() => {});
    }
    return result;
  },
};

export const CommissionEngine = {
  async listRules() {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('fin_commission_rules')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true });
    if (error) throw new Error(mapApiError(error));
    return data ?? [];
  },

  async upsertRule(rule) {
    if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
    const { data, error } = await supabase
      .from('fin_commission_rules')
      .upsert({ ...rule, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw new Error(mapApiError(error));
    return data;
  },
};

export const AccountingService = {
  async getPlatformDashboard() {
    if (!isSupabaseConfigured) return null;
    const data = await sbFetch(
      supabase.rpc('fin_get_platform_dashboard'),
      'Error cargando dashboard financiero',
    );
    return parseRpc(data);
  },

  async listSettlements({ limit = 50 } = {}) {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('fin_settlements')
      .select('*, orders(order_number, dest_municipio)')
      .order('settled_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(mapApiError(error));
    return data ?? [];
  },
};

export const AuditService = {
  async list({ limit = 100 } = {}) {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('fin_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(mapApiError(error));
    return data ?? [];
  },
};

export const TransactionService = {
  async listPaymentIntents(orderId) {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('fin_payment_intents')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(mapApiError(error));
    return data ?? [];
  },
};

export const FinanceNotificationService = {
  async notifySettlement({ recipientId, orderNumber, amount, ownerType, orderId }) {
    const { emitFinEvent } = await import('./events');
    return emitFinEvent('SETTLEMENT_CREATED', {
      recipientId,
      payload: { orderNumber, amount, ownerType, orderId },
    });
  },

  async notifyPayoutReleased({ recipientId, amount, ownerType, batchId }) {
    const { emitFinEvent } = await import('./events');
    return emitFinEvent('PAYOUT_BATCH_RELEASED', {
      recipientId,
      payload: { amount, ownerType, batchId },
    });
  },

  async notifyWalletAvailable({ recipientId, amount, ownerType }) {
    const { emitFinEvent } = await import('./events');
    return emitFinEvent('WALLET_AVAILABLE', {
      recipientId,
      payload: { amount, ownerType },
    });
  },

  async notifyRefund({ recipientId, orderId, orderNumber }) {
    const { emitFinEvent } = await import('./events');
    return emitFinEvent('REFUND_PROCESSED', {
      recipientId,
      payload: { orderId, orderNumber },
    });
  },
};
