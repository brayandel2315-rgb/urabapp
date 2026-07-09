#!/usr/bin/env node
/**
 * Reporte de salud UrabApp — ejecutar: npm run report:health
 * Combina verificación local + métricas Supabase (si hay .env.local).
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env.local');

function loadEnv() {
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const [key, ...rest] = line.split('=');
    if (key && rest.length) env[key.trim()] = rest.join('=').trim();
  }
  return env;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;
const generatedAt = new Date().toISOString();

let prodVersion = null;
try {
  const res = await fetch('https://urabapp.vercel.app/app-version.json', { cache: 'no-store' });
  if (res.ok) prodVersion = await res.json();
} catch {
  /* ignore */
}

const report = {
  generatedAt,
  production: {
    url: 'https://urabapp.vercel.app',
    buildId: prodVersion?.buildId ?? null,
    builtAt: prodVersion?.builtAt ?? null,
  },
  config: {
    supabase: !!(url && key),
    appUrl: env.VITE_APP_URL ?? null,
    ownerEmail: env.VITE_OWNER_EMAIL ?? null,
    wompiEnabled: env.VITE_WOMPI_ENABLED === 'true',
    whatsappApi: env.VITE_WHATSAPP_API_ENABLED === 'true',
    whatsappNumber: env.VITE_WHATSAPP_NUMBER ?? null,
    whatsappPlaceholder: env.VITE_WHATSAPP_NUMBER === '573001234567',
  },
  database: null,
  phases: null,
  modules: [
    { name: 'Marketplace cliente', status: 'ready' },
    { name: 'Checkout + carrito', status: 'ready' },
    { name: 'Panel comercio', status: 'ready' },
    { name: 'Panel mensajero', status: 'ready' },
    { name: 'Panel admin', status: 'ready' },
    { name: 'Envíos intermunicipales', status: 'ready' },
    { name: 'PWA + actualización automática', status: 'ready' },
    { name: 'Mapas + tracking', status: 'ready' },
    { name: 'Pagos Wompi', status: 'pending' },
    { name: 'WhatsApp API', status: 'pending' },
    { name: 'SMS / Twilio', status: 'pending' },
  ],
};

if (url && key) {
  const supabase = createClient(url, key);
  const tables = [
    'users', 'businesses', 'products', 'orders', 'drivers', 'shipment_orders',
    'reviews', 'membership_plans', 'courier_wallet',
  ];
  const tableChecks = {};
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    tableChecks[table] = !error;
  }

  const [
    businesses,
    products,
    orders,
    drivers,
    users,
    reviews,
    shipments,
  ] = await Promise.all([
    supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_available', true),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('drivers').select('id', { count: 'exact', head: true }),
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('reviews').select('id', { count: 'exact', head: true }),
    supabase.from('shipment_orders').select('id', { count: 'exact', head: true }),
  ]);

  const metrics = {
    businessesActive: businesses.count ?? 0,
    productsActive: products.count ?? 0,
    ordersTotal: orders.count ?? 0,
    driversTotal: drivers.count ?? 0,
    usersTotal: users.count ?? 0,
    reviewsTotal: reviews.count ?? 0,
    shipmentsTotal: shipments.count ?? 0,
  };

  report.database = { tablesOk: Object.values(tableChecks).filter(Boolean).length, tablesTotal: tables.length, tableChecks, metrics };

  report.phases = {
    phase1: {
      businesses: { current: metrics.businessesActive, goal: 20 },
      riders: { current: metrics.driversTotal, goal: 10 },
      users: { current: metrics.usersTotal, goal: 100 },
      orders: { current: metrics.ordersTotal, goal: 100 },
    },
    phase2: {
      businesses: { current: metrics.businessesActive, goal: 50 },
      riders: { current: metrics.driversTotal, goal: 30 },
      users: { current: metrics.usersTotal, goal: 1000 },
      orders: { current: metrics.ordersTotal, goal: 500 },
    },
  };
}

const outDir = resolve(root, 'reports');
const outPath = resolve(outDir, 'app-health.json');
mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`\nReporte guardado: ${outPath}\n`);
console.log(JSON.stringify(report, null, 2));
