/**
 * Genera catálogo original UrabApp — 5 municipios.
 * NO usa contenido de Rappi. Prompts de imagen estilo marketplace genérico.
 *
 * Output:
 *  - supabase/seed-data/uraba-marketplace-v1.json
 *  - supabase/migrations/109_seed_uraba_5_municipios.sql
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const MUNICIPIOS = [
  { id: 'apartado', name: 'Apartadó', lat: 7.8829, lng: -76.6259, zones: ['Centro', 'Ortiz', 'Vélez', 'Laureles'] },
  { id: 'turbo', name: 'Turbo', lat: 8.0926, lng: -76.7281, zones: ['Centro', 'El Progreso', 'Nuevo Horizonte'] },
  { id: 'carepa', name: 'Carepa', lat: 7.7583, lng: -76.6550, zones: ['Centro', 'La Esperanza', 'El Bosque'] },
  { id: 'chigorodo', name: 'Chigorodó', lat: 7.6694, lng: -76.6811, zones: ['Centro', 'Santander', 'Los Almendros'] },
  { id: 'necocli', name: 'Necoclí', lat: 8.4261, lng: -76.7869, zones: ['Centro', 'Playa', 'El Poblado'] },
];

const STYLE = 'original Urabá Colombia marketplace photography, no logos, no watermarks, no brand text, natural light, delivery-app catalog quality';

function bizId(muniIdx, bizIdx) {
  // UUID 8-4-4-4-12 (hex). g4 = MM BB (municipio + negocio)
  const g4 = `${String(muniIdx).padStart(2, '0')}${String(bizIdx).padStart(2, '0')}`;
  const g5 = String(muniIdx * 1000 + bizIdx).padStart(12, '0');
  return `b1090000-0000-4000-${g4}-${g5}`;
}

function productId(muniIdx, bizIdx, pIdx) {
  const g4 = `${String(muniIdx).padStart(2, '0')}${String(bizIdx).padStart(2, '0')}`;
  const g5 = String(pIdx).padStart(12, '0');
  return `p1090000-0000-4000-${g4}-${g5}`;
}

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function sqlStr(v) {
  if (v == null) return 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function jitter(base, n) {
  return Number((base + (n % 7) * 0.0012 - 0.003).toFixed(6));
}

function imagePrompts(subject, kind = 'food') {
  const base =
    kind === 'food'
      ? `${subject}, plated for delivery, ceramic dish, wooden table, soft side light, shallow depth of field, ${STYLE}`
      : kind === 'pack'
        ? `${subject}, clean product packshot on warm white #FAF9F6 background, soft shadow, square crop, ${STYLE}`
        : `${subject}, retail product on shelf context, bright store lighting, ${STYLE}`;
  return {
    hero: `Hero 1:1 — ${base}`,
    thumbnail: `Thumbnail 1:1 — tight crop of ${subject}, centered, high contrast, ${STYLE}`,
    lifestyle: `Lifestyle 4:5 — person enjoying ${subject} in casual Urabá home setting, candid, ${STYLE}`,
    cover: `Store cover 16:9 — ${subject} atmosphere, inviting facade or kitchen scene, ${STYLE}`,
  };
}

/** Plantillas de menú originales por tipo de cocina */
const MENUS = {
  asados: {
    category: 'comida',
    emoji: '🥩',
    tags: ['parrilla', 'carnes', 'familiar'],
    items: [
      ['Picada Urabá (2 pers.)', 'Carne, chorizo, chicharrón, arepa y guacamole', 'Platos', 42000, 48000, '🥩'],
      ['Picada familiar (4 pers.)', 'Bandeja surtida de parrilla con acompañamientos', 'Platos', 78000, null, '🥩'],
      ['Punta de anca 300g', 'Término a elección, papa criolla y ensalada', 'Carnes', 32000, null, '🥩'],
      ['Costilla BBQ', 'Costilla glaseada, yuca y ensalada', 'Carnes', 35000, 39000, '🍖'],
      ['Churrasco 350g', 'Corte jugoso, chimichurri de la casa', 'Carnes', 38000, null, '🥩'],
      ['Chorizo artesanal x4', 'Con arepa y hogao', 'Entradas', 16000, null, '🌭'],
      ['Morcilla criolla x3', 'Con limón y ají', 'Entradas', 14000, null, '🌭'],
      ['Chicharrón crocante', 'Porción generosa, limón', 'Entradas', 18000, null, '🥓'],
      ['Arepa de queso', 'Arepa asada rellena', 'Acompañamientos', 6000, null, '🫓'],
      ['Papa criolla salteada', 'Con sal de ajo', 'Acompañamientos', 8000, null, '🥔'],
      ['Yuca frita', 'Con suero costeño', 'Acompañamientos', 7000, null, '🥔'],
      ['Ensalada fresca', 'Lechuga, tomate, cebolla y vinagreta', 'Acompañamientos', 7000, null, '🥗'],
      ['Guacamole casero', 'Porción para compartir', 'Salsas', 5000, null, '🥑'],
      ['Ají de la casa', 'Picante medio', 'Salsas', 2000, null, '🌶️'],
      ['Combo parrillero 1', 'Carne 250g + papa + gaseosa', 'Combos', 28000, 32000, '🍱'],
      ['Combo parrillero 2', 'Chorizo + chicharrón + arepa + gaseosa', 'Combos', 24000, null, '🍱'],
      ['Menú infantil carne', 'Carne molida, papa y jugo', 'Kids', 16000, null, '🧒'],
      ['Brownie con helado', 'Postre caliente', 'Postres', 12000, null, '🍫'],
      ['Limonada natural 16oz', 'Recién exprimida', 'Bebidas', 5000, null, '🍋'],
      ['Gaseosa personal', '350 ml', 'Bebidas', 3500, null, '🥤'],
      ['Agua botella', '600 ml', 'Bebidas', 3000, null, '💧'],
      ['Cerveza nacional', 'Unidad fría', 'Bebidas', 6000, null, '🍺'],
      ['Alitas BBQ x8', 'Glaseadas, papas', 'Platos', 26000, null, '🍗'],
      ['Hamburguesa de res', '140g, queso, papas', 'Platos', 22000, null, '🍔'],
      ['Salchipapa especial', 'Salchicha, papa, salsas', 'Platos', 15000, null, '🍟'],
      ['Patacón con hogao', 'Entrada criolla', 'Entradas', 9000, null, '🍌'],
      ['Combo ejecutivo', 'Carne del día + jugo', 'Combos', 20000, null, '🍱'],
      ['Edición plátano maduro', 'Maduro asado con queso', 'Edición limitada', 10000, null, '🍌'],
    ],
  },
  pizza: {
    category: 'comida',
    emoji: '🍕',
    tags: ['pizza', 'italiana', 'familiar'],
    items: [
      ['Pizza margarita mediana', 'Salsa, mozzarella, albahaca', 'Pizzas', 26000, null, '🍕'],
      ['Pizza hawaiana mediana', 'Piña y jamón', 'Pizzas', 28000, 32000, '🍕'],
      ['Pizza pepperoni mediana', 'Pepperoni extra queso', 'Pizzas', 30000, null, '🍕'],
      ['Pizza pollo BBQ mediana', 'Pollo, cebolla, BBQ', 'Pizzas', 32000, null, '🍕'],
      ['Pizza vegetariana', 'Champiñón, pimentón, aceituna', 'Pizzas', 29000, null, '🍕'],
      ['Pizza familiar 4 sabores', 'Para 4 personas', 'Pizzas', 52000, null, '🍕'],
      ['Pizza premium trufa', 'Champiñón y aceite de trufa', 'Premium', 42000, null, '🍕'],
      ['Lasagna boloñesa', 'Porción individual', 'Pastas', 24000, null, '🍝'],
      ['Spaghetti a la carbonara', 'Crema y tocineta', 'Pastas', 22000, null, '🍝'],
      ['Raviolis de ricotta', 'Salsa pomodoro', 'Pastas', 23000, null, '🍝'],
      ['Pan de ajo', '4 unidades', 'Entradas', 9000, null, '🥖'],
      ['Deditos de queso x6', 'Con salsa ranch', 'Entradas', 14000, null, '🧀'],
      ['Alitas buffalo x6', 'Picante medio', 'Entradas', 18000, null, '🍗'],
      ['Ensalada César', 'Pollo opcional +2000', 'Ensaladas', 16000, null, '🥗'],
      ['Combo pizza + gaseosa', 'Mediana + 1.5L', 'Combos', 34000, 38000, '🍱'],
      ['Combo pareja', '2 personales + postre', 'Combos', 45000, null, '🍱'],
      ['Pizza kids', 'Personal queso', 'Kids', 15000, null, '🧒'],
      ['Tiramisú', 'Porción', 'Postres', 11000, null, '🍰'],
      ['Gelato 2 bolas', 'Sabores del día', 'Postres', 9000, null, '🍦'],
      ['Limonada de coco', '16oz', 'Bebidas', 7000, null, '🥥'],
      ['Gaseosa 1.5L', 'Para compartir', 'Bebidas', 7000, null, '🥤'],
      ['Té helado', 'Durazno o limón', 'Bebidas', 5000, null, '🧋'],
      ['Extra queso', 'Adición', 'Extras', 4000, null, '🧀'],
      ['Extra pepperoni', 'Adición', 'Extras', 4500, null, '🍕'],
      ['Borde relleno queso', 'Solo medianas/familiares', 'Extras', 6000, null, '🧀'],
      ['Calzone jamón', 'Cerrado al horno', 'Platos', 25000, null, '🥟'],
      ['Focaccia del día', 'Aceite y romero', 'Entradas', 10000, null, '🍞'],
      ['Promo martes 2x1 personal', 'Solo martes, queso', 'Edición limitada', 18000, null, '🏷️'],
    ],
  },
  pollo: {
    category: 'comida',
    emoji: '🍗',
    tags: ['pollo', 'broaster', 'combos'],
    items: [
      ['1/4 pollo broaster', 'Pierna o pechuga, papas', 'Pollo', 16000, null, '🍗'],
      ['1/2 pollo broaster', 'Con papas y ensalada', 'Pollo', 28000, 32000, '🍗'],
      ['Pollo entero broaster', 'Familiar, 8 piezas aprox.', 'Pollo', 48000, null, '🍗'],
      ['Combo 2 piezas', '2 piezas + papas + gaseosa', 'Combos', 18000, null, '🍱'],
      ['Combo 3 piezas', '3 piezas + papas + gaseosa', 'Combos', 22000, 25000, '🍱'],
      ['Combo familiar', '8 piezas + papas familiares + 1.5L', 'Combos', 62000, null, '🍱'],
      ['Nuggets x10', 'Con salsa a elegir', 'Kids', 14000, null, '🧒'],
      ['Alitas BBQ x6', 'Glaseadas', 'Alitas', 17000, null, '🍗'],
      ['Alitas buffalo x6', 'Picante', 'Alitas', 17000, null, '🌶️'],
      ['Papas grandes', 'Sal y orégano', 'Acompañamientos', 8000, null, '🍟'],
      ['Papas familiares', 'Para compartir', 'Acompañamientos', 14000, null, '🍟'],
      ['Aroz con verduras', 'Porción', 'Acompañamientos', 6000, null, '🍚'],
      ['Ensalada coleslaw', 'Crema ligera', 'Acompañamientos', 5000, null, '🥗'],
      ['Arepa sencilla', 'Asada', 'Acompañamientos', 3500, null, '🫓'],
      ['Salsa BBQ', 'Porción', 'Salsas', 2000, null, '🫙'],
      ['Salsa ajo', 'Porción', 'Salsas', 2000, null, '🫙'],
      ['Salsa picante', 'Nivel alto', 'Salsas', 2000, null, '🌶️'],
      ['Hamburguesa de pollo', 'Crispy, lechuga, tomate', 'Platos', 19000, null, '🍔'],
      ['Wrap de pollo', 'Tortilla, vegetales', 'Platos', 18000, null, '🌯'],
      ['Menú infantil nuggets', '6 nuggets + papa + jugo', 'Kids', 15000, null, '🧒'],
      ['Postre brownie', 'Unidad', 'Postres', 7000, null, '🍫'],
      ['Gaseosa personal', '350 ml', 'Bebidas', 3500, null, '🥤'],
      ['Jugo hit', 'Personal', 'Bebidas', 4000, null, '🧃'],
      ['Limonada', '16oz', 'Bebidas', 5000, null, '🍋'],
      ['Agua', '600 ml', 'Bebidas', 3000, null, '💧'],
      ['Pollo a la plancha', 'Opción más liviana', 'Premium', 20000, null, '🍗'],
      ['Combo oficina', '2 piezas + arroz + té', 'Combos', 17000, null, '🍱'],
      ['Edición miel mostaza', 'Alitas x8', 'Edición limitada', 19000, null, '🍯'],
    ],
  },
  burger: {
    category: 'comida',
    emoji: '🍔',
    tags: ['hamburguesas', 'smash', 'papas'],
    items: [
      ['Clásica Urabá', 'Carne 140g, queso, vegetales', 'Hamburguesas', 18000, null, '🍔'],
      ['Doble smash', 'Dos carnes smash, cheddar', 'Hamburguesas', 24000, 27000, '🍔'],
      ['BBQ bacon', 'Tocineta, BBQ, cebolla crispy', 'Hamburguesas', 26000, null, '🍔'],
      ['Pollo crispy', 'Pechuga empanizada', 'Hamburguesas', 20000, null, '🍔'],
      ['Veggie bean', 'Hamburguesa de frijol y avena', 'Hamburguesas', 19000, null, '🌱'],
      ['Premium angus', 'Carne 180g, cebolla caramelizada', 'Premium', 32000, null, '🍔'],
      ['Combo clásico', 'Burger + papas + gaseosa', 'Combos', 25000, 28000, '🍱'],
      ['Combo doble', 'Doble smash + papas + gaseosa', 'Combos', 32000, null, '🍱'],
      ['Papas caseras', 'Porción', 'Acompañamientos', 7000, null, '🍟'],
      ['Papas con queso', 'Cheddar fundido', 'Acompañamientos', 10000, null, '🍟'],
      ['Aros de cebolla', 'Porción', 'Acompañamientos', 9000, null, '🧅'],
      ['Onion rings BBQ', 'Con dip', 'Acompañamientos', 10000, null, '🧅'],
      ['Extra carne', '140g', 'Extras', 7000, null, '🥩'],
      ['Extra tocineta', '2 lonjas', 'Extras', 4000, null, '🥓'],
      ['Extra queso', 'Cheddar', 'Extras', 3000, null, '🧀'],
      ['Kids mini burger', 'Mini + papa + jugo', 'Kids', 14000, null, '🧒'],
      ['Malteada vainilla', '16oz', 'Bebidas', 10000, null, '🥛'],
      ['Malteada chocolate', '16oz', 'Bebidas', 10000, null, '🍫'],
      ['Limonada', '16oz', 'Bebidas', 5000, null, '🍋'],
      ['Gaseosa personal', '350 ml', 'Bebidas', 3500, null, '🥤'],
      ['Hot dog ranchero', 'Con papas', 'Platos', 15000, null, '🌭'],
      ['Salchipapa urbana', 'Salsas a elección', 'Platos', 14000, null, '🍟'],
      ['Brownie', 'Casero', 'Postres', 8000, null, '🍫'],
      ['Cookie con chips', 'Caliente', 'Postres', 6000, null, '🍪'],
      ['Combo noche', 'Burger + malteada', 'Combos', 27000, null, '🌙'],
      ['Salsa de la casa', 'Porción', 'Salsas', 2000, null, '🫙'],
      ['Pickles extra', 'Porción', 'Extras', 1500, null, '🥒'],
      ['Edición ají dulce', 'Burger con hogao costeño', 'Edición limitada', 22000, null, '🌶️'],
    ],
  },
  cafe: {
    category: 'comida',
    emoji: '☕',
    tags: ['café', 'desayuno', 'panadería'],
    items: [
      ['Café americano', '12oz', 'Café', 4000, null, '☕'],
      ['Café con leche', '12oz', 'Café', 5000, null, '☕'],
      ['Cappuccino', 'Espuma cremosa', 'Café', 7000, null, '☕'],
      ['Latte', '12oz', 'Café', 7500, null, '☕'],
      ['Chocolate caliente', 'Con marshmallow', 'Café', 7000, null, '🍫'],
      ['Tinto costeño', 'Pequeño', 'Café', 2500, null, '☕'],
      ['Desayuno completo', 'Huevos, arepa, queso, café', 'Desayunos', 14000, 16000, '🍳'],
      ['Desayuno light', 'Yogurt, fruta, granola', 'Desayunos', 12000, null, '🥣'],
      ['Calentado antioqueño', 'Frijol, arroz, carne, huevo', 'Desayunos', 16000, null, '🍛'],
      ['Pandebono x3', 'Calientes', 'Panadería', 6000, null, '🧀'],
      ['Almojábana x2', 'Recién horneada', 'Panadería', 5000, null, '🍞'],
      ['Croissant jamón queso', 'Horno del día', 'Panadería', 8000, null, '🥐'],
      ['Brownie', 'Porción', 'Postres', 7000, null, '🍫'],
      ['Cheesecake frutos rojos', 'Porción', 'Postres', 11000, null, '🍰'],
      ['Muffin del día', 'Sabor rotativo', 'Panadería', 5500, null, '🧁'],
      ['Jugo de naranja', 'Natural 12oz', 'Bebidas', 6000, null, '🍊'],
      ['Limonada de hierbabuena', '16oz', 'Bebidas', 5500, null, '🍋'],
      ['Agua', '600 ml', 'Bebidas', 3000, null, '💧'],
      ['Sándwich pollo', 'Pan artesanal', 'Platos', 13000, null, '🥪'],
      ['Sándwich vegetariano', 'Queso y vegetales', 'Platos', 12000, null, '🥪'],
      ['Empanada de carne', 'Unidad', 'Snacks', 3500, null, '🥟'],
      ['Combo tarde', 'Café + pandebono', 'Combos', 9000, 11000, '🍱'],
      ['Combo oficina', 'Sándwich + jugo', 'Combos', 16000, null, '🍱'],
      ['Kids hotcakes', 'Con miel', 'Kids', 10000, null, '🧒'],
      ['Té chai latte', 'Especiado', 'Café', 8000, null, '🧋'],
      ['Affogato', 'Helado + espresso', 'Postres', 9000, null, '🍨'],
      ['Galleta avena', 'Unidad', 'Panadería', 3500, null, '🍪'],
      ['Edición café de Urabá', 'Origen regional 12oz', 'Edición limitada', 8500, null, '☕'],
    ],
  },
  arepas: {
    category: 'comida',
    emoji: '🫓',
    tags: ['arepas', 'desayuno', 'criollo'],
    items: [
      ['Arepa de huevo', 'Frita, huevo adentro', 'Arepas', 7000, null, '🫓'],
      ['Arepa de huevo doble', 'Doble huevo', 'Arepas', 9000, null, '🫓'],
      ['Arepa con queso', 'Queso costeño', 'Arepas', 6000, null, '🫓'],
      ['Arepa con todo', 'Huevo, queso, hogao', 'Arepas', 10000, null, '🫓'],
      ['Arepa de pollo', 'Pollo desmechado', 'Arepas', 11000, null, '🫓'],
      ['Arepa de carne', 'Carne desmechada', 'Arepas', 12000, null, '🫓'],
      ['Arepa de chorizo', 'Chorizo y hogao', 'Arepas', 11000, null, '🫓'],
      ['Combo desayuno', 'Arepa huevo + café + jugo', 'Combos', 14000, 16000, '🍱'],
      ['Combo almuerzo', 'Arepa carne + limonada', 'Combos', 15000, null, '🍱'],
      ['Empanada carne', 'Unidad', 'Snacks', 3500, null, '🥟'],
      ['Empanada pollo', 'Unidad', 'Snacks', 3500, null, '🥟'],
      ['Empanada papa-carne', 'Unidad', 'Snacks', 3500, null, '🥟'],
      ['Buñuelo x2', 'Calientes', 'Snacks', 4000, null, '🍩'],
      ['Jugo de mango', 'Natural', 'Bebidas', 6000, null, '🥭'],
      ['Jugo de lulo', 'Natural', 'Bebidas', 6000, null, '🧃'],
      ['Café con leche', 'Vaso', 'Bebidas', 4000, null, '☕'],
      ['Tinto', 'Pequeño', 'Bebidas', 2000, null, '☕'],
      ['Gaseosa personal', '350 ml', 'Bebidas', 3500, null, '🥤'],
      ['Suero costeño', 'Porción', 'Extras', 3000, null, '🥛'],
      ['Ají', 'Porción', 'Salsas', 1500, null, '🌶️'],
      ['Hogao', 'Porción', 'Salsas', 2000, null, '🫙'],
      ['Kids arepa queso', 'Pequeña + jugo', 'Kids', 9000, null, '🧒'],
      ['Patacón con queso', 'Entrada', 'Platos', 8000, null, '🍌'],
      ['Caldo de costilla', 'Taza', 'Platos', 10000, null, '🍲'],
      ['Changua', 'Desayuno', 'Desayunos', 9000, null, '🥣'],
      ['Huevos pericos', 'Con arepa', 'Desayunos', 10000, null, '🍳'],
      ['Mazamorra', 'Vaso', 'Postres', 5000, null, '🥛'],
      ['Edición arepa de camarón', 'Fines de semana', 'Edición limitada', 14000, null, '🦐'],
    ],
  },
  helados: {
    category: 'comida',
    emoji: '🍦',
    tags: ['helados', 'postres', 'fríos'],
    items: [
      ['Copa 2 sabores', 'Elige tus favoritos', 'Helados', 8000, null, '🍦'],
      ['Copa 3 sabores', 'Con salsa y chispas', 'Helados', 11000, null, '🍦'],
      ['Milkshake fresa', '16oz', 'Malteadas', 12000, null, '🥤'],
      ['Milkshake chocolate', '16oz', 'Malteadas', 12000, null, '🍫'],
      ['Milkshake oreo style', 'Galleta triturada', 'Malteadas', 13000, null, '🍪'],
      ['Sundae brownie', 'Helado + brownie caliente', 'Copas', 14000, 16000, '🍨'],
      ['Banana split', 'Clásico 3 bolas', 'Copas', 16000, null, '🍌'],
      ['Açaí bowl', 'Granola y fruta', 'Bowls', 15000, null, '🫐'],
      ['Paleta artesanal', 'Sabores del día', 'Paletas', 5000, null, '🍡'],
      ['Paleta cremosa', 'Leche condensada', 'Paletas', 5500, null, '🍡'],
      ['Cono sencillo', '1 bola', 'Helados', 5000, null, '🍦'],
      ['Cono doble', '2 bolas', 'Helados', 8000, null, '🍦'],
      ['Waffle con helado', 'Waffle fresco', 'Postres', 14000, null, '🧇'],
      ['Crepe Nutella', 'Con helado', 'Postres', 15000, null, '🍫'],
      ['Affogato tropical', 'Helado + espresso', 'Postres', 10000, null, '☕'],
      ['Kids mini copa', '1 bola + chispas', 'Kids', 6000, null, '🧒'],
      ['Agua', '600 ml', 'Bebidas', 3000, null, '💧'],
      ['Gaseosa personal', '350 ml', 'Bebidas', 3500, null, '🥤'],
      ['Limonada de coco', '16oz', 'Bebidas', 7000, null, '🥥'],
      ['Topping Oreo', 'Extra', 'Extras', 2000, null, '🍪'],
      ['Topping salsa chocolate', 'Extra', 'Extras', 1500, null, '🍫'],
      ['Topping frutos secos', 'Extra', 'Extras', 2000, null, '🥜'],
      ['Combo pareja', '2 copas 2 sabores', 'Combos', 15000, null, '🍱'],
      ['Combo familia', 'Copa familiar 1L', 'Combos', 28000, null, '🍱'],
      ['Helado literario', '1 litro para llevar', 'Para llevar', 22000, null, '📦'],
      ['Granizado lulo', 'Vaso', 'Granizados', 7000, null, '🧊'],
      ['Granizado maracuyá', 'Vaso', 'Granizados', 7000, null, '🧊'],
      ['Edición mango biche', 'Temporada', 'Edición limitada', 9000, null, '🥭'],
    ],
  },
  mercado: {
    category: 'mercado',
    emoji: '🛒',
    tags: ['abarrotes', 'frescos', 'hogar'],
    items: [
      ['Huevos AA x12', 'Cartón', 'Lácteos y huevos', 12000, null, '🥚'],
      ['Leche entera 1L', 'UHT', 'Lácteos y huevos', 5500, null, '🥛'],
      ['Queso costeño 250g', 'Fresco', 'Lácteos y huevos', 9000, null, '🧀'],
      ['Yogurt bebible', 'Unidad', 'Lácteos y huevos', 3500, null, '🥛'],
      ['Pan tajado', 'Bolsa', 'Panadería', 6000, null, '🍞'],
      ['Arroz 1kg', 'Blanco', 'Despensa', 4500, null, '🍚'],
      ['Aceite 1L', 'Vegetal', 'Despensa', 12000, 14000, '🫒'],
      ['Azúcar 1kg', 'Blanca', 'Despensa', 4500, null, '🧂'],
      ['Sal 1kg', 'Refinada', 'Despensa', 2500, null, '🧂'],
      ['Pasta spaghetti 500g', 'Caja', 'Despensa', 4000, null, '🍝'],
      ['Atún lata', 'Agua o aceite', 'Despensa', 5500, null, '🐟'],
      ['Frijol cargamanto 500g', 'Bolsa', 'Despensa', 5000, null, '🫘'],
      ['Plátano maduro x3', 'Unidad aprox.', 'Frutas y verduras', 4000, null, '🍌'],
      ['Tomate chonto 500g', 'Fresco', 'Frutas y verduras', 3500, null, '🍅'],
      ['Cebolla cabezona 500g', 'Fresco', 'Frutas y verduras', 3000, null, '🧅'],
      ['Papa pastusa 1kg', 'Fresco', 'Frutas y verduras', 4500, null, '🥔'],
      ['Banano x6', 'Racimo pequeño', 'Frutas y verduras', 4000, null, '🍌'],
      ['Limón x5', 'Ácidos', 'Frutas y verduras', 2500, null, '🍋'],
      ['Pollo entero congelado', 'Aprox 1.5kg', 'Congelados', 18000, null, '🍗'],
      ['Carne molida 500g', 'Res', 'Carnes', 14000, null, '🥩'],
      ['Jabón en barra x3', 'Ropa', 'Aseo', 8000, null, '🧼'],
      ['Detergente 1kg', 'En polvo', 'Aseo', 12000, null, '🧺'],
      ['Papel higiénico x4', 'Doble hoja', 'Aseo', 10000, 12000, '🧻'],
      ['Jabón antibacterial', 'Líquido 250ml', 'Cuidado personal', 7000, null, '🧴'],
      ['Pasta dental', 'Tubo', 'Cuidado personal', 6500, null, '🦷'],
      ['Pañales etapa 3 x10', 'Pack', 'Bebé', 22000, null, '👶'],
      ['Pañitos húmedos', 'Paquete', 'Bebé', 9000, null, '👶'],
      ['Gaseosa 1.5L', 'Sabor a elegir', 'Bebidas', 7000, null, '🥤'],
      ['Agua 6L', 'Bidón', 'Bebidas', 8000, null, '💧'],
      ['Snack papas 150g', 'Bolsa', 'Snacks', 5500, null, '🥔'],
      ['Galletas surtidas', 'Paquete', 'Snacks', 4500, null, '🍪'],
      ['Café molido 250g', 'Tradicional', 'Despensa', 11000, null, '☕'],
    ],
  },
  farmacia: {
    category: 'farmacia',
    emoji: '💊',
    tags: ['otc', 'cuidado', 'bienestar'],
    items: [
      ['Acetaminofén 500mg x20', 'Uso OTC', 'Analgésicos', 8000, null, '💊'],
      ['Ibuprofeno 400mg x10', 'Uso OTC', 'Analgésicos', 9000, null, '💊'],
      ['Suero oral', 'Sobre', 'Primeros auxilios', 3500, null, '🧪'],
      ['Curitas x20', 'Surtidas', 'Primeros auxilios', 6000, null, '🩹'],
      ['Alcohol antiséptico 120ml', 'Botella', 'Primeros auxilios', 5000, null, '🧴'],
      ['Agua oxigenada 120ml', 'Botella', 'Primeros auxilios', 4500, null, '🧴'],
      ['Gasas estériles', 'Paquete', 'Primeros auxilios', 7000, null, '🩹'],
      ['Termómetro digital', 'Unidad', 'Bienestar', 25000, null, '🌡️'],
      ['Vitamina C efervescente', 'Tubo', 'Bienestar', 18000, 22000, '🍊'],
      ['Multivitamínico x30', 'Tabletas', 'Bienestar', 32000, null, '💊'],
      ['Protector solar FPS50', 'Crema 60ml', 'Cuidado personal', 35000, null, '☀️'],
      ['Crema humectante', '120ml', 'Cuidado personal', 18000, null, '🧴'],
      ['Shampoo anticaspa', '400ml', 'Cuidado personal', 22000, null, '🧴'],
      ['Jabón íntimo', '200ml', 'Cuidado personal', 16000, null, '🧴'],
      ['Toallas higiénicas x10', 'Paquete', 'Cuidado personal', 9000, null, '📦'],
      ['Pañales etapa 2 x12', 'Pack', 'Bebé', 28000, null, '👶'],
      ['Crema antipañalitis', 'Tubo', 'Bebé', 20000, null, '👶'],
      ['Repelente spray', '120ml', 'Bienestar', 18000, null, '🦟'],
      ['Sales de rehidratación', 'Caja x5', 'Primeros auxilios', 10000, null, '🧪'],
      ['Pastillas para la garganta', 'Caja', 'Analgésicos', 8000, null, '🍬'],
      ['Alcohol en gel 60ml', 'Antibacterial', 'Cuidado personal', 6000, null, '🧴'],
      ['Mascarillas x10', 'Desechables', 'Bienestar', 8000, null, '😷'],
      ['Preservativos x3', 'Caja', 'Cuidado personal', 9000, null, '📦'],
      ['Prueba de embarazo', 'Unidad', 'Bienestar', 12000, null, '🧪'],
      ['Algodón 50g', 'Bolsa', 'Primeros auxilios', 4000, null, '☁️'],
      ['Gotas lubricantes oculares', 'Frasco', 'Bienestar', 22000, null, '👁️'],
      ['Jabón neutro', 'Barra', 'Cuidado personal', 5000, null, '🧼'],
      ['Kit viaje básicos', 'Curitas + gel + acetaminofén', 'Kits', 25000, null, '🧰'],
      ['Suero fisiológico', 'Frasco', 'Primeros auxilios', 7000, null, '💧'],
      ['Talco mentolado', '120g', 'Cuidado personal', 9000, null, '🧴'],
    ],
  },
  tecnologia: {
    category: 'tecnologia',
    emoji: '📱',
    tags: ['celulares', 'accesorios', 'audio'],
    items: [
      ['Cargador USB-C 20W', 'Carga rápida', 'Cargadores', 35000, 42000, '🔌'],
      ['Cable USB-C 1m', 'Reforzado', 'Cables', 18000, null, '🔌'],
      ['Cable Lightning compatible', '1m', 'Cables', 22000, null, '🔌'],
      ['Power bank 10000mAh', 'Compacto', 'Energía', 65000, 75000, '🔋'],
      ['Audífonos in-ear', 'Con micrófono', 'Audio', 28000, null, '🎧'],
      ['Audífonos Bluetooth', 'Over-ear livianos', 'Audio', 85000, null, '🎧'],
      ['Case transparente universal', 'TPU', 'Fundas', 15000, null, '📱'],
      ['Case antichoque', 'Bordes reforzados', 'Fundas', 25000, null, '📱'],
      ['Vidrio templado', 'Universal 6.1–6.7"', 'Protectores', 18000, null, '🛡️'],
      ['Soporte para carro', 'Magnético', 'Accesorios', 30000, null, '🚗'],
      ['Mouse inalámbrico', 'USB', 'Computación', 45000, null, '🖱️'],
      ['Teclado compacto', 'USB', 'Computación', 55000, null, '⌨️'],
      ['Memoria USB 32GB', 'USB 3.0', 'Almacenamiento', 28000, null, '💾'],
      ['Memoria USB 64GB', 'USB 3.0', 'Almacenamiento', 40000, null, '💾'],
      ['Adaptador HDMI', 'USB-C a HDMI', 'Adaptadores', 48000, null, '🖥️'],
      ['Lámpara LED USB', 'Flexible', 'Smart home', 22000, null, '💡'],
      ['Enchufe smart WiFi', 'App', 'Smart home', 70000, null, '🔌'],
      ['Control TV universal', 'Compatible', 'Accesorios', 35000, null, '📺'],
      ['Parlante Bluetooth mini', 'Resistente', 'Audio', 90000, 110000, '🔊'],
      ['Gamepad Bluetooth', 'Android/PC', 'Gaming', 95000, null, '🎮'],
      ['Base cooler laptop', 'USB', 'Computación', 60000, null, '💻'],
      ['Hub USB 4 puertos', 'USB 3.0', 'Adaptadores', 40000, null, '🔌'],
      ['Cargador de carro dual', 'USB-A + USB-C', 'Cargadores', 32000, null, '🚗'],
      ['Soporte celular escritorio', 'Ajustable', 'Accesorios', 20000, null, '📱'],
      ['Kit limpieza pantallas', 'Spray + paño', 'Accesorios', 15000, null, '🧹'],
      ['Tarjeta microSD 64GB', 'Clase 10', 'Almacenamiento', 45000, null, '💾'],
      ['Auriculares gaming', 'Mic boom', 'Gaming', 120000, null, '🎧'],
      ['Cable HDMI 2m', 'Full HD', 'Cables', 25000, null, '🖥️'],
    ],
  },
  mascotas: {
    category: 'mascotas',
    emoji: '🐾',
    tags: ['perro', 'gato', 'accesorios'],
    items: [
      ['Croqueta perro adulto 2kg', 'Pollo', 'Alimento perro', 28000, null, '🐕'],
      ['Croqueta perro adulto 4kg', 'Pollo', 'Alimento perro', 52000, 58000, '🐕'],
      ['Croqueta cachorro 2kg', 'Crecimiento', 'Alimento perro', 30000, null, '🐶'],
      ['Croqueta gato 1.5kg', 'Salmón', 'Alimento gato', 32000, null, '🐈'],
      ['Snack dental perro', 'Bolsa', 'Snacks', 12000, null, '🦴'],
      ['Snack crema gato', 'Pack x5', 'Snacks', 14000, null, '🐈'],
      ['Arena aglomerante 4kg', 'Lavanda', 'Higiene', 22000, null, '🐈'],
      ['Pala para arena', 'Plástica', 'Higiene', 8000, null, '🧹'],
      ['Collar ajustable M', 'Nylon', 'Accesorios', 15000, null, '🦮'],
      ['Correa 1.5m', 'Nylon', 'Accesorios', 18000, null, '🦮'],
      ['Plato doble', 'Acero', 'Accesorios', 20000, null, '🥣'],
      ['Juguete cuerda', 'Resistente', 'Juguetes', 10000, null, '🧸'],
      ['Pelota con cascabel', 'Gato', 'Juguetes', 8000, null, '🎾'],
      ['Cama mediana', 'Suave', 'Descanso', 65000, null, '🛏️'],
      ['Shampoo hipoalergénico', '250ml', 'Higiene', 22000, null, '🧴'],
      [' Antipulgas collar', 'Perro M', 'Salud', 45000, null, '🪲'],
      ['Pañitos húmedos pet', 'Pack', 'Higiene', 12000, null, '🧻'],
      ['Transportadora blanda', 'Talla S', 'Viaje', 80000, null, '👜'],
      ['Bebedero portátil', '500ml', 'Viaje', 25000, null, '💧'],
      ['Premios entrenamiento', 'Bolsa', 'Snacks', 15000, null, '🦴'],
      ['Rascador vertical', 'Sisal', 'Gatos', 70000, null, '🐈'],
      ['Arnés reflectivo M', 'Seguridad', 'Accesorios', 35000, null, '🦮'],
      ['Comedero automático mini', 'Programable', 'Accesorios', 120000, null, '⏱️'],
      ['Kit primerizas cachorro', 'Plato + juguete + snack', 'Kits', 45000, null, '🎁'],
      ['Galletas avena pet', 'Snack natural', 'Snacks', 11000, null, '🍪'],
      ['Toalla baño pet', 'Absorbente', 'Higiene', 18000, null, '🧺'],
      ['Juguete mordedor', 'Caucho', 'Juguetes', 16000, null, '🦴'],
      ['Vitaminas pet jarabe', 'Suplemento', 'Salud', 38000, null, '💊'],
    ],
  },
  tiendas: {
    category: 'tiendas',
    emoji: '🏪',
    tags: ['hogar', 'belleza', 'barrio'],
    items: [
      ['Cepillo dental x2', 'Suave', 'Cuidado personal', 8000, null, '🪥'],
      ['Desodorante roll-on', 'Unisex', 'Cuidado personal', 12000, null, '🧴'],
      ['Crema de manos', '60ml', 'Belleza', 10000, null, '💅'],
      ['Esmalte básico', 'Color a elegir', 'Belleza', 9000, null, '💅'],
      ['Labial hidratante', 'Transparente', 'Belleza', 11000, null, '💄'],
      ['Peine y cepillo set', 'Cabello', 'Belleza', 15000, null, '💇'],
      ['Velas aromáticas', 'Pack x2', 'Hogar', 18000, null, '🕯️'],
      ['Organizador plástico', 'Multiusos', 'Hogar', 22000, null, '📦'],
      ['Trapero microfibra', 'Unidad', 'Hogar', 14000, null, '🧹'],
      ['Guantes de cocina', 'Par', 'Hogar', 12000, null, '🧤'],
      ['Termo 500ml', 'Acero', 'Hogar', 35000, 42000, '🥤'],
      ['Lonchera térmica', 'Escuela/oficina', 'Hogar', 28000, null, '👜'],
      ['Cuaderno universitario', '100 hojas', 'Papelería', 6000, null, '📓'],
      ['Lapiceros x4', 'Azul', 'Papelería', 5000, null, '✏️'],
      ['Marcadores x6', 'Colores', 'Papelería', 9000, null, '🖍️'],
      ['Cinta adhesiva', 'Transparente', 'Papelería', 4000, null, '📎'],
      ['Bolsas reutilizables x3', 'Mercado', 'Hogar', 12000, null, '🛍️'],
      ['Paraguas compacto', 'Negro', 'Hogar', 25000, null, '☂️'],
      ['Gafas de sol', 'UV', 'Moda', 30000, null, '🕶️'],
      ['Gorra básica', 'Ajustable', 'Moda', 22000, null, '🧢'],
      ['Medias deportivas x3', 'Pack', 'Moda', 18000, null, '🧦'],
      ['Toalla facial', 'Algodón', 'Hogar', 12000, null, '🧺'],
      ['Juego cubiertos viaje', 'Acero', 'Hogar', 20000, null, '🍴'],
      ['Florero pequeño', 'Cerámica', 'Hogar', 28000, null, '🏺'],
      ['Ramo artificial', 'Decorativo', 'Flores', 25000, null, '💐'],
      ['Kit manicure', 'Básico', 'Belleza', 22000, null, '💅'],
      ['Cargador pared genérico', 'USB', 'Accesorios', 20000, null, '🔌'],
      ['Llavero linterna', 'LED', 'Accesorios', 10000, null, '🔑'],
      ['Caja organizadora zapatos', 'Plástico', 'Hogar', 18000, null, '👟'],
      ['Ambientador spray', 'Lavanda', 'Hogar', 12000, null, '🌸'],
    ],
  },
  licoreria: {
    category: 'licoreria',
    emoji: '🍺',
    tags: ['cerveza', 'licores', 'hielo'],
    items: [
      ['Cerveza nacional lata', 'Unidad', 'Cervezas', 4000, null, '🍺'],
      ['Sixpack cerveza nacional', '6 latas', 'Cervezas', 22000, 25000, '🍺'],
      ['Cerveza importada', 'Unidad', 'Cervezas', 7000, null, '🍺'],
      ['Aguardiente media', 'Botella', 'Licores', 45000, null, '🍾'],
      ['Ron media', 'Botella', 'Licores', 55000, null, '🍾'],
      ['Whisky media entrada', 'Botella', 'Licores', 85000, null, '🥃'],
      ['Vino tinto', 'Botella 750ml', 'Vinos', 40000, null, '🍷'],
      ['Vino blanco', 'Botella 750ml', 'Vinos', 40000, null, '🍷'],
      ['Espumante', 'Botella', 'Vinos', 48000, null, '🥂'],
      ['Gaseosa 1.5L', 'Para mezclar', 'Mixers', 7000, null, '🥤'],
      ['Agua tónica', 'Unidad', 'Mixers', 4500, null, '🥤'],
      ['Hielo bolsa 2kg', 'Bolsa', 'Hielo', 5000, null, '🧊'],
      ['Hielo bolsa 5kg', 'Bolsa', 'Hielo', 10000, null, '🧊'],
      ['Vasos desechables x25', 'Pack', 'Fiesta', 8000, null, '🥃'],
      ['Servilletas x100', 'Pack', 'Fiesta', 6000, null, '🧻'],
      ['Snacks surtidos', 'Bolsa', 'Snacks', 7000, null, '🥔'],
      ['Maní salado', 'Bolsa', 'Snacks', 5000, null, '🥜'],
      ['Combo six + hielo', 'Sixpack + 2kg hielo', 'Combos', 26000, null, '🍱'],
      ['Combo fiesta', 'Aguardiente + gaseosa + hielo', 'Combos', 58000, null, '🎉'],
      ['Cerveza artesanal local', 'Unidad', 'Cervezas', 9000, null, '🍺'],
      ['Michelada prep kit', 'Sales y limón', 'Mixers', 12000, null, '🍋'],
      ['Cooler blando', '6 latas', 'Accesorios', 45000, null, '🧊'],
      ['Destapador', 'Metálico', 'Accesorios', 8000, null, '🔧'],
      ['Jugo hit 1L', 'Para cocteles', 'Mixers', 6000, null, '🧃'],
      ['Energizante', 'Lata', 'Bebidas', 7000, null, '⚡'],
      ['Agua 1.5L', 'Botella', 'Bebidas', 3500, null, '💧'],
      ['Pack latas importadas x4', 'Selección', 'Cervezas', 28000, null, '🍺'],
      ['Promo finde sixpack', 'Solo viernes-domingo', 'Edición limitada', 20000, null, '🏷️'],
    ],
  },
};

