/**
 * Importa catálogo oficial de Mercado desde la API pública de exito.com (VTEX).
 * NO usa Rappi. Productos se marcan con sufijo " Demo" para onboarding UrabApp.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const NOTICE =
  'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio.';

const EXITO_BUSINESSES = [
  {
    id: 'b1100000-0000-4000-a110-000000000001',
    name: 'Éxito Plaza del Río Demo',
    slug: 'preview-exito-plaza-del-rio',
  },
  {
    id: 'b1100000-0000-4000-a110-000000000002',
    name: 'Éxito Carepa Demo',
    slug: 'preview-exito-carepa',
  },
];

/** Categorías Mercado vía fq=C:/Mercado/{id}/ (API pública VTEX exito.com) */
const CATEGORIES = [
  { id: '34185099', label: 'Frutas y verduras' },
  { id: '34185097', label: 'Pollo, carne y pescado' },
  { id: '34185103', label: 'Lácteos, huevos y refrigerados' },
  { id: '34185101', label: 'Despensa' },
  { id: '34185100', label: 'Panadería y repostería' },
  { id: '34185106', label: 'Aseo del hogar' },
  { id: '34185105', label: 'Pasabocas y snacks' },
  { id: '346084837', label: 'Bebidas' },
  { id: '34185104', label: 'Congelados' },
  { id: '34185098', label: 'Charcutería y delicatessen' },
  { id: '346098434', label: 'Dulces y chocolatería' },
  { id: '34185107', label: 'Mascotas' },
  { id: '347733901', label: 'Alimentación para bebés' },
];

const PER_CATEGORY = 30;
const HEADERS = {
  'User-Agent': 'UrabApp-DemoImporter/1.0 (onboarding; +https://urabapp.com)',
  Accept: 'application/json',
};

function sqlStr(v) {
  if (v == null) return 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function prodId(bizIdx, n) {
  return `a1200000-0000-4000-a1${String(bizIdx).padStart(2, '0')}-${String(n).padStart(12, '0')}`;
}

function emojiFor(cat = '') {
  const c = cat.toLowerCase();
  if (c.includes('fruta') || c.includes('verdura')) return '🥬';
  if (c.includes('pollo') || c.includes('carne') || c.includes('pescado')) return '🥩';
  if (c.includes('láct') || c.includes('lact') || c.includes('huevo')) return '🥛';
  if (c.includes('panader') || c.includes('repost')) return '🍞';
  if (c.includes('aseo')) return '🧹';
  if (c.includes('bebida')) return '🥤';
  if (c.includes('snack') || c.includes('pasaboca')) return '🍿';
  if (c.includes('congel')) return '🧊';
  if (c.includes('dulce') || c.includes('choco')) return '🍫';
  if (c.includes('mascota')) return '🐶';
  return '🛒';
}

function pickImage(product) {
  const images = product.items?.[0]?.images || [];
  const preferred =
    images.find((i) => /front|principal|1/i.test(i.imageLabel || '')) || images[0];
  return preferred?.imageUrl || null;
}

function pickPrice(product) {
  const offer = product.items?.[0]?.sellers?.[0]?.commertialOffer;
  const price = offer?.Price ?? offer?.ListPrice ?? 0;
  return Math.round(Number(price) || 0);
}

function pickCategory(product, fallback) {
  const cats = product.categories || [];
  const leaf = cats[0] || `/${fallback}/`;
  const parts = leaf.split('/').filter(Boolean);
  return parts[parts.length - 1] || fallback;
}

async function fetchCategory({ id, label }) {
  const url = `https://www.exito.com/api/catalog_system/pub/products/search?fq=C:/34185082/${id}/&O=OrderByTopSaleDESC&_from=0&_to=${PER_CATEGORY - 1}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok && res.status !== 206) {
    console.warn(`[exito] ${label} HTTP ${res.status}`);
    return [];
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  console.log(`[exito] ${label}: ${data.length}`);
  return data.map((p) => ({
    source_id: p.productId,
    name: p.productName,
    brand: p.brand || 'Éxito',
    description: (p.description || p.metaTagDescription || p.productName || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 280),
    category: pickCategory(p, label),
    price: pickPrice(p),
    image_url: pickImage(p),
    link: p.linkText ? `https://www.exito.com/${p.linkText}/p` : 'https://www.exito.com',
  }));
}

async function collectCatalog() {
  const byId = new Map();
  for (const cat of CATEGORIES) {
    const rows = await fetchCategory(cat);
    for (const row of rows) {
      if (!row.source_id || !row.name || !row.price) continue;
      if (!byId.has(row.source_id)) byId.set(row.source_id, row);
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return [...byId.values()];
}

function toSql(catalog) {
  const lines = [];
  lines.push('-- Éxito Demo — productos desde API pública exito.com (no Rappi)');
  lines.push('ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;');
  lines.push('');

  for (const b of EXITO_BUSINESSES) {
    lines.push(`UPDATE public.businesses SET
  name = ${sqlStr(b.name)},
  description = ${sqlStr(`${NOTICE}\n\nVitrina Demo de Éxito para onboarding UrabApp en Urabá. Catálogo público de Mercado sincronizado desde exito.com.`)},
  cover_url = COALESCE(cover_url, '/previews/cover-mercado.jpg'),
  logo_url = COALESCE(logo_url, '/previews/logo-mercado.png'),
  is_published = true,
  is_active = true,
  is_open = true,
  verification_status = 'approved',
  approved_at = COALESCE(approved_at, NOW())
WHERE id = ${sqlStr(b.id)};`);
  }

  lines.push('');
  lines.push(`DELETE FROM public.products
WHERE business_id IN (${EXITO_BUSINESSES.map((b) => sqlStr(b.id)).join(', ')})
  AND (id::text LIKE 'a1100000%' OR id::text LIKE 'a1200000%');`);
  lines.push('');

  const values = [];
  EXITO_BUSINESSES.forEach((biz, bizIdx) => {
    catalog.forEach((p, i) => {
      const name = `${p.name} Demo`;
      const desc = `${NOTICE} Origen: ${p.link}. Marca: ${p.brand}. ${p.description || ''}`.slice(0, 500);
      values.push(`(
  ${sqlStr(prodId(bizIdx + 1, i + 1))}, ${sqlStr(biz.id)}, ${sqlStr(name)}, ${sqlStr(desc)},
  ${sqlStr(emojiFor(p.category))}, ${p.price}, ${sqlStr(p.category)}, ${sqlStr(p.image_url)},
  true, ${i}
)`);
    });
  });

  if (values.length) {
    lines.push(`INSERT INTO public.products (
  id, business_id, name, description, emoji, price, category, image_url, is_available, sort_order
) VALUES
${values.join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_available = true;`);
  }

  lines.push('');
  lines.push('ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;');
  return lines.join('\n');
}

const catalog = await collectCatalog();
console.log('[exito] unique products', catalog.length);

const outDir = join(root, 'supabase', 'seed-data');
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, 'exito-official-demo-v1.json'),
  JSON.stringify(
    {
      version: 1,
      source: 'https://www.exito.com (VTEX public API)',
      policy: 'Official public catalog only. Not from Rappi. Demo suffix for onboarding.',
      generated_at: new Date().toISOString(),
      count: catalog.length,
      products: catalog,
    },
    null,
    2,
  ),
);

const sqlPath = join(root, 'supabase', 'migrations', '111_seed_exito_official_demo.sql');
writeFileSync(sqlPath, toSql(catalog));
console.log('[exito] sql', sqlPath);
console.log('[exito] rows to insert', catalog.length * EXITO_BUSINESSES.length);
