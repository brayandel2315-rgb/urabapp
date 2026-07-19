#!/usr/bin/env node
/** Imprime SQL UTF-8 de productos Cruz Verde restantes (sin PowerShell encoding). */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const j = JSON.parse(
  readFileSync(join(root, 'supabase/seed-data/uraba-onboarding-previews-v1.json'), 'utf8'),
);

function esc(s) {
  return String(s ?? '').replace(/'/g, "''");
}

const stores = j.businesses.filter((b) =>
  [
    'preview-cruz-verde-nuevo-apartado',
    'preview-cruz-verde-turbo',
    'preview-cruz-verde-chigorodo',
    'preview-cruz-verde-carepa',
  ].includes(b.slug),
);

const parts = [];
for (const store of stores) {
  const products = j.products.filter((p) => p.business_id === store.id);
  const values = products
    .map((p) => {
      const emoji = (p.emoji || 'pill').replace(/[^\x20-\x7E]/g, 'x');
      return `('${p.id}'::uuid, '${p.business_id}'::uuid, '${esc(p.name)}', 'Demo onboarding UrabApp', ${p.price}, '${esc(p.category || 'Cuidado')}', '${esc(emoji)}', '${esc(p.image_url || '/previews/p-farmacia.jpg')}', true, ${p.sort_order ?? 0})`;
    })
    .join(',\n');
  parts.push(`INSERT INTO public.products (id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order)
SELECT * FROM (VALUES
${values}
) AS v(id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;`);
}

const sql = parts.join('\n');
writeFileSync(join(root, 'scripts/.tmp-cv-chunks/remaining-ascii.sql'), sql, 'utf8');
console.log(sql.length);