/** 8 tipos de comercio por municipio — nombres originales por ciudad */
const BIZ_BLUEPRINTS = [
  { key: 'asados', name: (m) => `Parrilla Brasa ${m}`, desc: (m) => `Carnes a la brasa y picadas familiares en ${m}. Sabor de casa, listo para domicilio.` },
  { key: 'pizza', name: (m) => `Hornito ${m}`, desc: (m) => `Pizzas al horno, pastas y combos para compartir en ${m}.` },
  { key: 'pollo', name: (m) => `Broaster Don Pollo ${m}`, desc: (m) => `Pollo crocante, alitas y combos familiares con entrega rápida en ${m}.` },
  { key: 'burger', name: (m) => `Smash Calle ${m}`, desc: (m) => `Hamburguesas smash, papas caseras y malteadas en ${m}.` },
  { key: 'cafe', name: (m) => `Café Puerto Verde ${m}`, desc: (m) => `Café de origen, desayunos y panadería fresca en ${m}.` },
  { key: 'arepas', name: (m) => `Arepas La Costeña ${m}`, desc: (m) => `Arepas de huevo, empanadas y desayunos criollos de ${m}.` },
  { key: 'mercado', name: (m) => `Mercadito del Golfo ${m}`, desc: (m) => `Abarrotes, frescos y aseo para el día a día en ${m}.` },
  { key: 'farmacia', name: (m) => `Droguería Bienestar ${m}`, desc: (m) => `Cuidado OTC, bebé y bienestar con domicilio en ${m}.` },
];

