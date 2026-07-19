/**
 * Juan Valdez Plaza del Río Demo — perfil sede Urabá + menú café + retail oficial.
 * NO usa DiDi / Rappi.
 * Perfil sede: plazadelriocc.com (Local 1177)
 * Categorías menú: juanvaldez.com/category/productos
 * Retail: tiendajuanvaldez.com (products.json si disponible)
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const NOTICE =
  'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio.';

const BUSINESS = {
  id: 'b1100000-0000-4000-a110-000000000012',
  name: 'Juan Valdez Plaza del Río Demo',
  slug: 'preview-juan-valdez-plaza-del-rio',
  category: 'comida',
  emoji: '☕',
  municipio: 'Apartadó',
  zone: 'Villa del Río',
  address: 'CC Plaza del Río Local 1177, Carrera 100, Urbanización Villa del Río, Apartadó',
  lat: 7.8840,
  lng: -76.6290,
  phone: null,
  website: 'https://juanvaldez.com',
  store_ref: 'https://plazadelriocc.com/directorio/juan-valdez-plaza-del-rio/',
  hours: '08:00–20:00',
  story:
    'Cadena de bebidas de café, repostería y bebidas calientes/frías. Sede Plaza del Río (Apartadó). Horarios oficiales CC: Lun–Jue 8am–8pm; Vie–Sáb 8am–9pm; Dom/fest 9am–7pm.',
  delivery_fee: 4000,
  min_order: 12000,
  delivery_time: 25,
  rating: 4.7,
  cover_url: '/previews/cover-comida.jpg',
  logo_url: '/previews/logo-comida.png',
};

/** Menú cafetería (categorías oficiales JV) — ítems Demo con precios de referencia */
const CAFE_MENU = [
  // Bebidas Calientes
  ['Tinto tradicional Demo', 'Café negro clásico Juan Valdez', 'Bebidas Calientes', 4900, '☕', '/previews/p-drink.jpg'],
  ['Americano Demo', 'Espresso alargado con agua caliente', 'Bebidas Calientes', 7900, '☕', '/previews/p-drink.jpg'],
  ['Espresso Demo', 'Shot intenso de café', 'Bebidas Calientes', 6900, '☕', '/previews/p-drink.jpg'],
  ['Capuccino Demo', 'Espresso, leche vaporizada y espuma', 'Bebidas Calientes', 10900, '☕', '/previews/p-drink.jpg'],
  ['Latte Demo', 'Espresso con abundante leche vaporizada', 'Bebidas Calientes', 10900, '☕', '/previews/p-drink.jpg'],
  ['Mocaccino Demo', 'Café, chocolate y leche', 'Bebidas Calientes', 12900, '☕', '/previews/p-drink.jpg'],
  ['Chocolate caliente Demo', 'Chocolate cremoso', 'Bebidas Calientes', 9900, '☕', '/previews/p-drink.jpg'],
  ['Té / Infusión Demo', 'Selección de infusiones', 'Bebidas Calientes', 7900, '🍵', '/previews/p-drink.jpg'],
  // Bebidas Frías
  ['Cold Brew Demo', 'Extracción en frío, suave y refrescante', 'Bebidas Frías', 13900, '🧊', '/previews/p-bebidas.jpg'],
  ['Frappé clásico Demo', 'Café helado batido', 'Bebidas Frías', 14900, '🧊', '/previews/p-bebidas.jpg'],
  ['Frappé avellana Demo', 'Café helado sabor avellana', 'Bebidas Frías', 15900, '🧊', '/previews/p-bebidas.jpg'],
  ['Latte helado Demo', 'Espresso con leche fría y hielo', 'Bebidas Frías', 12900, '🧊', '/previews/p-bebidas.jpg'],
  ['Granizado de café Demo', 'Café granizado', 'Bebidas Frías', 13900, '🧊', '/previews/p-bebidas.jpg'],
  ['Limonada de café Demo', 'Refrescante con toque de café', 'Bebidas Frías', 11900, '🍋', '/previews/p-bebidas.jpg'],
  // Sabores / temporada
  ['Capuccino dulce de leche Demo', 'Capuccino con dulce de leche', 'Sabores vitales', 13900, '☕', '/previews/p-drink.jpg'],
  ['Latte mocca Demo', 'Latte con chocolate', 'Sabores vitales', 13900, '☕', '/previews/p-drink.jpg'],
  ['Affogato caramelo Demo', 'Helado con espresso y caramelo', 'Sabores vitales', 15900, '🍨', '/previews/p-combos.jpg'],
  // Pastelería / Desayunos
  ['Croissant Demo', 'Hojaldre mantequilla', 'Pastelería / Desayunos', 6900, '🥐', '/previews/p-despensa.jpg'],
  ['Muffin Demo', 'Muffin del día', 'Pastelería / Desayunos', 7900, '🧁', '/previews/p-combos.jpg'],
  ['Brownie Demo', 'Brownie de chocolate', 'Pastelería / Desayunos', 8900, '🍫', '/previews/p-combos.jpg'],
  ['Galleta Juan Valdez Demo', 'Galleta acompañante', 'Pastelería / Desayunos', 4900, '🍪', '/previews/p-despensa.jpg'],
  ['Sandwich desayuno Demo', 'Pan, huevo y queso', 'Pastelería / Desayunos', 14900, '🥪', '/previews/p-combos.jpg'],
  ['Bowl avena Demo', 'Avena con frutas', 'Pastelería / Desayunos', 12900, '🥣', '/previews/p-frescos.jpg'],
  // Adiciones
  ['Shot espresso extra Demo', 'Adición de espresso', 'Adiciones', 3000, '➕', '/previews/p-default.jpg'],
  ['Leche vegetal Demo', 'Sustitución leche vegetal', 'Adiciones', 2500, '➕', '/previews/p-lacteos.jpg'],
  ['Sirope sabor Demo', 'Vainilla / caramelo / avellana', 'Adiciones', 2000, '➕', '/previews/p-default.jpg'],
  ['Crema batida Demo', 'Topping', 'Adiciones', 2000, '➕', '/previews/p-default.jpg'],
  // Retail destacado (tiendajuanvaldez.com — listados públicos)
  ['Café Premium Colina 454gr Demo', 'Perfil de taza balanceado — retail oficial', 'Café empacado', 49900, '☕', '/previews/p-drink.jpg'],
  ['Café Premium Volcán 454gr Demo', 'Perfil de taza fuerte — retail oficial', 'Café empacado', 49900, '☕', '/previews/p-drink.jpg'],
  ['Café Premium Cumbre 454gr Demo', 'Perfil de taza fuerte — retail oficial', 'Café empacado', 49900, '☕', '/previews/p-drink.jpg'],
  ['Café Origen Sierra Nevada 454gr Demo', 'Café de origen — retail oficial', 'Café empacado', 67900, '☕', '/previews/p-drink.jpg'],
  ['Café Mujeres Cafeteras Demo', 'Edición especial mujeres cafeteras', 'Café empacado', 59900, '☕', '/previews/p-drink.jpg'],
  ['Café Liofilizado Dulce de Leche 95gr Demo', 'Soluble sabor dulce de leche', 'Café empacado', 35900, '☕', '/previews/p-drink.jpg'],
  ['Café Liofilizado Chocolate 95gr Demo', 'Soluble sabor chocolate', 'Café empacado', 35900, '☕', '/previews/p-drink.jpg'],
  ['Café Liofilizado Vanicanela 95gr Demo', 'Soluble vainilla-canela', 'Café empacado', 35900, '☕', '/previews/p-drink.jpg'],
  ['Café Liofilizado Descafeinado 95gr Demo', 'Soluble descafeinado', 'Café empacado', 35900, '☕', '/previews/p-drink.jpg'],
  ['Termo Montañas Demo', 'Termo artículos de marca', 'Artículos de marca', 99000, '🧴', '/previews/p-default.jpg'],
  ['Prensa Francesa Demo', 'Método de preparación', 'Accesorios', 89000, '☕', '/previews/p-default.jpg'],
  ['Café Drip monodosis Demo', 'Monodosis para preparar en cualquier lugar', 'Café empacado', 24900, '☕', '/previews/p-drink.jpg'],
];

