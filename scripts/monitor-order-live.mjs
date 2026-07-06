import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
const baseline = process.argv[2] || '2026-07-05T20:32:38.525Z';
const durationSec = Number(process.argv[3] || 180);
const intervalMs = 5000;

function loadEnv() {
  if (!existsSync(envPath)) return {};
  const lines = readFileSync(envPath, 'utf8').split('\n');
  const env = {};
  for (const line of lines) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) env[key.trim()] = rest.join('=').trim();
  }
  return env;
}

const env = loadEnv();
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
const seen = new Set();

console.log(`\n📡 Monitoreo pedidos nuevos desde ${baseline} (${durationSec}s)\n`);
console.log('Crea el pedido AHORA en https://urabapp.vercel.app\n');

const start = Date.now();
while (Date.now() - start < durationSec * 1000) {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, order_number, status, dest_municipio, payment_method, payment_status, driver_id, business_id, created_at')
    .gt('created_at', baseline)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error orders:', error.message);
  } else if (orders?.length) {
    for (const o of orders) {
      if (seen.has(o.id)) continue;
      seen.add(o.id);
      console.log(`\n🆕 PEDIDO DETECTADO ${new Date().toISOString()}`);
      console.log(JSON.stringify(o, null, 2));

      await new Promise((r) => setTimeout(r, 1500));

      const { data: offers } = await supabase
        .from('courier_offers')
        .select('id, driver_id, status, expires_at, payout_estimate, drivers(name, municipio, availability_mode)')
        .eq('order_id', o.id);

      console.log(`📦 Ofertas courier: ${offers?.length ?? 0}`);
      for (const off of offers ?? []) {
        const active = off.status === 'pending' && new Date(off.expires_at) > new Date();
        console.log(`  - ${off.drivers?.name || off.driver_id} | ${off.status} | activa=${active} | $${off.payout_estimate}`);
      }

      const { data: notifs } = await supabase
        .from('notifications')
        .select('user_id, title, body, created_at, data')
        .contains('data', { order_id: o.id })
        .order('created_at', { ascending: false })
        .limit(5);

      console.log(`🔔 Notificaciones: ${notifs?.length ?? 0}`);
      for (const n of notifs ?? []) {
        console.log(`  - ${n.title} | ${n.body?.slice(0, 60)}`);
      }
    }
  } else {
    process.stdout.write(`\r⏳ Esperando pedido... ${Math.round((Date.now() - start) / 1000)}s`);
  }

  await new Promise((r) => setTimeout(r, intervalMs));
}

console.log('\n\n✅ Monitoreo finalizado.\n');
