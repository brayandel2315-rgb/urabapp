#!/usr/bin/env node
/**
 * Aplica seed Urabá 5 municipios desde JSON (UTF-8 seguro).
 * Uso: node scripts/apply-uraba-seed-json.mjs
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
const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Faltan SUPABASE_URL / SUPABASE_SECRET_KEY');
  process.exit(1);
}

const seed = JSON.parse(readFileSync(join(root, 'supabase/seed-data/uraba-marketplace-v1.json'), 'utf8'));
const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const businesses = (seed.businesses || []).map((b) => ({
  id: b.id,
  name: b.name,
  category: b.category,
  description: b.description,
  emoji: b.emoji,
  municipio: b.municipio,
  zone: b.zone,
  address: b.address,
  latitude: b.latitude,
  longitude: b.longitude,
  opens_at: b.opens_at,
  closes_at: b.closes_at,
  delivery_fee: b.delivery_fee,
  min_order: b.min_order,
  delivery_time: b.delivery_time,
  rating: b.rating,
  total_ratings: b.review_count ?? b.total_ratings ?? 0,
  is_open: true,
  is_active: true,
  is_published: true,
  verification_status: 'approved',
  approved_at: new Date().toISOString(),
  slug: b.slug,
  phone: b.phone,
}));

const products = (seed.products || []).map((p) => ({
  id: p.id,
  business_id: p.business_id,
  name: p.name,
  description: p.description,
  emoji: p.emoji,
  price: p.price,
  compare_at_price: p.compare_at_price ?? null,
  category: p.category,
  is_available: true,
  sort_order: p.sort_order ?? 0,
}));

console.log(`Seed v${seed.version || '?'}: ${businesses.length} comercios, ${products.length} productos`);

let okBiz = 0;
for (const batch of chunk(businesses, 25)) {
  const { error } = await admin.from('businesses').upsert(batch, { onConflict: 'id' });
  if (error) {
    console.error('businesses batch failed:', error.message);
    process.exit(1);
  }
  okBiz += batch.length;
  process.stdout.write(`\r  comercios ${okBiz}/${businesses.length}`);
}
console.log('');

let okProd = 0;
for (const batch of chunk(products, 80)) {
  const { error } = await admin.from('products').upsert(batch, { onConflict: 'id' });
  if (error) {
    console.error('products batch failed:', error.message);
    process.exit(1);
  }
  okProd += batch.length;
  process.stdout.write(`\r  productos ${okProd}/${products.length}`);
}
console.log('\n✅ Seed aplicado');
