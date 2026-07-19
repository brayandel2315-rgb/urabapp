/**
 * Importa productos más pedidos (OrderByTopSaleDESC) desde API pública d1.com.co.
 * Sede Demo: Tiendas D1 Apartadó. Sufijo " Demo". No Rappi.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const NOTICE =
  'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio.';

const BUSINESS = {
  id: 'b1100000-0000-4000-a110-000000000004',
  name: 'Tiendas D1 Apartadó Demo',
  slug: 'preview-tiendas-d1-apartado',
  address: 'Carrera 100 # 94-21, Apartadó, Antioquia',
  website: 'https://www.d1.com.co',
};

/** Categorías más compradas en formato hard-discount (Urabá) */
const CATEGORIES = [
  { id: '1', label: 'Despensa' },
  { id: '2', label: 'Lácteos y huevos' },
  { id: '3', label: 'Bebidas' },
  { id: '4', label: 'Pollo carne y pescado' },
  { id: '5', label: 'Panadería y repostería' },
  { id: '6', label: 'Hogar' },
  { id: '8', label: 'Carnes Frías y delikatessen' },
  { id: '9', label: 'Frutas y verduras' },
  { id: '10', label: 'Infantil' },
  { id: '11', label: 'Mascotas' },
  { id: '12', label: 'Cuidado personal y belleza' },
];

const PER_CATEGORY = 32;
const HEADERS = {
  'User-Agent': 'UrabApp-DemoImporter/1.0 (onboarding; +https://urabapp.com)',
  Accept: 'application/json',
};

function sqlStr(v) {
  if (v == null) return 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function prodId(n) {
  return `a1220000-0000-4000-a104-${String(n).padStart(12, '0')}`;
}

function emojiFor(cat = '') {
  const c = cat.toLowerCase();
  if (c.includes('fruta') || c.includes('verdura') || c.includes('hortal')) return '🥬';
  if (c.includes('pollo') || c.includes('carne') || c.includes('pescado')) return '🥩';
  if (c.includes('láct') || c.includes('lact') || c.includes('huevo')) return '🥛';
  if (c.includes('panader') || c.includes('repost') || c.includes('galle')) return '🍞';
  if (c.includes('hogar') || c.includes('aseo') || c.includes('limpieza')) return '🧹';
  if (c.includes('bebida') || c.includes('gaseosa') || c.includes('agua')) return '🥤';
  if (c.includes('infantil') || c.includes('bebé') || c.includes('bebe')) return '👶';
  if (c.includes('mascota')) return '🐶';
  if (c.includes('cuidado') || c.includes('belleza')) return '🧴';
  if (c.includes('fría') || c.includes('fria') || c.includes('embut') || c.includes('jamon')) return '🥓';
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
  const url = `https://www.d1.com.co/api/catalog_system/pub/products/search?fq=C:/${id}/&O=OrderByTopSaleDESC&_from=0&_to=${PER_CATEGORY - 1}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok && res.status !== 206) {
    console.warn(`[d1] ${label} HTTP ${res.status}`);
    return [];
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  console.log(`[d1] ${label}: ${data.length}`);
  return data.map((p) => ({
    source_id: p.productId,
    name: p.productName,
    brand: p.brand || 'D1',
    description: (p.description || p.metaTagDescription || p.productName || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 280),
    category: pickCategory(p, label),
    price: pickPrice(p),
    image_url: pickImage(p),
    link: p.linkText ? `https://www.d1.com.co/${p.linkText}/p` : 'https://www.d1.com.co',
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
  lines.push('-- D1 Demo — top ventas desde API pública d1.com.co (no Rappi)');
  lines.push('ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;');
  lines.push('');
  lines.push(`UPDATE public.businesses SET
  name = ${sqlStr(BUSINESS.name)},
  description = ${sqlStr(`${NOTICE}\n\nSede: ${BUSINESS.address}.\nCatálogo: ${BUSINESS.website}\nSelección: productos más pedidos (OrderByTopSaleDESC) orientados a consumo típico en Urabá.`)},
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
  AND (id::text LIKE 'a1100000%' OR id::text LIKE 'a1220000%');`);
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
console.log('[d1] unique products', catalog.length);

const outDir = join(root, 'supabase', 'seed-data');
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, 'd1-official-demo-v1.json'),
  JSON.stringify(
    {
      version: 1,
      source: 'https://www.d1.com.co (VTEX public API, OrderByTopSaleDESC)',
      policy: 'Official public catalog only. Not from Rappi. Demo suffix for onboarding.',
      generated_at: new Date().toISOString(),
      count: catalog.length,
      products: catalog,
    },
    null,
    2,
  ),
);

const sqlPath = join(root, 'supabase', 'migrations', '113_seed_d1_official_demo.sql');
writeFileSync(sqlPath, toSql(catalog));
console.log('[d1] sql', sqlPath);
