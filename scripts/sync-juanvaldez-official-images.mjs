/**
 * Sincroniza imágenes oficiales de bebidas desde juanvaldez.com (WP REST amigo-productos).
 * Actualiza products de Juan Valdez Plaza del Río Demo.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const BUSINESS_ID = 'b1100000-0000-4000-a110-000000000012';
const LOGO = 'https://juanvaldez.com/wp-content/uploads/2024/03/Logo-principal.png';
const COVER = 'https://juanvaldez.com/wp-content/uploads/2024/01/Alergenos_1400X600.jpg';

const HEADERS = {
  'User-Agent': 'UrabApp-DemoImporter/1.0 (onboarding; +https://urabapp.com)',
  Accept: 'application/json',
};

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

async function fetchAllAmigoProductos() {
  const items = [];
  for (let page = 1; page <= 10; page += 1) {
    const url = `https://juanvaldez.com/wp-json/wp/v2/amigo-productos?per_page=50&page=${page}&_embed=1`;
    const res = await fetch(url, { headers: HEADERS });
    if (res.status === 400 || res.status === 404) break;
    if (!res.ok) throw new Error(`amigo-productos HTTP ${res.status}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || !batch.length) break;
    for (const p of batch) {
      const title = (p.title?.rendered || '').replace(/<[^>]+>/g, '').trim();
      const media = p._embedded?.['wp:featuredmedia']?.[0];
      const image =
        media?.source_url ||
        media?.media_details?.sizes?.large?.source_url ||
        media?.media_details?.sizes?.full?.source_url ||
        null;
      const cats = (p._embedded?.['wp:term'] || []).flat().map((t) => t.name);
      items.push({
        id: p.id,
        title,
        slug: p.slug,
        image,
        link: p.link,
        categories: cats,
      });
    }
    console.log(`[jv] page ${page}: ${batch.length}`);
    if (batch.length < 50) break;
  }
  return items.filter((x) => x.image && x.title);
}

function scoreMatch(productName, officialTitle) {
  const a = norm(productName).replace(/\bdemo\b/g, '').trim();
  const b = norm(officialTitle);
  if (!a || !b) return 0;
  if (a.includes(b) || b.includes(a)) return 100;
  const aw = new Set(a.split(' ').filter((w) => w.length > 2));
  const bw = b.split(' ').filter((w) => w.length > 2);
  let hit = 0;
  for (const w of bw) if (aw.has(w)) hit += 1;
  // synonyms
  const syn = [
    ['cappuccino', 'capuccino'],
    ['capuccino', 'cappuccino'],
    ['tinto', 'cafe'],
    ['americano', 'cafe americano'],
    ['frappe', 'frappé'],
    ['nevado', 'frappe'],
    ['mocaccino', 'mocca'],
    ['mocca', 'mocaccino'],
    ['affogato', 'affogatto'],
  ];
  for (const [x, y] of syn) {
    if (a.includes(x) && b.includes(y)) hit += 2;
    if (a.includes(y) && b.includes(x)) hit += 2;
  }
  return hit * 20 + (b.split(' ').some((w) => a.includes(w)) ? 10 : 0);
}

function bestImage(productName, catalog) {
  let best = null;
  let bestScore = 0;
  for (const item of catalog) {
    const s = scoreMatch(productName, item.title);
    if (s > bestScore) {
      bestScore = s;
      best = item;
    }
  }
  if (bestScore < 30) return null;
  return best;
}

const catalog = await fetchAllAmigoProductos();
console.log('[jv] official drink products with image', catalog.length);

const outDir = join(root, 'supabase', 'seed-data');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'juanvaldez-official-drink-images.json'), JSON.stringify({
  source: 'https://juanvaldez.com/wp-json/wp/v2/amigo-productos',
  generated_at: new Date().toISOString(),
  count: catalog.length,
  products: catalog,
}, null, 2));

/** Mapeo por keywords → imagen oficial (usando catálogo WP) */
function findByKeywords(keywords) {
  let best = null;
  let bestScore = 0;
  for (const item of catalog) {
    const t = norm(item.title);
    let s = 0;
    for (const kw of keywords) {
      if (t.includes(norm(kw))) s += 40;
    }
    if (s > bestScore) {
      bestScore = s;
      best = item;
    }
  }
  return bestScore >= 40 ? best : null;
}

const DRINK_MAP = [
  { match: /tinto/i, keys: ['tinto'] },
  { match: /americano/i, keys: ['americano'] },
  { match: /espresso/i, keys: ['espresso'] },
  { match: /capuccino|cappuccino/i, keys: ['cappuccino', 'capuccino'] },
  { match: /\blatte\b/i, keys: ['latte'] },
  { match: /mocaccino|mocca|mocha/i, keys: ['mocca', 'mocaccino'] },
  { match: /chocolate/i, keys: ['chocolate'] },
  { match: /t[eé]|infusi/i, keys: ['aromatica', 'chai', 'te'] },
  { match: /cold brew/i, keys: ['cold brew'] },
  { match: /frapp[eé]|nevado/i, keys: ['frappe', 'frappé', 'nevado'] },
  { match: /latte helado|latte frio|latte frío/i, keys: ['latte frio', 'latte frío', 'latte helado'] },
  { match: /granizado/i, keys: ['granizado'] },
  { match: /limonada/i, keys: ['limonada'] },
  { match: /dulce de leche/i, keys: ['dulce de leche'] },
  { match: /affogat/i, keys: ['affogato', 'affogatto'] },
  { match: /avellana/i, keys: ['avellana'] },
  { match: /flat white/i, keys: ['flat white'] },
  { match: /macchiato/i, keys: ['macchiato'] },
];

// SQL by product name patterns (no supabase client needed for apply)
const lines = [
  '-- Juan Valdez — imágenes oficiales de bebidas (juanvaldez.com WP amigo-productos)',
  'ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;',
  `UPDATE public.businesses SET
  logo_url = '${LOGO}',
  cover_url = '${COVER}'
WHERE id = '${BUSINESS_ID}';`,
];

const mapping = [];
for (const rule of DRINK_MAP) {
  const official = findByKeywords(rule.keys) || catalog.find((c) => rule.match.test(c.title));
  if (!official?.image) continue;
  const img = official.image.replace(/'/g, "''");
  lines.push(`UPDATE public.products SET image_url = '${img}'
WHERE business_id = '${BUSINESS_ID}'
  AND name ~* '${rule.match.source.replace(/'/g, "''")}';`);
  mapping.push({ rule: rule.match.source, official: official.title, image: official.image });
  console.log(`[jv] ~* ${rule.match.source} ← ${official.title}`);
}

// Fallback: any remaining café drinks without official match keep stock; also map retail café empacado by title overlap
for (const item of catalog) {
  const safeTitle = item.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  lines.push(`UPDATE public.products SET image_url = '${item.image.replace(/'/g, "''")}'
WHERE business_id = '${BUSINESS_ID}'
  AND name ILIKE '%${item.title.replace(/'/g, "''")}% Demo';`);
}

lines.push('ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;');

writeFileSync(join(outDir, 'juanvaldez-image-mapping.json'), JSON.stringify({ mapping, catalog_count: catalog.length }, null, 2));
const sqlPath = join(root, 'supabase', 'migrations', '115_juanvaldez_official_drink_images.sql');
writeFileSync(sqlPath, `${lines.join('\n')}\n`);
console.log('[jv] sql', sqlPath, 'rules', mapping.length);
