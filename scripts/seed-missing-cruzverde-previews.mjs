#!/usr/bin/env node
/** Genera e imprime SQL para vitrinas Cruz Verde preview faltantes (desde seed JSON). */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const j = JSON.parse(
  readFileSync(join(root, 'supabase/seed-data/uraba-onboarding-previews-v1.json'), 'utf8'),
);

const missing = j.businesses.filter((b) => b.slug.startsWith('preview-cruz-verde'));
const ids = new Set(missing.map((b) => b.id));
const products = (j.products || []).filter((p) => ids.has(p.business_id));

function esc(s) {
  return String(s ?? '').replace(/'/g, "''");
}
function sqlStr(s) {
  return s == null ? 'NULL' : `'${esc(s)}'`;
}

const sql = [];
sql.push('-- Seed missing Cruz Verde onboarding previews');
sql.push('ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;');

for (const b of missing) {
  const [open, close] = String(b.hours || '08:00–19:00').split('–').map((x) => x.trim());
  sql.push(`INSERT INTO public.businesses (
  id, name, category, description, emoji, municipio, zone, address,
  latitude, longitude, opens_at, closes_at,
  delivery_fee, min_order, delivery_time, delivery_radius_km, rating, total_ratings,
  is_open, is_active, is_published, verification_status, approved_at, slug, phone, cover_url, logo_url
) VALUES (
  '${b.id}', '${esc(b.name)} · Preview UrabApp', '${esc(b.category)}', '${esc(b.description)}', '${esc(b.emoji || '💊')}',
  '${esc(b.municipio)}', '${esc(b.zone || '')}', '${esc(b.address)}',
  ${b.lat}, ${b.lng}, '${open}'::time, '${close || '19:00'}'::time,
  ${b.delivery_fee ?? 4000}, ${b.min_order ?? 12000}, ${b.delivery_time ?? 25}, ${b.delivery_radius_km ?? 5}, ${b.rating ?? 4.5}, 40,
  true, true, true, 'approved', NOW(), '${esc(b.slug)}', ${sqlStr(b.phone)}, '${esc(b.cover_url)}', '${esc(b.logo_url)}'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  is_active = true,
  is_published = true,
  is_open = true,
  cover_url = EXCLUDED.cover_url,
  logo_url = EXCLUDED.logo_url;`);
}

for (const p of products) {
  sql.push(`INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    '${p.id}', '${p.business_id}', '${esc(p.name)}', '${esc(p.description || '')}', ${p.price},
    '${esc(p.category || 'Cuidado')}', '${esc(p.emoji || '💊')}', ${sqlStr(p.image_url)}, true, ${p.sort_order ?? 0}
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;`);
}

sql.push('ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;');

const out = join(root, 'supabase/migrations/115_seed_cruzverde_preview_missing.sql');
writeFileSync(out, `${sql.join('\n')}\n`);
console.log(`Wrote ${out} (${missing.length} businesses, ${products.length} products)`);
