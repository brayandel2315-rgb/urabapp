#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv() {
  const path = join(root, '.env.local');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const [k, ...r] = t.split('=');
    const v = r.join('=').trim().replace(/^["']|["']$/g, '');
    if (!process.env[k.trim()]) process.env[k.trim()] = v;
  }
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const j = JSON.parse(
  readFileSync(join(root, 'supabase/seed-data/uraba-onboarding-previews-v1.json'), 'utf8'),
);
const ids = new Set(
  j.businesses.filter((b) => b.slug.startsWith('preview-cruz-verde')).map((b) => b.id),
);
const products = j.products
  .filter((p) => ids.has(p.business_id))
  .map((p) => ({
    id: p.id,
    business_id: p.business_id,
    name: p.name,
    description: p.description || '',
    price: p.price,
    category: p.category || 'Cuidado',
    emoji: p.emoji || '💊',
    image_url: p.image_url || null,
    is_available: true,
    sort_order: p.sort_order ?? 0,
  }));

const sb = createClient(url, key);
let ok = 0;
let fail = 0;
for (let i = 0; i < products.length; i += 25) {
  const chunk = products.slice(i, i + 25);
  const { error } = await sb.from('products').upsert(chunk, { onConflict: 'id' });
  if (error) {
    console.error(error.message);
    fail += chunk.length;
  } else {
    ok += chunk.length;
  }
}

console.log(
  JSON.stringify({
    ok,
    fail,
    keyType: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service' : 'anon',
  }),
);