/** Rotación extra para variedad entre municipios (índice 0-4) */
const EXTRA_BY_MUNI = [
  { key: 'helados', name: (m) => `Helados Brisa ${m}`, desc: (m) => `Helados, malteadas y postres fríos en ${m}.` },
  { key: 'tecnologia', name: (m) => `TecnoBahía ${m}`, desc: (m) => `Cargadores, audio y accesorios móviles en ${m}.` },
  { key: 'mascotas', name: (m) => `Pet Urabá ${m}`, desc: (m) => `Alimento y cuidados para perros y gatos en ${m}.` },
  { key: 'tiendas', name: (m) => `TodoHogar ${m}`, desc: (m) => `Belleza, papelería y hogar en ${m}.` },
  { key: 'licoreria', name: (m) => `Licores La Playa ${m}`, desc: (m) => `Cervezas, licores y hielo con entrega responsable en ${m}.` },
];

function buildCatalog() {
  const businesses = [];
  const products = [];
  let bizCounter = 0;

  MUNICIPIOS.forEach((muni, muniIdx) => {
    const blueprints = [...BIZ_BLUEPRINTS, EXTRA_BY_MUNI[muniIdx]];
    blueprints.forEach((bp, bizIdx) => {
      const menu = MENUS[bp.key];
      const name = bp.name(muni.name);
      const zone = muni.zones[bizIdx % muni.zones.length];
      const id = bizId(muniIdx + 1, bizIdx + 1);
      const deliveryFee = menu.category === 'farmacia' ? 4000 : menu.category === 'mercado' ? 4500 : 5000;
      const minOrder = menu.category === 'farmacia' ? 8000 : menu.category === 'comida' ? 12000 : 10000;
      const deliveryTime = menu.category === 'comida' ? 25 + (bizIdx % 3) * 5 : 20 + (bizIdx % 2) * 5;
      const rating = Number((4.4 + (bizIdx % 5) * 0.1).toFixed(1));
      const prompts = imagePrompts(`${name} storefront vibe ${menu.tags.join(' ')}`, menu.category === 'comida' ? 'food' : 'retail');

      const business = {
        id,
        name,
        slug: slugify(name),
        category: menu.category,
        description: bp.desc(muni.name),
        emoji: menu.emoji,
        tags: menu.tags,
        municipio: muni.name,
        zone,
        address: `Calle ${10 + bizIdx} # ${20 + muniIdx}-${15 + bizIdx}, ${zone}`,
        latitude: jitter(muni.lat, bizIdx + muniIdx),
        longitude: jitter(muni.lng, bizIdx * 2 + muniIdx),
        opens_at: '08:00',
        closes_at: menu.category === 'licoreria' ? '23:00' : '21:30',
        delivery_fee: deliveryFee,
        min_order: minOrder,
        delivery_time: deliveryTime,
        phone: `604${8000000 + muniIdx * 10000 + bizIdx * 11}`,
        whatsapp: `57315${String(1000000 + muniIdx * 10000 + bizIdx * 17).slice(0, 7)}`,
        instagram: `@${slugify(name).replace(/-/g, '').slice(0, 24)}`,
        facebook: null,
        website: null,
        verified: true,
        rating,
        review_count: 40 + bizIdx * 17 + muniIdx * 9,
        logo_placeholder: `emoji:${menu.emoji}`,
        cover_image_prompt: prompts.cover,
        seo: {
          slug: slugify(name),
          meta_description: `${name}: ${bp.desc(muni.name).slice(0, 140)}`,
          keywords: [muni.name, menu.category, ...menu.tags, 'domicilio', 'Urabá'],
          search_terms: [name, muni.name, ...menu.tags],
        },
        image_prompts: prompts,
      };
      businesses.push(business);
      bizCounter += 1;

      menu.items.forEach((row, pIdx) => {
        const [pName, pDesc, pCat, price, compare, emoji] = row;
        const promptsP = imagePrompts(pName, menu.category === 'comida' ? 'food' : 'pack');
        const synonyms = buildSynonyms(pName);
        products.push({
          id: productId(muniIdx + 1, bizIdx + 1, pIdx + 1),
          business_id: id,
          business_name: name,
          municipio: muni.name,
          name: pName,
          description: pDesc,
          long_description: `${pDesc}. Preparado para domicilio UrabApp en ${muni.name}. Porción generosa, empaque seguro.`,
          category: pCat,
          subcategory: menu.tags[0],
          price,
          compare_at_price: compare,
          cost: Math.round(price * 0.55),
          sku: `URA-${muni.id.slice(0, 3).toUpperCase()}-${String(bizIdx + 1).padStart(2, '0')}-${String(pIdx + 1).padStart(3, '0')}`,
          stock: 20 + (pIdx % 15),
          emoji,
          popular: pIdx < 3,
          best_seller: pIdx === 0,
          is_new: pIdx >= menu.items.length - 2,
          vegetarian: /veggie|vegetariana|ensalada|fruta|arepa de queso|pandebono/i.test(pName + pDesc),
          spicy_level: /buffalo|picante|ají/i.test(pName + pDesc) ? 2 : 0,
          preparation_time_min: menu.category === 'comida' ? 10 + (pIdx % 20) : 5,
          search_terms: synonyms,
          synonyms,
          related_hint: menu.items[(pIdx + 1) % menu.items.length][0],
          frequently_bought_with_hint: menu.items[(pIdx + 2) % menu.items.length][0],
          upsell_hint: menu.items.find((i) => i[2] === 'Combos')?.[0] || menu.items[0][0],
          image_prompts: promptsP,
          seo: {
            slug: slugify(`${pName}-${muni.id}`),
            meta_description: `${pName} a domicilio en ${muni.name}. ${pDesc}`,
            keywords: synonyms.slice(0, 8),
          },
        });
      });
    });
  });

  return { businesses, products, stats: { businesses: businesses.length, products: products.length, municipios: MUNICIPIOS.length } };
}

