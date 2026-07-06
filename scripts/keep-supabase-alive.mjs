/**
 * Keep-alive Urabapp ↔ Supabase
 * Evita pausa por inactividad en plan gratuito (ping cada X minutos).
 *
 * Uso:
 *   node scripts/keep-supabase-alive.mjs
 *   node scripts/keep-supabase-alive.mjs --once
 *   node scripts/keep-supabase-alive.mjs --interval=30
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');

function loadEnv() {
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const args = process.argv.slice(2);
const once = args.includes('--once');
const intervalArg = args.find((a) => a.startsWith('--interval='));
const intervalMin = intervalArg ? Number(intervalArg.split('=')[1]) : 20;

const env = { ...process.env, ...loadEnv() };
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌ Falta VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

async function flushTrackingPushQueue() {
  if (!serviceKey) return;
  try {
    const res = await fetch(`${url}/functions/v1/dispatch-tracking-push`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        'Content-Type': 'application/json',
      },
      body: '{}',
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && (data?.sent > 0 || data?.processed > 0)) {
      console.log(`   📲 Cola push tracking: ${data.sent} enviados (${data.processed} procesados)`);
    }
  } catch {
    /* opcional si no hay service role en .env.local */
  }
}

async function ping() {
  const started = Date.now();
  const ts = new Date().toISOString();

  const { count, error } = await supabase
    .from('businesses')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true);

  const ms = Date.now() - started;

  if (error) {
    console.error(`[${ts}] ❌ Supabase no respondió (${ms}ms):`, error.message);
    return false;
  }

  console.log(`[${ts}] ✅ Supabase activo — ${count ?? 0} comercios (${ms}ms)`);
  await flushTrackingPushQueue();
  return true;
}

if (once) {
  const ok = await ping();
  process.exit(ok ? 0 : 1);
}

console.log(`🔄 Keep-alive Urabapp Supabase — cada ${intervalMin} min (Ctrl+C para salir)`);
console.log(`   URL: ${url}\n`);

await ping();

const timer = setInterval(ping, intervalMin * 60 * 1000);

process.on('SIGINT', () => {
  clearInterval(timer);
  console.log('\n👋 Keep-alive detenido');
  process.exit(0);
});
