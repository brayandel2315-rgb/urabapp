/**
 * Aplica portadas e imágenes de producto al catálogo (Supabase).
 * Uso: node scripts/apply-catalog-visuals.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  BUSINESS_COVERS,
  CATEGORY_COVERS,
  resolveProductImageUrl,
} from '../src/data/catalog-visuals.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');

function loadEnv() {
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const i = line.indexOf('=');
    if (i > 0 && !line.startsWith('#')) {
      env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  return env;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Falta .env.local con VITE_SUPABASE_URL y clave Supabase');
  process.exit(1);
}

const supabase = createClient(url, key);

const { data: businesses, error: bizErr } = await supabase
  .from('businesses')
  .select('id, slug, name, category, cover_url')
  .eq('is_active', true);

if (bizErr) throw bizErr;

let bizUpdated = 0;
for (const b of businesses) {
  const cover =
    b.cover_url ||
    BUSINESS_COVERS[b.slug] ||
    CATEGORY_COVERS[b.category] ||
    CATEGORY_COVERS.comida;

  const { error } = await supabase
    .from('businesses')
    .update({ cover_url: cover })
    .eq('id', b.id);

  if (error) console.warn(`Business ${b.slug}:`, error.message);
  else bizUpdated++;
}

const { data: products, error: prodErr } = await supabase
  .from('products')
  .select('id, name, emoji, image_url, business_id, businesses(slug, category)')
  .eq('is_available', true);

if (prodErr) throw prodErr;

let prodUpdated = 0;
for (const p of products) {
  const slug = p.businesses?.slug;
  const cat = p.businesses?.category;
  const image = resolveProductImageUrl(p, cat, slug);

  const { error } = await supabase
    .from('products')
    .update({ image_url: image })
    .eq('id', p.id);

  if (error) console.warn(`Product ${p.name}:`, error.message);
  else prodUpdated++;
}

console.log(`✅ Comercios actualizados: ${bizUpdated}/${businesses.length}`);
console.log(`✅ Productos actualizados: ${prodUpdated}/${products.length}`);
