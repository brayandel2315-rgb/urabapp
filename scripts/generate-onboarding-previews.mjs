/**
 * Vitrinas PREVIEW de onboarding — marcas con presencia real en Urabá.
 * Catálogos ORIGINALES de demostración (no menús reales, no Rappi).
 * Assets de marca: el comercio debe aportar logo oficial; aquí solo website oficial + prompts.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const NOTICE =
  'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.';

/** Rutas locales servidas por Vite desde public/previews/ */
const COVER = {
  mercado: '/previews/cover-mercado.jpg',
  farmacia: '/previews/cover-farmacia.jpg',
  comida: '/previews/cover-comida.jpg',
};

const LOGO = {
  mercado: '/previews/logo-mercado.png',
  farmacia: '/previews/logo-farmacia.png',
  comida: '/previews/logo-comida.png',
};

const PRODUCT_IMG = {
  Frescos: '/previews/p-frescos.jpg',
  Lácteos: '/previews/p-lacteos.jpg',
  Despensa: '/previews/p-despensa.jpg',
  Panadería: '/previews/p-despensa.jpg',
  Carnes: '/previews/p-pollo.jpg',
  Aseo: '/previews/p-aseo.jpg',
  Cuidado: '/previews/p-cuidado.jpg',
  Bebé: '/previews/p-cuidado.jpg',
  Bebidas: '/previews/p-bebidas.jpg',
  Snacks: '/previews/p-combos.jpg',
  Combos: '/previews/p-combos.jpg',
  Ofertas: '/previews/p-combos.jpg',
  Analgésicos: '/previews/p-farmacia.jpg',
  Bienestar: '/previews/p-farmacia.jpg',
  'Primeros auxilios': '/previews/p-farmacia.jpg',
  Kits: '/previews/p-farmacia.jpg',
  Pollo: '/previews/p-pollo.jpg',
  Alitas: '/previews/p-pollo.jpg',
  Hamburguesas: '/previews/p-burger.jpg',
  Platos: '/previews/p-combos.jpg',
  Criollo: '/previews/p-combos.jpg',
  Kids: '/previews/p-fries.jpg',
  Ensaladas: '/previews/p-frescos.jpg',
  Acompañamientos: '/previews/p-fries.jpg',
  Postres: '/previews/p-combos.jpg',
  Salsas: '/previews/p-default.jpg',
  Extras: '/previews/p-default.jpg',
};

