#!/usr/bin/env node
/**
 * Pase E2E API: login cliente → pedido → negocio acepta/prepara → mensajero entrega.
 * Uso: node scripts/e2e-order-flow.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadEnvLocal() {
  const path = join(root, '.env.local');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [key, ...rest] = trimmed.split('=');
    const value = rest.join('=').trim().replace(/^["']|["']$/g, '');
    if (!process.env[key.trim()]) process.env[key.trim()] = value;
  }
}

loadEnvLocal();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.TEST_USERS_PASSWORD || 'B33.rayan';

const CLIENT = 'test.cliente@urabapp.com';
const BUSINESS = 'test.tienda@urabapp.com';
const RIDER = 'test.mensajero@urabapp.com';

// Apartadó centro (dentro de Urabá)
const COORDS = { lat: 7.8829, lng: -76.6259 };

const results = [];
function ok(step, detail = '') {
  results.push({ step, ok: true, detail });
  console.log(`✅ ${step}${detail ? ` — ${detail}` : ''}`);
}
function fail(step, detail) {
  results.push({ step, ok: false, detail });
  console.error(`❌ ${step} — ${detail}`);
}

function clientFor(session) {
  const c = createClient(url, anon, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  if (session) {
    c.auth.setSession(session);
  }
  return c;
}

async function signIn(email) {
  const c = createClient(url, anon, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await c.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`${email}: ${error.message}`);
  return { supabase: c, user: data.user, session: data.session };
}

async function main() {
  if (!url || !anon) {
    console.error('Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  console.log('\n🧪 E2E pedido Urabapp (API)\n');

  let clientAuth;
  let businessAuth;
  let riderAuth;
  let orderId;
  let businessId;
  let product;
  let driverId;

  try {
    clientAuth = await signIn(CLIENT);
    ok('Login cliente', clientAuth.user.id.slice(0, 8));
  } catch (e) {
    fail('Login cliente', e.message);
    process.exit(1);
  }

  try {
    businessAuth = await signIn(BUSINESS);
    ok('Login comercio', businessAuth.user.id.slice(0, 8));
  } catch (e) {
    fail('Login comercio', e.message);
  }

  try {
    riderAuth = await signIn(RIDER);
    ok('Login mensajero', riderAuth.user.id.slice(0, 8));
  } catch (e) {
    fail('Login mensajero', e.message);
  }

  // Prefer test store products; fallback any live product
  try {
    const admin = serviceKey
      ? createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
      : clientAuth.supabase;

    const { data: testBiz } = await admin
      .from('businesses')
      .select('id, name, is_open, is_published, verification_status, min_order, delivery_fee')
      .eq('owner_id', businessAuth?.user?.id || '00000000-0000-0000-0000-000000000000')
      .maybeSingle();

    if (testBiz) {
      businessId = testBiz.id;
      ok('Comercio de prueba', testBiz.name);
    } else {
      const { data: anyBiz, error } = await clientAuth.supabase
        .from('businesses')
        .select('id, name, min_order, delivery_fee')
        .eq('is_active', true)
        .eq('is_published', true)
        .eq('is_open', true)
        .limit(1)
        .maybeSingle();
      if (error || !anyBiz) throw new Error(error?.message || 'Sin comercios disponibles');
      businessId = anyBiz.id;
      ok('Comercio fallback', anyBiz.name);
    }

    const { data: products, error: pErr } = await admin
      .from('products')
      .select('id, name, price, business_id, is_available')
      .eq('business_id', businessId)
      .eq('is_available', true)
      .limit(1);

    if (pErr) throw new Error(pErr.message);
    product = products?.[0];

    if (!product) {
      // seed one product for test store
      const { data: seeded, error: seedErr } = await admin
        .from('products')
        .insert({
          business_id: businessId,
          name: 'Producto E2E',
          price: 12000,
          is_available: true,
          category: 'comida',
          description: 'Producto temporal para pase E2E',
        })
        .select('id, name, price, business_id')
        .single();
      if (seedErr) throw new Error(`Sin producto y no se pudo crear: ${seedErr.message}`);
      product = seeded;
      ok('Producto E2E creado', `${product.name} $${product.price}`);
    } else {
      ok('Producto listo', `${product.name} $${product.price}`);
    }
  } catch (e) {
    fail('Resolver comercio/producto', e.message);
    process.exit(1);
  }

  // Ensure store is open for order
  if (serviceKey && businessId) {
    const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
    await admin.from('businesses').update({
      is_open: true,
      is_active: true,
      is_published: true,
      verification_status: 'approved',
    }).eq('id', businessId);
  }

  // Create order as client (mimic createOrder payload)
  try {
    const qty = 1;
    const subtotal = Number(product.price) * qty;
    const deliveryFee = 3500;
    const total = subtotal + deliveryFee;

    const { data: order, error } = await clientAuth.supabase
      .from('orders')
      .insert({
        customer_id: clientAuth.user.id,
        business_id: businessId,
        status: 'pending',
        dest_municipio: 'Apartadó',
        dest_address: 'Calle E2E 1 #2-3, Centro',
        dest_latitude: COORDS.lat,
        dest_longitude: COORDS.lng,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        payment_method: 'cash',
        payment_status: 'pending',
        notes: 'Pedido E2E automatizado',
        tip_amount: 0,
      })
      .select('id, order_number, status, total')
      .single();

    if (error) throw new Error(error.message);
    orderId = order.id;

    const { error: itemsErr } = await clientAuth.supabase.from('order_items').insert({
      order_id: orderId,
      product_id: product.id,
      name: product.name,
      emoji: 'package',
      quantity: qty,
      unit_price: product.price,
      total_price: subtotal,
      notes: null,
      modifiers_json: [],
      fulfillment_status: 'pending',
    });
    if (itemsErr) throw new Error(`order_items: ${itemsErr.message}`);

    ok('Crear pedido (cliente)', `${order.order_number || orderId.slice(0, 8)} · $${order.total}`);
  } catch (e) {
    fail('Crear pedido (cliente)', e.message);
    process.exit(1);
  }

  // Business: accept → preparing
  if (businessAuth) {
    try {
      const { error: e1 } = await businessAuth.supabase
        .from('orders')
        .update({ status: 'accepted', accepted_at: new Date().toISOString() })
        .eq('id', orderId);
      if (e1) throw new Error(e1.message);
      ok('Comercio acepta', 'accepted');

      const { error: e2 } = await businessAuth.supabase
        .from('orders')
        .update({ status: 'preparing' })
        .eq('id', orderId);
      if (e2) throw new Error(e2.message);
      ok('Comercio prepara', 'preparing');
    } catch (e) {
      fail('Comercio actualiza estado', e.message);
    }
  }

  // Rider profile + assign + deliver
  if (riderAuth) {
    try {
      const { data: driver, error: dErr } = await riderAuth.supabase
        .from('drivers')
        .select('id, is_online, verification_status')
        .eq('user_id', riderAuth.user.id)
        .maybeSingle();
      if (dErr) throw new Error(dErr.message);
      if (!driver) throw new Error('Perfil driver no existe para test.mensajero');
      driverId = driver.id;

      if (serviceKey) {
        const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
        await admin.from('drivers').update({
          is_online: true,
          is_available: true,
          verification_status: 'approved',
        }).eq('id', driverId);
      }

      ok('Perfil mensajero', driverId.slice(0, 8));

      // Assign driver (may require service role / RPC depending on RLS)
      let assignErr = null;
      {
        const { error } = await riderAuth.supabase
          .from('orders')
          .update({ driver_id: driverId, status: 'on_the_way' })
          .eq('id', orderId);
        assignErr = error;
      }
      if (assignErr && serviceKey) {
        const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
        const { error } = await admin
          .from('orders')
          .update({ driver_id: driverId, status: 'on_the_way' })
          .eq('id', orderId);
        if (error) throw new Error(`assign rider: ${assignErr.message} | admin: ${error.message}`);
        ok('Asignar mensajero (admin fallback)', 'on_the_way');
      } else if (assignErr) {
        throw new Error(assignErr.message);
      } else {
        ok('Asignar mensajero', 'on_the_way');
      }

      const { error: delErr } = await riderAuth.supabase
        .from('orders')
        .update({ status: 'delivered', delivered_at: new Date().toISOString() })
        .eq('id', orderId);
      if (delErr && serviceKey) {
        const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
        const { error } = await admin
          .from('orders')
          .update({ status: 'delivered', delivered_at: new Date().toISOString() })
          .eq('id', orderId);
        if (error) throw new Error(`deliver: ${delErr.message} | admin: ${error.message}`);
        ok('Entregar (admin fallback)', 'delivered');
      } else if (delErr) {
        throw new Error(delErr.message);
      } else {
        ok('Entregar', 'delivered');
      }
    } catch (e) {
      fail('Flujo mensajero', e.message);
    }
  }

  // Client can read final order
  try {
    const { data: finalOrder, error } = await clientAuth.supabase
      .from('orders')
      .select('id, status, driver_id, total')
      .eq('id', orderId)
      .single();
    if (error) throw new Error(error.message);
    if (finalOrder.status !== 'delivered') {
      fail('Cliente ve entregado', `status=${finalOrder.status}`);
    } else {
      ok('Cliente ve entregado', finalOrder.status);
    }
  } catch (e) {
    fail('Cliente lee pedido final', e.message);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n── Resultado: ${results.length - failed.length}/${results.length} OK ──`);
  if (orderId) console.log(`Pedido: ${orderId}`);
  if (failed.length) {
    console.log('\nFallos:');
    for (const f of failed) console.log(` - ${f.step}: ${f.detail}`);
    process.exit(1);
  }
  console.log('\n✅ Pase E2E API completado\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