function buildSynonyms(name) {
  const base = [name];
  const lower = name.toLowerCase();
  if (lower.includes('papa')) base.push('papas', 'french fries', 'fries', 'papas fritas');
  if (lower.includes('hamburguesa') || lower.includes('burger')) base.push('burger', 'hamburguesa', 'sandwich de carne');
  if (lower.includes('pollo')) base.push('chicken', 'broaster', 'pollo frito');
  if (lower.includes('pizza')) base.push('pizza', 'pizzeria');
  if (lower.includes('arepa')) base.push('arepa', 'arepa de huevo', 'desayuno');
  if (lower.includes('café') || lower.includes('cafe')) base.push('cafe', 'tinto', 'coffee');
  if (lower.includes('jugo')) base.push('jugo natural', 'jugo', 'bebida');
  if (lower.includes('cerveza')) base.push('birra', 'beer', 'lata');
  base.push(...name.split(/\s+/).filter((w) => w.length > 3));
  return [...new Set(base.map((s) => s.toLowerCase()))];
}

function toSql(catalog) {
  const lines = [];
  lines.push('-- UrabApp marketplace seed v1 — 5 municipios (datos originales)');
  lines.push('-- Generado por scripts/generate-uraba-marketplace-seed.mjs');
  lines.push('-- NO contiene contenido de terceros (Rappi u otros).');
  lines.push('');
  lines.push('ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;');
  lines.push('');
  lines.push(`INSERT INTO public.businesses (
  id, name, category, description, emoji, municipio, zone, address,
  latitude, longitude, opens_at, closes_at,
  delivery_fee, min_order, delivery_time, rating, total_ratings,
  is_open, is_active, is_published, verification_status, approved_at, slug, phone
) VALUES`);

  const bizValues = catalog.businesses.map((b) => `(
  ${sqlStr(b.id)}, ${sqlStr(b.name)}, ${sqlStr(b.category)}, ${sqlStr(b.description)}, ${sqlStr(b.emoji)},
  ${sqlStr(b.municipio)}, ${sqlStr(b.zone)}, ${sqlStr(b.address)},
  ${b.latitude}, ${b.longitude}, ${sqlStr(b.opens_at)}::time, ${sqlStr(b.closes_at)}::time,
  ${b.delivery_fee}, ${b.min_order}, ${b.delivery_time}, ${b.rating}, ${b.review_count},
  true, true, true, 'approved', NOW(), ${sqlStr(b.slug)}, ${sqlStr(b.phone)}
)`);
  lines.push(`${bizValues.join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_published = true,
  verification_status = 'approved',
  is_active = true,
  approved_at = COALESCE(public.businesses.approved_at, EXCLUDED.approved_at),
  slug = EXCLUDED.slug,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  delivery_fee = EXCLUDED.delivery_fee,
  min_order = EXCLUDED.min_order,
  delivery_time = EXCLUDED.delivery_time,
  phone = COALESCE(public.businesses.phone, EXCLUDED.phone);`);

  lines.push('');
  lines.push(`INSERT INTO public.products (
  id, business_id, name, description, emoji, price, compare_at_price, category, is_available, sort_order
) VALUES`);

  const prodValues = catalog.products.map((p, idx) => `(
  ${sqlStr(p.id)}, ${sqlStr(p.business_id)}, ${sqlStr(p.name)}, ${sqlStr(p.description)}, ${sqlStr(p.emoji)},
  ${p.price}, ${p.compare_at_price == null ? 'NULL' : p.compare_at_price}, ${sqlStr(p.category)}, true, ${idx % 100}
)`);
  lines.push(`${prodValues.join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  category = EXCLUDED.category,
  emoji = EXCLUDED.emoji,
  is_available = true;`);

  lines.push('');
  lines.push('ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;');
  lines.push('');
  lines.push(`-- Stats: ${catalog.stats.businesses} negocios, ${catalog.stats.products} productos, ${catalog.stats.municipios} municipios`);
  return lines.join('\n');
}

const catalog = buildCatalog();
const outDir = join(root, 'supabase', 'seed-data');
mkdirSync(outDir, { recursive: true });

const jsonPath = join(outDir, 'uraba-marketplace-v1.json');
const sqlPath = join(root, 'supabase', 'migrations', '109_seed_uraba_5_municipios.sql');

writeFileSync(jsonPath, JSON.stringify({
  version: 1,
  generated_at: new Date().toISOString(),
  note: 'Original UrabApp catalog. Image prompts are generic marketplace style — not copied from any competitor.',
  ...catalog,
}, null, 2));

writeFileSync(sqlPath, toSql(catalog));

console.log('[seed] businesses', catalog.stats.businesses);
console.log('[seed] products', catalog.stats.products);
console.log('[seed] json', jsonPath);
console.log('[seed] sql', sqlPath);