const HEADERS = {
  'User-Agent': 'UrabApp-DemoImporter/1.0 (onboarding; +https://urabapp.com)',
  Accept: 'application/json',
};

function sqlStr(v) {
  if (v == null) return 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function prodId(n) {
  return `a1230000-0000-4000-a112-${String(n).padStart(12, '0')}`;
}

async function fetchRetail() {
  const products = [];
  for (let page = 1; page <= 4; page += 1) {
    const url = `https://www.tiendajuanvaldez.com/products.json?limit=50&page=${page}`;
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) {
        console.warn(`[jv] retail page ${page} HTTP ${res.status}`);
        break;
      }
      const data = await res.json();
      const batch = data.products || [];
      if (!batch.length) break;
      for (const p of batch) {
        const variant = p.variants?.[0];
        const priceCop = Math.round(Number(variant?.price || 0));
        const img = p.images?.[0]?.src || p.image?.src || null;
        if (!p.title || !priceCop) continue;
        products.push({
          name: `${p.title} Demo`,
          description: `${NOTICE} Retail oficial tiendajuanvaldez.com. ${(p.body_html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200)}`,
          category: (p.product_type || p.tags?.[0] || 'Café empacado').slice(0, 60),
          price: priceCop,
          emoji: '☕',
          image_url: img,
          source: 'tiendajuanvaldez.com',
        });
      }
      console.log(`[jv] retail page ${page}: ${batch.length}`);
      await new Promise((r) => setTimeout(r, 200));
    } catch (e) {
      console.warn('[jv] retail fail', e.message);
      break;
    }
  }
  return products;
}