function sqlStr(v) {
  if (v == null) return 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function bizId(n) {
  return `b1100000-0000-4000-a110-${String(n).padStart(12, '0')}`;
}
function prodId(biz, n) {
  return `a1100000-0000-4000-a1${String(biz).padStart(2, '0')}-${String(n).padStart(12, '0')}`;
}

const CATALOGS = {
  mercado: [
    ['Canasta fresca demo', 'Selección de frutas y verduras de temporada (muestra)', 'Frescos', 18900, '🥬'],
    ['Huevos AA x12 demo', 'Cartón demostración', 'Lácteos', 12900, '🥚'],
    ['Leche 1L demo', 'UHT demostración', 'Lácteos', 5900, '🥛'],
    ['Arroz 1kg demo', 'Presentación muestra', 'Despensa', 4900, '🍚'],
    ['Aceite 1L demo', 'Vegetal — catálogo demo', 'Despensa', 12900, '🫒'],
    ['Café molido 250g demo', 'Tueste medio demo', 'Despensa', 11900, '☕'],
    ['Pan tajado demo', 'Bolsa muestra', 'Panadería', 6200, '🍞'],
    ['Pollo entero demo', 'Referencia de precio', 'Carnes', 18900, '🍗'],
    ['Carne molida 500g demo', 'Referencia de precio', 'Carnes', 14900, '🥩'],
    ['Detergente 1kg demo', 'Aseo hogar', 'Aseo', 12900, '🧺'],
    ['Papel higiénico x4 demo', 'Pack muestra', 'Aseo', 10900, '🧻'],
    ['Jabón líquido demo', 'Cuidado personal', 'Cuidado', 7900, '🧴'],
    ['Pañales etapa 3 demo', 'Pack muestra', 'Bebé', 24900, '👶'],
    ['Gaseosa 1.5L demo', 'Bebida', 'Bebidas', 7200, '🥤'],
    ['Agua 6L demo', 'Bidón', 'Bebidas', 8200, '💧'],
    ['Snack papas demo', 'Bolsa', 'Snacks', 5900, '🥔'],
    ['Combo mercado día', 'Canasta + leche + pan (demo)', 'Combos', 34900, '🍱'],
    ['Combo aseo', 'Detergente + papel + jabón (demo)', 'Combos', 28900, '🧼'],
    ['Oferta fin de semana demo', 'Selección promocional muestra', 'Ofertas', 15900, '🏷️'],
    ['Fruta picada demo', 'Porción lista', 'Frescos', 8900, '🍓'],
  ],
  farmacia: [
    ['Acetaminofén 500mg demo', 'OTC — catálogo demostración', 'Analgésicos', 8900, '💊'],
    ['Ibuprofeno 400mg demo', 'OTC demo', 'Analgésicos', 9900, '💊'],
    ['Vitamina C efervescente demo', 'Bienestar', 'Bienestar', 18900, '🍊'],
    ['Protector solar FPS50 demo', 'Cuidado personal', 'Cuidado', 35900, '☀️'],
    ['Alcohol gel 60ml demo', 'Antibacterial', 'Cuidado', 6900, '🧴'],
    ['Curitas x20 demo', 'Primeros auxilios', 'Primeros auxilios', 6900, '🩹'],
    ['Suero oral demo', 'Sobre', 'Primeros auxilios', 3900, '🧪'],
    ['Repelente spray demo', '120ml', 'Bienestar', 18900, '🦟'],
    ['Pañales etapa 2 demo', 'Bebé', 'Bebé', 28900, '👶'],
    ['Crema humectante demo', '120ml', 'Cuidado', 18900, '🧴'],
    ['Shampoo anticaspa demo', '400ml', 'Cuidado', 22900, '🧴'],
    ['Termómetro digital demo', 'Unidad', 'Bienestar', 25900, '🌡️'],
    ['Kit viaje básico demo', 'Curitas + gel + acetaminofén', 'Kits', 25900, '🧰'],
    ['Mascarillas x10 demo', 'Desechables', 'Bienestar', 8900, '😷'],
    ['Multivitamínico x30 demo', 'Tabletas', 'Bienestar', 32900, '💊'],
    ['Pañitos húmedos demo', 'Bebé', 'Bebé', 9900, '👶'],
    ['Gotas oculares demo', 'Lubricantes', 'Bienestar', 22900, '👁️'],
    ['Jabón neutro demo', 'Barra', 'Cuidado', 5900, '🧼'],
    ['Combo bienestar demo', 'Vitamina C + protector', 'Combos', 49900, '🎁'],
    ['Alcohol antiséptico demo', '120ml', 'Primeros auxilios', 5900, '🧴'],
  ],
  comida: [
    ['Combo pollo familiar demo', 'Piezas + papas + bebida (muestra)', 'Combos', 45900, '🍗'],
    ['1/4 pollo + papas demo', 'Porción individual demo', 'Pollo', 18900, '🍗'],
    ['Alitas BBQ x6 demo', 'Glaseadas — catálogo demo', 'Alitas', 17900, '🍗'],
    ['Hamburguesa clásica demo', 'Con papas', 'Hamburguesas', 19900, '🍔'],
    ['Salchipapa especial demo', 'Salsas a elección', 'Platos', 14900, '🍟'],
    ['Arepa rellena demo', 'Queso y hogao', 'Criollo', 8900, '🫓'],
    ['Nuggets kids demo', '6 und + papa + jugo', 'Kids', 14900, '🧒'],
    ['Ensalada fresca demo', 'Vegetales del día', 'Ensaladas', 12900, '🥗'],
    ['Papa criolla demo', 'Acompañamiento', 'Acompañamientos', 7900, '🥔'],
    ['Yuca frita demo', 'Con suero', 'Acompañamientos', 6900, '🥔'],
    ['Limonada natural demo', '16oz', 'Bebidas', 5900, '🍋'],
    ['Gaseosa personal demo', '350ml', 'Bebidas', 3900, '🥤'],
    ['Brownie demo', 'Postre', 'Postres', 7900, '🍫'],
    ['Combo ejecutivo demo', 'Pollo + bebida', 'Combos', 21900, '🍱'],
    ['Ají de la casa demo', 'Porción', 'Salsas', 2000, '🌶️'],
    ['Extra queso demo', 'Adición', 'Extras', 3000, '🧀'],
    ['Picada para 2 demo', 'Surtido parrilla muestra', 'Platos', 42900, '🥩'],
    ['Jugo de mango demo', 'Natural', 'Bebidas', 6900, '🥭'],
    ['Menú infantil demo', 'Porción kids', 'Kids', 13900, '🧒'],
    ['Oferta mediodía demo', 'Solo lunch — muestra', 'Ofertas', 16900, '🏷️'],
  ],
};

/** Marcas / sedes con evidencia pública de presencia en Urabá */
const STORES = [
  {
    n: 1,
    name: 'Éxito Plaza del Río',
    brand: 'Éxito',
    category: 'mercado',
    emoji: '🛒',
    municipio: 'Apartadó',
    zone: 'Villa del Río',
    address: 'CC Plaza del Río, Calle 103 con Carrera 100, Apartadó',
    lat: 7.8845,
    lng: -76.6295,
    phone: null,
    website: 'https://www.exito.com',
    instagram: '@exito',
    facebook: 'https://www.facebook.com/exito',
    hours: '08:00–21:00',
    story: 'Hipermercado de referencia en Plaza del Río. Esta vitrina UrabApp es un preview de onboarding para activar domicilios locales.',
    tags: ['supermercado', 'hogar', 'domicilio'],
    delivery_time: 45,
    min_order: 25000,
    delivery_fee: 5000,
    rating: 4.6,
  },
  {
    n: 2,
    name: 'Éxito Carepa',
    brand: 'Éxito',
    category: 'mercado',
    emoji: '🛒',
    municipio: 'Carepa',
    zone: 'Centro',
    address: 'Carrera 80 # 68-40, CC Las Playas, Carepa',
    lat: 7.7588,
    lng: -76.6542,
    phone: null,
    website: 'https://www.exito.com',
    instagram: '@exito',
    facebook: 'https://www.facebook.com/exito',
    hours: '08:00–21:00',
    story: 'Sede Éxito en Carepa. Preview UrabApp para presentar la operación de última milla en el municipio.',
    tags: ['supermercado', 'carepa', 'domicilio'],
    delivery_time: 40,
    min_order: 25000,
    delivery_fee: 5000,
    rating: 4.5,
  },
  {
    n: 3,
    name: 'Olímpica CC Nuestro',
    brand: 'Olímpica',
    category: 'mercado',
    emoji: '🛒',
    municipio: 'Apartadó',
    zone: 'Centro',
    address: 'Centro Comercial Nuestro, Apartadó',
    lat: 7.8832,
    lng: -76.6268,
    phone: null,
    website: 'https://www.olimpica.com',
    instagram: '@olimpica',
    facebook: 'https://www.facebook.com/olimpica',
    hours: '08:00–21:00',
    story: 'Supermercado Olímpica en CC Nuestro. Vitrina demo para onboarding comercial UrabApp.',
    tags: ['supermercado', 'olimpica', 'apartadó'],
    delivery_time: 40,
    min_order: 22000,
    delivery_fee: 4500,
    rating: 4.5,
  },
  {
    n: 4,
    name: 'Tiendas D1 Apartadó',
    brand: 'D1',
    category: 'mercado',
    emoji: '🏪',
    municipio: 'Apartadó',
    zone: 'Centro',
    address: 'Carrera 100 # 94-21, Apartadó',
    lat: 7.8820,
    lng: -76.6280,
    phone: null,
    website: 'https://www.tiendasd1.com',
    instagram: '@tiendasd1',
    facebook: 'https://www.facebook.com/tiendasd1',
    hours: '08:00–20:00',
    story: 'Formato hard-discount D1. Preview de catálogo demo para mostrar el potencial de pedidos rápidos en Urabá.',
    tags: ['d1', 'ahorro', 'barrio'],
    delivery_time: 30,
    min_order: 15000,
    delivery_fee: 4000,
    rating: 4.4,
  },
  {
    n: 5,
    name: 'Cruz Verde Plaza del Río',
    brand: 'Cruz Verde',
    category: 'farmacia',
    emoji: '💊',
    municipio: 'Apartadó',
    zone: 'Villa del Río',
    address: 'CC Plaza del Río Local 1129, Calle 99C # 100-117, Apartadó',
    lat: 7.8842,
    lng: -76.6292,
    phone: null,
    website: 'https://www.cruzverde.com.co',
    instagram: '@cruzverdecolombia',
    facebook: 'https://www.facebook.com/CruzVerdeColombia',
    hours: '08:00–19:00',
    story: 'Droguería Cruz Verde en Plaza del Río. Catálogo sincronizable desde cruzverde.com.co (OTC/cuidado personal).',
    tags: ['farmacia', 'otc', 'bienestar'],
    delivery_time: 25,
    min_order: 12000,
    delivery_fee: 4000,
    rating: 4.7,
  },
  {
    n: 6,
    name: 'Cruz Verde Nuevo Apartadó',
    brand: 'Cruz Verde',
    category: 'farmacia',
    emoji: '💊',
    municipio: 'Apartadó',
    zone: 'Nuevo Apartadó',
    address: 'Calle 95 # 105-36, Barrio Nuevo Apartadó',
    lat: 7.8785,
    lng: -76.6325,
    phone: '6048282324',
    website: 'https://www.cruzverde.com.co',
    instagram: '@cruzverdecolombia',
    facebook: 'https://www.facebook.com/CruzVerdeColombia',
    hours: '06:30–21:00',
    story: 'Sede Cruz Verde / Medicarte en Nuevo Apartadó. Catálogo sincronizable desde cruzverde.com.co.',
    tags: ['farmacia', 'nuevo apartadó'],
    delivery_time: 25,
    min_order: 12000,
    delivery_fee: 4000,
    rating: 4.6,
  },
  {
    n: 7,
    name: 'Cruz Verde Turbo',
    brand: 'Cruz Verde',
    category: 'farmacia',
    emoji: '💊',
    municipio: 'Turbo',
    zone: 'Centro',
    address: 'Calle 104 # 17-108, Turbo',
    lat: 8.0920,
    lng: -76.7285,
    phone: '6048272068',
    website: 'https://www.cruzverde.com.co',
    instagram: '@cruzverdecolombia',
    facebook: 'https://www.facebook.com/CruzVerdeColombia',
    hours: '06:30–19:00',
    story: 'Presencia Cruz Verde en Turbo. Catálogo sincronizable desde cruzverde.com.co para domicilio farmacéutico local.',
    tags: ['farmacia', 'turbo'],
    delivery_time: 30,
    min_order: 12000,
    delivery_fee: 4500,
    rating: 4.5,
  },
  {
    n: 8,
    name: 'Cruz Verde Chigorodó',
    brand: 'Cruz Verde',
    category: 'farmacia',
    emoji: '💊',
    municipio: 'Chigorodó',
    zone: 'Centro',
    address: 'Carrera 100 # 96A-15, Chigorodó',
    lat: 7.6698,
    lng: -76.6815,
    phone: null,
    website: 'https://www.cruzverde.com.co',
    instagram: '@cruzverdecolombia',
    facebook: 'https://www.facebook.com/CruzVerdeColombia',
    hours: '07:00–19:00',
    story: 'Sede Chigorodó. Catálogo sincronizable desde cruzverde.com.co.',
    tags: ['farmacia', 'chigorodó'],
    delivery_time: 30,
    min_order: 12000,
    delivery_fee: 4500,
    rating: 4.5,
  },
  {
    n: 9,
    name: 'Cruz Verde Carepa',
    brand: 'Cruz Verde',
    category: 'farmacia',
    emoji: '💊',
    municipio: 'Carepa',
    zone: 'María Cano',
    address: 'Calle 77 # 78A-35, Barrio María Cano, Carepa',
    lat: 7.7585,
    lng: -76.6555,
    phone: null,
    website: 'https://www.cruzverde.com.co',
    instagram: '@cruzverdecolombia',
    facebook: 'https://www.facebook.com/CruzVerdeColombia',
    hours: '07:00–19:00',
    story: 'Cobertura Carepa. Catálogo sincronizable desde cruzverde.com.co.',
    tags: ['farmacia', 'carepa'],
    delivery_time: 30,
    min_order: 12000,
    delivery_fee: 4500,
    rating: 4.5,
  },
  {
    n: 10,
    name: 'Supermercado Los Ibañez',
    brand: 'Los Ibañez',
    category: 'mercado',
    emoji: '🛒',
    municipio: 'Apartadó',
    zone: 'Centro',
    address: 'Calle 99 # 102-55, Apartadó',
    lat: 7.8828,
    lng: -76.6272,
    phone: '6048280287',
    website: null,
    instagram: null,
    facebook: null,
    hours: '07:00–20:00',
    story: 'Supermercado local de Urabá. Preview de vitrina para invitar al comercio a operar domicilios en UrabApp.',
    tags: ['local', 'supermercado', 'apartadó'],
    delivery_time: 35,
    min_order: 18000,
    delivery_fee: 4500,
    rating: 4.6,
  },
  {
    n: 11,
    name: 'Asadero Riko Pollo',
    brand: 'Riko Pollo',
    category: 'comida',
    emoji: '🍗',
    municipio: 'Apartadó',
    zone: 'Apartadó',
    address: 'Apartadó, Antioquia',
    lat: 7.8815,
    lng: -76.6260,
    phone: null,
    website: null,
    instagram: null,
    facebook: null,
    hours: '10:00–21:00',
    story: 'Asadero local referenciado en directorios de Urabá. Catálogo demo original para reunión comercial.',
    tags: ['pollo', 'asadero', 'local'],
    delivery_time: 30,
    min_order: 15000,
    delivery_fee: 5000,
    rating: 4.7,
  },
];

const DEMO_ROLES = [
  { role: 'Administrador', email: 'admin.preview@urabapp.demo', password: 'UrabApp-Preview-ChangeMe!', note: 'No es cuenta real de Auth; solo guion de venta' },
  { role: 'Manager', email: 'manager.preview@urabapp.demo', password: 'UrabApp-Preview-ChangeMe!', note: 'Demo' },
  { role: 'Cajero', email: 'caja.preview@urabapp.demo', password: 'UrabApp-Preview-ChangeMe!', note: 'Demo' },
  { role: 'Cocina', email: 'cocina.preview@urabapp.demo', password: 'UrabApp-Preview-ChangeMe!', note: 'Demo comida' },
  { role: 'Despacho', email: 'despacho.preview@urabapp.demo', password: 'UrabApp-Preview-ChangeMe!', note: 'Demo' },
  { role: 'Soporte', email: 'soporte.preview@urabapp.demo', password: 'UrabApp-Preview-ChangeMe!', note: 'Demo' },
  { role: 'Marketing', email: 'mkt.preview@urabapp.demo', password: 'UrabApp-Preview-ChangeMe!', note: 'Demo' },
  { role: 'Courier Manager', email: 'fleet.preview@urabapp.demo', password: 'UrabApp-Preview-ChangeMe!', note: 'Demo' },
];

function build() {
  const businesses = [];
  const products = [];

  for (const s of STORES) {
    const id = bizId(s.n);
    const slug = `preview-${s.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
    const description = `${NOTICE}\n\n${s.story}`;
    businesses.push({
      id,
      ...s,
      slug,
      description,
      cover_url: COVER[s.category] || COVER.mercado,
      logo_url: LOGO[s.category] || LOGO.mercado,
      delivery_radius_km: s.delivery_radius_km ?? 5,
      logo_note: 'Adjuntar logo oficial del brand kit / Instagram / Google Business en la reunión. No usar assets de marketplaces competidores.',
      merchant_level: 'Preview Gold',
      verified_badge: true,
      is_onboarding_preview: true,
      image_prompts: {
        cover: `Premium storefront cover for ${s.brand} style grocery/pharmacy/food in Urabá Colombia, no logos, no watermarks, cinematic lighting`,
        logo_slot: `Leave clear space for official ${s.brand} logo provided by merchant`,
      },
    });

    const items = CATALOGS[s.category] || CATALOGS.mercado;
    items.forEach((row, i) => {
      const [name, desc, cat, price, emoji] = row;
      products.push({
        id: prodId(s.n, i + 1),
        business_id: id,
        business_name: s.name,
        name,
        description: `${desc}. ${NOTICE.split('.')[0]}.`,
        category: cat,
        price,
        emoji,
        image_url: PRODUCT_IMG[cat] || '/previews/p-default.jpg',
        image_prompt: `Original demo product photo of ${name.replace(/ demo$/i, '')}, clean marketplace packshot, warm white background, no brand logos, Urabá delivery catalog style`,
        variants: ['Estándar'],
        extras: s.category === 'comida' ? ['Sin salsa', 'Extra salsa'] : ['Unidad'],
        upsell: items[(i + 1) % items.length][0],
        cross_sell: items[(i + 2) % items.length][0],
        preparation_time_min: s.category === 'comida' ? 15 + (i % 10) : 5,
      });
    });
  }

  return { businesses, products, demo_roles: DEMO_ROLES, notice: NOTICE };
}

function toSql(data) {
  const lines = [];
  lines.push('-- Onboarding PREVIEW storefronts — marcas con presencia en Urabá');
  lines.push('-- Catálogos demo originales. NO contiene assets de Rappi u otros marketplaces.');
  lines.push('');
  lines.push('ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;');
  lines.push('');
  lines.push(`INSERT INTO public.businesses (
  id, name, category, description, emoji, municipio, zone, address,
  latitude, longitude, opens_at, closes_at,
  delivery_fee, min_order, delivery_time, delivery_radius_km, rating, total_ratings,
  is_open, is_active, is_published, verification_status, approved_at, slug, phone, cover_url, logo_url
) VALUES`);

  const bizVals = data.businesses.map((b) => {
    const [open, close] = (b.hours || '08:00–21:00').split('–').map((t) => t.trim().replace('.', ':'));
    const desc = b.website
      ? `${b.description}\n\nSitio oficial: ${b.website}`
      : b.description;
    return `(
  ${sqlStr(b.id)}, ${sqlStr(`${b.name} · Preview UrabApp`)}, ${sqlStr(b.category)}, ${sqlStr(desc)}, ${sqlStr(b.emoji)},
  ${sqlStr(b.municipio)}, ${sqlStr(b.zone)}, ${sqlStr(b.address)},
  ${b.lat}, ${b.lng}, ${sqlStr(open.length === 5 ? open : '08:00')}::time, ${sqlStr(close.length === 5 ? close : '21:00')}::time,
  ${b.delivery_fee}, ${b.min_order}, ${b.delivery_time}, ${b.delivery_radius_km ?? 5}, ${b.rating}, ${80 + b.n * 7},
  true, true, true, 'approved', NOW(), ${sqlStr(b.slug)}, ${sqlStr(b.phone)}, ${sqlStr(b.cover_url)}, ${sqlStr(b.logo_url)}
)`;
  });
  lines.push(`${bizVals.join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_published = true,
  verification_status = 'approved',
  cover_url = EXCLUDED.cover_url,
  logo_url = EXCLUDED.logo_url,
  delivery_radius_km = EXCLUDED.delivery_radius_km,
  phone = COALESCE(EXCLUDED.phone, public.businesses.phone);`);

  lines.push('');
  lines.push(`INSERT INTO public.products (
  id, business_id, name, description, emoji, price, category, image_url, is_available, sort_order
) VALUES`);
  const pVals = data.products.map((p, idx) => `(
  ${sqlStr(p.id)}, ${sqlStr(p.business_id)}, ${sqlStr(p.name)}, ${sqlStr(p.description)}, ${sqlStr(p.emoji)},
  ${p.price}, ${sqlStr(p.category)}, ${sqlStr(p.image_url)}, true, ${idx % 50}
)`);
  lines.push(`${pVals.join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  is_available = true;`);

  lines.push('');
  lines.push('ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;');
  return lines.join('\n');
}

const data = build();
const outDir = join(root, 'supabase', 'seed-data');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'uraba-onboarding-previews-v1.json'), JSON.stringify({
  version: 1,
  generated_at: new Date().toISOString(),
  policy: 'No competitor marketplace assets. Official logos must be provided by merchant. Catalogs are original demos.',
  ...data,
  merchant_dashboard_modules: [
    'Dashboard', 'Pedidos', 'Analítica', 'Productos', 'Inventario', 'Cupones',
    'Marketing', 'Equipo', 'Configuración', 'Pagos', 'Notificaciones', 'Reportes',
  ],
  storefront_modules: [
    'Home', 'Destacados', 'Categorías', 'Ofertas', 'Populares', 'Reseñas',
    'Galería', 'Checkout', 'Tracking', 'Favoritos', 'Cupones',
  ],
}, null, 2));

const sqlPath = join(root, 'supabase', 'migrations', '110_seed_onboarding_previews_uraba.sql');
writeFileSync(sqlPath, toSql(data));
console.log('[preview] businesses', data.businesses.length);
console.log('[preview] products', data.products.length);
console.log('[preview] sql', sqlPath);
