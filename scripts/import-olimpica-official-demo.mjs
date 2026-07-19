/**
 * Importa catálogo oficial Supermercado desde API pública olimpica.com (VTEX).
 * Referencia de sede: Tiendeo Olímpica CC Nuestro Urabá Apartadó
 *   https://www.tiendeo.com.co/Tiendas/apartado/olimpica-cc-nuestro-uraba/68693
 * NO usa Rappi. Productos con sufijo " Demo".
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const NOTICE =
  'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio.';

const BUSINESS = {
  id: 'b1100000-0000-4000-a110-000000000003',
  name: 'Olímpica CC Nuestro Demo',
  slug: 'preview-olimpica-cc-nuestro',
  address: 'Centro Comercial Nuestro Urabá, Apartadó, Antioquia',
  store_ref: 'https://www.tiendeo.com.co/Tiendas/apartado/olimpica-cc-nuestro-uraba/68693',
  website: 'https://www.olimpica.com',
};

/** Categorías bajo Supermercado (900000000) */
const CATEGORIES = [
  { id: '900050000', label: 'Frutas y verduras' },
  { id: '900060000', label: 'Pollo, Carne y Pescado' },
  { id: '900030000', label: 'Huevos y Derivados Lácteos' },
  { id: '900070000', label: 'Refrigerados' },
  { id: '900020000', label: 'Despensa' },
  { id: '900010000', label: 'Desayuno' },
  { id: '900120000', label: 'Panadería' },
  { id: '900100000', label: 'Aseo del Hogar' },
  { id: '900110000', label: 'Cuidado Personal y Belleza' },
  { id: '900090000', label: 'Bebidas' },
  { id: '900130000', label: 'Pasabocas y Helados' },
  { id: '900140000', label: 'Congelados' },
  { id: '900150000', label: 'Para tu Bebé' },
  { id: '900180000', label: 'Para tu Mascota' },
  { id: '900160000', label: 'Cafetería Y Delicatessen' },
];

const PER_CATEGORY = 28;
const HEADERS = {
  'User-Agent': 'UrabApp-DemoImporter/1.0 (onboarding; +https://urabapp.com)',
  Accept: 'application/json',
};

function sqlStr(v) {
  if (v == null) return 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function prodId(n) {
  return `a1210000-0000-4000-a103-${String(n).padStart(12, '0')}`;
}

function emojiFor(cat = '') {
  const c = cat.toLowerCase();
  if (c.includes('fruta') || c.includes('verdura')) return '🥬';
  if (c.includes('pollo') || c.includes('carne') || c.includes('pescado')) return '🥩';
  if (c.includes('láct') || c.includes('lact') || c.includes('huevo') || c.includes('refriger')) return '🥛';
  if (c.includes('panader') || c.includes('desayuno')) return '🍞';
  if (c.includes('aseo')) return '🧹';
  if (c.includes('bebida')) return '🥤';
  if (c.includes('pasaboca') || c.includes('helado')) return '🍿';
  if (c.includes('congel')) return '🧊';
  if (c.includes('bebe') || c.includes('bebé')) return '👶';
  if (c.includes('mascota')) return '🐶';
  if (c.includes('cuidado') || c.includes('belleza')) return '🧴';
  return '🛒';
}

function pickImage(product) {
  const images = product.items?.[0]?.images || [];
  return (images.find((i) => /front|principal|1/i.test(i.imageLabel || '')) || images[0])?.imageUrl || null;
}

function pickPrice(product) {
  const offer = product.items?.[0]?.sellers?.[0]?.commertialOffer;
  return Math.round(Number(offer?.Price ?? offer?.ListPrice ?? 0) || 0);
}

function pickCategory(product, fallback) {
  const cats = product.categories || [];
  const leaf = cats[0] || `/${fallback}/`;
  const parts = leaf.split('/').filter(Boolean);
  return parts[parts.length - 1] || fallback;
}

async function fetchCategory({ id, label }) {
  const url = `https://www.olimpica.com/api/catalog_system/pub/products/search?fq=C:/900000000/${id}/&O=OrderByTopSaleDESC&_from=0&_to=${PER_CATEGORY - 1}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok && res.status !== 206) {
    console.warn(`[olimpica] ${label} HTTP ${res.status}`);
    return [];
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  console.log(`[olimpica] ${label}: ${data.length}`);
  return data.map((p) => ({
    source_id: p.productId,
    name: p.productName,
    brand: p.brand || 'Olímpica',
    description: (p.description || p.metaTagDescription || p.productName || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 280),
    category: pickCategory(p, label),
    price: pickPrice(p),
    image_url: pickImage(p),
    link: p.linkText ? `https://www.olimpica.com/${p.linkText}/p` : 'https://www.olimpica.com',
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
  lines.push('-- Olímpica Demo — productos desde API pública olimpica.com (no Rappi)');
  lines.push(`-- Sede ref: ${BUSINESS.store_ref}`);
  lines.push('ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;');
  lines.push('');
  lines.push(`UPDATE public.businesses SET
  name = ${sqlStr(BUSINESS.name)},
  description = ${sqlStr(`${NOTICE}\n\nSede: ${BUSINESS.address}.\nFicha Tiendeo: ${BUSINESS.store_ref}.\nCatálogo: ${BUSINESS.website}`)},
  address = ${sqlStr(BUSINESS.address)},
  cover_url = COALESCE(NULLIF(cover_url, ''), '/previews/cover-mercado.jpg'),
  logo_url = COALESCE(NULLIF(logo_url, ''), '/previews/logo-mercado.png'),
  is_published = true,
  is_active = true,
  is_open = true,
  verification_status = 'approved',
  approved_at = COALESCE(approved_at, NOW())
WHERE id = ${sqlStr(BUSINESS.id)};`);
  lines.push('');
  lines.push(`DELETE FROM public.products
WHERE business_id = ${sqlStr(BUSINESS.id)}
  AND (id::text LIKE 'a1100000%' OR id::text LIKE 'a1210000%');`);
  lines.push('');

  const values = catalog.map((p, i) => {
    const name = `${p.name} Demo`;
    const desc = `${NOTICE} Origen: ${p.link}. Marca: ${p.brand}. ${p.description || ''}`.slice(0, 500);
    return `(
  ${sqlStr(prodId(i + 1))}, ${sqlStr(BUSINESS.id)}, ${sqlStr(name)}, ${sqlStr(desc)},
  ${sqlStr(emojiFor(p.category))}, ${p.price}, ${sqlStr(p.category)}, ${sqlStr(p.image_url)},
  true, ${i}
)`;
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
console.log('[olimpica] unique products', catalog.length);

const outDir = join(root, 'supabase', 'seed-data');
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, 'olimpica-official-demo-v1.json'),
  JSON.stringify(
    {
      version: 1,
      source: 'https://www.olimpica.com (VTEX public API)',
      store_ref: BUSINESS.store_ref,
      policy: 'Official public catalog only. Not from Rappi. Demo suffix for onboarding.',
      generated_at: new Date().toISOString(),
      count: catalog.length,
      products: catalog,
    },
    null,
    2,
  ),
);

const sqlPath = join(root, 'supabase', 'migrations', '112_seed_olimpica_official_demo.sql');
writeFileSync(sqlPath, toSql(catalog));
console.log('[olimpica] sql', sqlPath);
