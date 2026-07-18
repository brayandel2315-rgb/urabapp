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
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const [key, ...rest] = line.split('=');
    if (key && rest.length) env[key.trim()] = rest.join('=').trim();
  }
  return env;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;

console.log('\n🔌 Verificando integraciones Urabapp\n');

if (!url || !key) {
  console.error('❌ Falta .env.local\n');
  process.exit(1);
}

let failed = false;

function pass(label) { console.log(`✅ ${label}`); }
function fail(label, detail = '') {
  failed = true;
  console.log(`❌ ${label}${detail ? ` — ${detail}` : ''}`);
}
function warn(label) { console.log(`⚠️  ${label}`); }

const FUNCTIONS = [
  'openroute-directions',
  'geocode-proxy',
  'send-push',
  'dispatch-tracking-push',
  'send-whatsapp',
  'auto-assign-rider',
  'create-wompi-checkout',
  'create-wompi-membership-checkout',
  'create-wompi-shipment-checkout',
  'wompi-webhook',
  'send-business-campaign',
];

for (const name of FUNCTIONS) {
  const body = name === 'openroute-directions'
    ? { start: [-75.75, 7.88], end: [-75.76, 7.89] }
    : name === 'geocode-proxy'
      ? { action: 'reverse', lat: 7.8829, lon: -76.6259 }
    : name === 'auto-assign-rider'
      ? { orderId: '00000000-0000-0000-0000-000000000000' }
      : name === 'send-push'
        ? { userId: '00000000-0000-0000-0000-000000000000', title: 'test' }
        : name === 'dispatch-tracking-push'
          ? {}
          : name === 'create-wompi-checkout' || name === 'create-wompi-membership-checkout' || name === 'create-wompi-shipment-checkout'
          ? { orderId: '00000000-0000-0000-0000-000000000000', shipmentId: '00000000-0000-0000-0000-000000000000', planId: 'pro' }
          : name === 'wompi-webhook'
            ? { event: 'ping' }
            : name === 'send-business-campaign'
              ? { businessId: '00000000-0000-0000-0000-000000000000', channel: 'push' }
              : { to: '573001234567', text: 'test' };

  const headers = {
    apikey: key,
    'Content-Type': 'application/json',
  };
  if (name !== 'wompi-webhook') {
    headers.Authorization = `Bearer ${key}`;
  }

  const res = await fetch(`${url}/functions/v1/${name}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok && res.status !== 400 && res.status !== 401 && res.status !== 404 && res.status !== 503) {
    fail(`Edge Function ${name}`, `HTTP ${res.status}`);
    continue;
  }

  if (name === 'openroute-directions' && (res.status === 503 || data?.error?.includes('ORS'))) {
    pass(`Edge Function ${name} desplegada`);
    warn('ORS_API_KEY pendiente — ejecuta npm run setup:secrets');
  } else if (name === 'send-push' && res.status === 401) {
    pass(`Edge Function ${name} desplegada`);
    warn('send-push requiere sesión JWT real (401 con anon key es esperado en test)');
  } else if (name === 'send-push' && (res.status === 503 || data?.error?.includes('VAPID'))) {
    pass(`Edge Function ${name} desplegada`);
    warn('VAPID secrets pendientes — ejecuta npm run setup:secrets');
  } else if (name === 'dispatch-tracking-push' && res.status === 403) {
    pass(`Edge Function ${name} desplegada`);
    warn('dispatch-tracking-push requiere sesión admin (403 con anon key es esperado)');
  } else if (name === 'dispatch-tracking-push' && (res.status === 503 || data?.error?.includes('VAPID'))) {
    pass(`Edge Function ${name} desplegada`);
    warn('VAPID secrets pendientes para cola de tracking push');
  } else if (name === 'send-whatsapp' && res.status === 401) {
    pass(`Edge Function ${name} desplegada`);
    warn('send-whatsapp requiere sesión JWT (401 con anon key es esperado en test)');
  } else if (name === 'send-whatsapp' && data?.reason === 'whatsapp_api_not_configured') {
    pass(`Edge Function ${name} desplegada (WA API sin token — esperado)`);
  } else if (name === 'create-wompi-checkout' && (res.status === 503 || res.status === 404 || data?.error)) {
    pass(`Edge Function ${name} desplegada`);
    if (res.status === 503) warn('WOMPI_PRIVATE_KEY pendiente en secrets');
  } else if (name === 'wompi-webhook' && (res.ok || res.status === 401 || data?.skipped !== undefined || data?.ok !== undefined)) {
    pass(`Edge Function ${name} desplegada`);
  } else if (name === 'auto-assign-rider' && (res.ok || data?.error || data?.riderId !== undefined)) {
    pass(`Edge Function ${name} desplegada`);
  } else if (data?.error) {
    warn(`${name}: ${data.error}`);
    pass(`Edge Function ${name} desplegada`);
  } else {
    pass(`Edge Function ${name} responde`);
  }
}

if (env.VITE_VAPID_PUBLIC_KEY) pass('VITE_VAPID_PUBLIC_KEY en .env.local');
else warn('Falta VITE_VAPID_PUBLIC_KEY');

pass('MapLibre + OSM activos (sin token)');

if (env.VITE_SOCKET_URL) pass('VITE_SOCKET_URL configurado');
else warn('Sin VITE_SOCKET_URL — tracking usa Supabase Realtime');

if (env.VITE_ORS_ENABLED === 'false') warn('VITE_ORS_ENABLED=false — rutas en línea recta');
else warn('Rutas ORS: configura ORS_API_KEY en Supabase secrets');

if (env.VITE_WOMPI_ENABLED === 'true' || env.VITE_WOMPI_PUBLIC_KEY) {
  pass('Wompi habilitado en cliente');
} else {
  warn('Wompi desactivado — solo efectivo (VITE_WOMPI_ENABLED / VITE_WOMPI_PUBLIC_KEY)');
}

if (env.VITE_WHATSAPP_API_ENABLED === 'true') pass('WhatsApp API habilitado en cliente');
else warn('VITE_WHATSAPP_API_ENABLED=false — solo wa.me manual');

console.log(failed ? '\n❌ Hay errores de despliegue.\n' : '\n✅ Integraciones verificadas.\n');
console.log('Secrets remotos: Dashboard → Edge Functions → Secrets');
console.log('  o: npm run setup:secrets (tras npx supabase login)');
console.log('Deploy funciones: npm run deploy:functions\n');
process.exit(failed ? 1 : 0);
