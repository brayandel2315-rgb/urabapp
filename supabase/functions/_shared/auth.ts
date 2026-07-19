import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { jsonResponse } from './cors.ts';
import { getServiceClient } from './supabase.ts';

export type AuthUser = { id: string; email?: string };

function getBearerToken(req: Request): string | null {
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

/** Usuario JWT de Supabase (anon + sesión) o null */
export async function getAuthUser(req: Request): Promise<AuthUser | null> {
  const token = getBearerToken(req);
  if (!token) return null;

  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anonKey) return null;

  const client = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;
  return { id: user.id, email: user.email ?? undefined };
}

export function isServiceRoleRequest(req: Request): boolean {
  const token = getBearerToken(req);
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  return Boolean(token && serviceKey && token === serviceKey);
}

function hasValidAnonKey(req: Request): boolean {
  const key = req.headers.get('apikey');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  return Boolean(key && anonKey && key === anonKey);
}

export async function requireAuthUser(req: Request): Promise<AuthUser | Response> {
  if (isServiceRoleRequest(req)) {
    return { id: 'service-role' };
  }
  const user = await getAuthUser(req);
  if (!user) {
    return jsonResponse({ error: 'No autorizado' }, 401);
  }
  return user;
}

/** JWT o apikey del proyecto (invocación desde cliente Supabase sin sesión) */
export async function requireAuthOrProjectKey(req: Request): Promise<AuthUser | Response> {
  if (isServiceRoleRequest(req)) {
    return { id: 'service-role' };
  }
  const user = await getAuthUser(req);
  if (user) return user;
  if (hasValidAnonKey(req)) {
    return { id: 'anon-client' };
  }
  return jsonResponse({ error: 'No autorizado' }, 401);
}

export async function isAdminUser(userId: string): Promise<boolean> {
  if (userId === 'service-role') return true;
  const supabase = getServiceClient();
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  return data?.role === 'ADMIN';
}

/** Push: self, admin, service role, participante del pedido o dueño del comercio */
export async function canSendPushTo(callerId: string, targetUserId: string): Promise<boolean> {
  if (callerId === 'service-role' || callerId === targetUserId) return true;
  if (await isAdminUser(callerId)) return true;

  const supabase = getServiceClient();

  const { count: businessToCustomer } = await supabase
    .from('orders')
    .select('id, businesses!inner(owner_id)', { count: 'exact', head: true })
    .eq('customer_id', targetUserId)
    .eq('businesses.owner_id', callerId);
  if ((businessToCustomer ?? 0) > 0) return true;

  const { data: targetDriver } = await supabase
    .from('drivers')
    .select('id')
    .eq('user_id', targetUserId)
    .maybeSingle();

  if (targetDriver?.id) {
    const { count: assigned } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('customer_id', callerId)
      .eq('driver_id', targetDriver.id);
    if ((assigned ?? 0) > 0) return true;

    const { data: offers } = await supabase
      .from('courier_offers')
      .select('order_id, orders!inner(customer_id)')
      .eq('driver_id', targetDriver.id)
      .eq('orders.customer_id', callerId)
      .in('status', ['pending', 'accepted'])
      .limit(1);
    if (offers?.length) return true;
  }

  const { data: callerDriver } = await supabase
    .from('drivers')
    .select('id')
    .eq('user_id', callerId)
    .maybeSingle();

  if (callerDriver?.id) {
    const { count: riderOrder } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('driver_id', callerDriver.id)
      .eq('customer_id', targetUserId);
    if ((riderOrder ?? 0) > 0) return true;
  }

  return false;
}

/** WhatsApp: service role, admin, teléfono propio o pedido reciente del caller */
export async function canSendWhatsAppTo(callerId: string, phone: string): Promise<boolean> {
  if (callerId === 'service-role') return true;
  if (await isAdminUser(callerId)) return true;

  const digits = phone.replace(/\D/g, '').slice(-10);
  const supabase = getServiceClient();

  const sinceWeek = new Date(Date.now() - 7 * 24 * 3600000).toISOString();
  const { data: bizOrders } = await supabase
    .from('orders')
    .select('users!customer_id(phone), businesses!inner(owner_id)')
    .eq('businesses.owner_id', callerId)
    .gte('created_at', sinceWeek)
    .limit(100);

  if (bizOrders?.some((row) => {
    const p = (row.users as { phone?: string } | null)?.phone?.replace(/\D/g, '').slice(-10);
    return p === digits;
  })) return true;

  const { data: user } = await supabase
    .from('users')
    .select('phone')
    .eq('id', callerId)
    .maybeSingle();

  const own = user?.phone?.replace(/\D/g, '').slice(-10);
  return Boolean(own && own === digits);
}
