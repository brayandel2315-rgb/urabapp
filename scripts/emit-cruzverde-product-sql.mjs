#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const j = JSON.parse(
  readFileSync(join(root, 'supabase/seed-data/uraba-onboarding-previews-v1.json'), 'utf8'),
);
const stores = j.businesses.filter((b) => b.slug.startsWith('preview-cruz-verde'));

function esc(s) {
  return String(s ?? '').replace(/'/g, "''");
}

for (const store of stores) {
  const products = j.products.filter((p) => p.business_id === store.id);
  const values = products
    .map(
      (p) =>
        `('${p.id}'::uuid, '${p.business_id}'::uuid, '${esc(p.name)}', '${esc((p.description || '').slice(0, 180))}', ${p.price}, '${esc(p.category || 'Cuidado')}', '${esc(p.emoji || '💊')}', '${esc(p.image_url || '/previews/p-farmacia.jpg')}', true, ${p.sort_order ?? 0})`,
    )
    .join(',\n');
  const sql = `INSERT INTO public.products (id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order)
SELECT * FROM (VALUES
${values}
) AS v(id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;`;
  writeFileSync(join(root, `scripts/.tmp-cv-chunks/${store.slug}.sql`), sql);
  console.log(store.slug, products.length, sql.length);
}
