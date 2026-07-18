import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');

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
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
const ownerEmail = env.VITE_OWNER_EMAIL || 'brayandel001@gmail.com';

let failed = false;

function pass(label) {
  console.log(`✅ ${label}`);
}

function fail(label, detail = '') {
  failed = true;
  console.log(`❌ ${label}${detail ? ` — ${detail}` : ''}`);
}

function warn(label) {
  console.log(`⚠️  ${label}`);
}

console.log('\n🔍 Verificando Urabapp ↔ Supabase (Fase 1)\n');
console.log('Cuenta:', ownerEmail);
console.log('URL:', url || '(no configurada)\n');

if (!url || !key) {
  console.error('❌ Falta .env.local con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY\n');
  process.exit(1);
}

const supabase = createClient(url, key);

try {
  const res = await fetch(`${url}/rest/v1/`, { headers: { apikey: key } });
  if (res.ok) pass('REST API conectada');
  else warn(`REST API respondió ${res.status} (tablas pueden funcionar igual)`);
} catch (err) {
  fail('REST API', err.message);
}

const tables = [
  'users', 'businesses', 'products', 'orders', 'drivers', 'categories', 'banners', 'order_items',
  'promotions', 'shipment_orders', 'user_subscriptions', 'membership_plans', 'user_coupon_assignments',
  'courier_wallet', 'courier_payout', 'push_subscriptions', 'membership_payments',
];
const idColumn = { courier_wallet: 'driver_id' };
for (const table of tables) {
  const col = idColumn[table] || 'id';
  const { error } = await supabase.from(table).select(col).limit(1);
  if (error) fail(`Tabla ${table}`, error.message);
  else pass(`Tabla ${table}`);
}

const { count: bizTotal, error: bizErr } = await supabase
  .from('businesses')
  .select('id', { count: 'exact', head: true })
  .eq('is_active', true);
const { count: bizApartado } = await supabase
  .from('businesses')
  .select('id', { count: 'exact', head: true })
  .eq('municipio', 'Apartadó')
  .eq('is_active', true);
if (bizErr) fail('Comercios', bizErr.message);
else if ((bizTotal ?? 0) >= 50) pass(`Comercios totales: ${bizTotal} (Fase 2 ✓) · Apartadó: ${bizApartado ?? 0}`);
else if ((bizTotal ?? 0) >= 20) pass(`Comercios: ${bizTotal} (Fase 1 ✓) · meta Fase 2: 50`);
else warn(`Comercios: ${bizTotal ?? 0} (meta Fase 2: 50)`);

const { count: prodCount } = await supabase
  .from('products')
  .select('id', { count: 'exact', head: true })
  .eq('is_available', true);
if ((prodCount ?? 0) >= 20) pass(`Productos activos: ${prodCount}`);
else warn(`Productos activos: ${prodCount ?? 0}`);

{
  const adminClient = serviceKey
    ? createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
    : supabase;
  const { data: adminUser } = await adminClient
    .from('users')
    .select('role')
    .eq('email', ownerEmail)
    .maybeSingle();
  if (adminUser?.role === 'ADMIN') pass(`Admin ${ownerEmail}`);
  else warn(`Usuario ${ownerEmail} no es ADMIN — ejecuta 002_admin_brayan.sql tras login`);
}

const { data: slugSample } = await supabase
  .from('businesses')
  .select('slug')
  .not('slug', 'is', null)
  .limit(1);
if (slugSample?.length) pass('Slugs de tiendas (migración 006)');
else warn('Sin slugs — ejecuta migración 006');

if (env.VITE_APP_URL) pass(`VITE_APP_URL=${env.VITE_APP_URL}`);
else warn('Falta VITE_APP_URL en .env.local');

if (env.VITE_WHATSAPP_NUMBER && env.VITE_WHATSAPP_NUMBER !== '573001234567') {
  pass('WhatsApp operador configurado');
} else {
  warn('VITE_WHATSAPP_NUMBER es placeholder — pon tu número real');
}

if (env.VITE_WOMPI_ENABLED === 'true' || env.VITE_WOMPI_PUBLIC_KEY) pass('Wompi habilitado en cliente');
else warn('Wompi no habilitado — VITE_WOMPI_ENABLED / VITE_WOMPI_PUBLIC_KEY');

if (env.VITE_WHATSAPP_API_ENABLED === 'true') pass('WhatsApp API habilitado');
else warn('VITE_WHATSAPP_API_ENABLED=false — solo wa.me manual');

console.log(failed ? '\n❌ Verificación con errores.\n' : '\n✅ Verificación Fase 1 completada.\n');
process.exit(failed ? 1 : 0);