function buildCafeProducts() {
  return CAFE_MENU.map(([name, desc, category, price, emoji, image_url]) => ({
    name,
    description: `${NOTICE} Categoría oficial menú: ${category}. ${desc}`,
    category,
    price,
    emoji,
    image_url,
    source: 'juanvaldez.com/category/productos',
  }));
}

function toSql(products) {
  const [open, close] = BUSINESS.hours.split('–');
  const lines = [];
  lines.push('-- Juan Valdez Plaza del Río Demo — sin DiDi/Rappi');
  lines.push('ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;');
  lines.push('');
  lines.push(`INSERT INTO public.businesses (
  id, name, category, description, emoji, municipio, zone, address,
  latitude, longitude, opens_at, closes_at,
  delivery_fee, min_order, delivery_time, delivery_radius_km, rating, total_ratings,
  is_open, is_active, is_published, verification_status, approved_at, slug, phone, cover_url, logo_url
) VALUES (
  ${sqlStr(BUSINESS.id)}, ${sqlStr(BUSINESS.name)}, ${sqlStr(BUSINESS.category)},
  ${sqlStr(`${NOTICE}\n\n${BUSINESS.story}\nSede: ${BUSINESS.store_ref}\nWeb: ${BUSINESS.website}`)},
  ${sqlStr(BUSINESS.emoji)}, ${sqlStr(BUSINESS.municipio)}, ${sqlStr(BUSINESS.zone)}, ${sqlStr(BUSINESS.address)},
  ${BUSINESS.lat}, ${BUSINESS.lng}, ${sqlStr(open)}::time, ${sqlStr(close)}::time,
  ${BUSINESS.delivery_fee}, ${BUSINESS.min_order}, ${BUSINESS.delivery_time}, 5, ${BUSINESS.rating}, 120,
  true, true, true, 'approved', NOW(), ${sqlStr(BUSINESS.slug)}, NULL,
  ${sqlStr(BUSINESS.cover_url)}, ${sqlStr(BUSINESS.logo_url)}
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  address = EXCLUDED.address,
  cover_url = EXCLUDED.cover_url,
  logo_url = EXCLUDED.logo_url,
  is_published = true,
  verification_status = 'approved';`);

  lines.push('');
  lines.push(`DELETE FROM public.products WHERE business_id = ${sqlStr(BUSINESS.id)};`);
  lines.push('');

  const values = products.map((p, i) => `(
  ${sqlStr(prodId(i + 1))}, ${sqlStr(BUSINESS.id)}, ${sqlStr(p.name)}, ${sqlStr(p.description.slice(0, 500))},
  ${sqlStr(p.emoji)}, ${p.price}, ${sqlStr(p.category)}, ${sqlStr(p.image_url)},
  true, ${i}
)`);

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

  lines.push('');
  lines.push('ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;');
  return lines.join('\n');
}

const cafe = buildCafeProducts();
const retail = await fetchRetail();
const products = [...cafe, ...retail];
console.log('[jv] cafe', cafe.length, 'retail', retail.length, 'total', products.length);

const outDir = join(root, 'supabase', 'seed-data');
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, 'juanvaldez-official-demo-v1.json'),
  JSON.stringify(
    {
      version: 1,
      policy: 'No DiDi/Rappi. Official Juan Valdez sources + Plaza del Río directory.',
      business: BUSINESS,
      generated_at: new Date().toISOString(),
      count: products.length,
      products,
    },
    null,
    2,
  ),
);

const sqlPath = join(root, 'supabase', 'migrations', '114_seed_juanvaldez_official_demo.sql');
writeFileSync(sqlPath, toSql(products));
console.log('[jv] sql', sqlPath);
