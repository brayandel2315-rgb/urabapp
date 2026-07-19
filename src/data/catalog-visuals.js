/**
 * Catálogo visual demo — fotos Unsplash curadas por comercio real.
 * Para presentación a clientes (alta resolución, crop optimizado).
 */

import { resolveCuisineId } from './cuisine-taxonomy';

export const U = (id, w = 800, h = 560) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=90&auto=format`;

export const UP = (id) => U(id, 400, 400);

/** Fotos reales del Urabá (Wikimedia Commons, CC) */
export const URABA_REGIONAL = {
  bananeras: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Apartad%C3%B3_bananeras.jpg/1280px-Apartad%C3%B3_bananeras.jpg',
  playaTurbo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Amanecer_Playa_Simona-Turbo_Antioquia.jpg/1280px-Amanecer_Playa_Simona-Turbo_Antioquia.jpg',
  golfoUraba: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Golfo_de_Urab%C3%A1_y_delta_del_Atrato.JPG/1280px-Golfo_de_Urab%C3%A1_y_delta_del_Atrato.JPG',
  bananoCultivo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Colbanana09.jpg/1280px-Colbanana09.jpg',
  camaraComercio: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Camara_de_Comercio_de_Urab%C3%A1.jpg/1280px-Camara_de_Comercio_de_Urab%C3%A1.jpg',
  arepa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Arepa_con_queso.jpg/800px-Arepa_con_queso.jpg',
  mercado: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Supermarket_vegetables.jpg/800px-Supermarket_vegetables.jpg',
  farmacia: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Pharmacy%2C_Mysore.jpg/800px-Pharmacy%2C_Mysore.jpg',
  licores: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Wine_rack_with_empty_bottles.jpg/800px-Wine_rack_with_empty_bottles.jpg',
  tienda: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Camara_de_Comercio_de_Urab%C3%A1.jpg/800px-Camara_de_Comercio_de_Urab%C3%A1.jpg',
  mascotas: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/800px-Cat_November_2010-1a.jpg',
  tecnologia: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Smartphone_icon.svg/800px-Smartphone_icon.svg.png',
};

/** Portada por slug — 50 comercios */
export const BUSINESS_COVERS = {
  // Apartadó — comida
  'restaurante-el-bananero': URABA_REGIONAL.bananeras,
  'arepas-do-a-rosa-b0000001': URABA_REGIONAL.arepa,
  'asados-el-prado-b0000001': U('photo-1555939594-58d7cb561ad1'),
  'burger-urban-c0000002': U('photo-1568901340865-4c42c4bd3921'),
  'caf-la-parada-b0000001': U('photo-1495474473867-e4fbf7ef9f2d'),
  'cafeter-a-express-c0000002': U('photo-1509042236130-df4c186b52e3'),
  'cevicher-a-el-mar-b0000001': U('photo-1565680018434-b75d4c4d0474'),
  'chuzos-y-pinchos-c0000002': U('photo-1529042410751-b472fad9b0b5'),
  'empanadas-el-rinc-n-c0000002': U('photo-1626700051175-6814f7d4b03b'),
  'helader-a-polar-b0000001': U('photo-1563805044264-3e1b5491a7b5'),
  'jugos-naturales-c0000002': U('photo-1622597467836-fbc3f3586384'),
  'mecato-la-esquina': U('photo-1573080496219-bb080dd4f877'),
  'pasteler-a-dulce-hogar-c0000002': U('photo-1578985545062-69928b1d9587'),
  'pizza-roma-b0000001': U('photo-1513104890138-7c749659a591'),
  'poller-a-el-corral-b0000001': U('photo-1626082927389-6c245bec07ff'),
  'poller-a-la-brasa-c0000002': U('photo-15981002010439-334710cb3e71'),
  'restaurante-veggie-c0000002': U('photo-1512621776951-a57141f2eefd'),
  'sushi-wok-b0000001': U('photo-1579584425555-c3ce17fd4351'),
  'tacos-m-xico-c0000002': U('photo-1565299585323-3814c0c0b44c'),
  // Apartadó — otros
  'farmacia-san-rafael': U('photo-1584308666744-24d5c474f2ae'),
  'farmacia-del-pueblo-c0000002': U('photo-1587854692152-cf660b4c8ea2'),
  'droguer-a-el-ahorro-b0000001': U('photo-1576602975982-48f9fb0b5315'),
  'droguer-a-salud-total-c0000002': U('photo-1587854692152-cf660b4c8ea2'),
  'licores-centro-b0000001': U('photo-1608270586620-248524c67de9'),
  'supermercado-el-ahorro': U('photo-1604719312566-8912e9227c6a'),
  'panader-a-san-jos--b0000001': U('photo-1509440159596-0249088772ff'),
  'frutas-el-campo-b0000001': U('photo-1610831308542-7b1b7bdfc4fd'),
  'verduras-la-huerta-c0000002': U('photo-1540420770143-907678b7e0c6'),
  'carnes-fr-as-don-luis-c0000002': U('photo-1607623814075-4477acb3c0fc'),
  'pescader-a-el-golfo-c0000002': U('photo-1544947950-f07eade5f4cc'),
  'tienda-don-pedro-b0000001': U('photo-1578662996442-48f601eca8e3'),
  'mini-market-24h-c0000002': U('photo-1578911373274-32fc53d2a369'),
  'mascotas-felices-b0000001': U('photo-1450778869180-41d0601e046e'),
  'mensajer-a-r-pida-urab--c0000002': U('photo-1526367790999-0150786686a2'),
  'urabapp-env-os-c0000002': U('photo-1586528116311-ad8dd3c8310d'),
  'tecnourab--b0000001': U('photo-1468495240123-6ed6d9600500'),
  'ferreter-a-el-martillo-c0000002': U('photo-1504148455328-c376907a0e0c'),
  'librer-a-urab--c0000002': U('photo-1481627834876-b7833e8f5570'),
  '-ptica-visi-n-c0000002': U('photo-1574258495973-f010dfbbce28'),
  'papeler-a-estudiantil-b0000001': U('photo-1456513080510-7bf3a84b82f8'),
  'ropa-sport-urab--c0000002': U('photo-1441986300917-64674bd600d8'),
  'zapater-a-camina-c0000002': U('photo-1542291026-7eec264c27ff'),
  // Otros municipios
  'restaurante-carepa-c0000002': U('photo-1555396273-367ea4eb4db5'),
  'tienda-carepa-c0000002': U('photo-1578911373274-32fc53d2a369'),
  'comida-chigorod--c0000002': URABA_REGIONAL.bananoCultivo,
  'mercado-chigorod--c0000002': U('photo-1604719312566-8912e9227c6a'),
  'necocl-express-c0000002': URABA_REGIONAL.golfoUraba,
  'comida-r-pida-turbo-c0000002': URABA_REGIONAL.playaTurbo,
  'farmacia-turbo-c0000002': U('photo-1584308666744-24d5c474f2ae'),
  'mercado-turbo-centro-c0000002': U('photo-1578662996442-48f601eca8e3'),
  // Slugs producción (migración 072)
  'asados-el-prado': U('photo-1555939594-58d7cb561ad1'),
  'pizza-roma': U('photo-1513104890138-7c749659a591'),
  'cafe-la-parada': U('photo-1495474473867-e4fbf7ef9f2d'),
  'polleria-el-corral': U('photo-1626082927389-6c245bec07ff'),
  'sushi-wok': U('photo-1579584425555-c3ce17fd4351'),
  'heladeria-polar': U('photo-1563805044264-3e1b5491a7b5'),
  'drogueria-el-ahorro': U('photo-1576602975982-48f9fb0b5315'),
  'tienda-don-pedro': U('photo-1578911373274-32fc53d2a369'),
  'panaderia-san-jose': U('photo-1509440159596-0249088772ff'),
  'frutas-el-campo': U('photo-1610831308542-7b1b7bdfc4fd'),
  'papeleria-estudiantil': U('photo-1456513080510-7bf3a84b82f8'),
  'tecnouraba': U('photo-1511707171634-5f897ff02aa9'),
  'mascotas-felices': U('photo-1450778869180-41d0601e046e'),
  'licores-centro': U('photo-1510812431401-41d2bd2722f3'),
  'arepas-dona-rosa': URABA_REGIONAL.arepa,
  'cevicheria-el-mar': U('photo-1565680018434-b75d4c4d0474'),
  'burger-urban': U('photo-1568901340865-4c42c4bd3921'),
  'empanadas-el-rincon': U('photo-1626700051175-6814f7d4b03b'),
  'tacos-mexico': U('photo-1565299585323-3814c0c0b44c'),
  'jugos-naturales': U('photo-1622597467836-fbc3f3586384'),
  'drogueria-salud-total': U('photo-1587854692152-cf660b4c8ea2'),
  'farmacia-del-pueblo': U('photo-1584308666744-24d5c474f2ae'),
};

export const CATEGORY_COVERS = {
  comida: U('photo-1414235077428-338989a2e8c0'),
  farmacia: U('photo-1584308666744-24d5c474f2ae'),
  mercado: U('photo-1542838132-92c53300491e'),
  licoreria: U('photo-1510812431401-41d2bd2722f3'),
  tiendas: U('photo-1604719312566-8912e9227c6a'),
  mandados: U('photo-1526367790999-0150786686a2'),
  envios: U('photo-1586528116311-ad8dd3c8310d'),
  mascotas: U('photo-1450778869180-41d0601e046e'),
  tecnologia: U('photo-1511707171634-5f897ff02aa9'),
};

/** Portadas por tipo de cocina — catálogo vivo (comida) */
export const CUISINE_COVERS = {
  tipica: U('photo-1546069901-ba9599a7e63c'),
  arepas: URABA_REGIONAL.arepa,
  pollo: U('photo-1626082927389-6c245bec07ff'),
  hamburguesas: U('photo-1568901340865-4c42c4bd3921'),
  pizza: U('photo-1513104890138-7c749659a591'),
  asados: U('photo-1555939594-58d7cb561ad1'),
  mariscos: U('photo-1565680018434-b75d4c4d0474'),
  rapida: U('photo-1573080496219-bb080dd4f877'),
  cafe: U('photo-1495474473867-e4fbf7ef9f2d'),
  postres: U('photo-1563805044264-3e1b5491a7b5'),
  jugos: U('photo-1622597467836-fbc3f3586384'),
  otros: U('photo-1414235077428-338989a2e8c0'),
};

/** Imágenes de producto por emoji / palabra clave */
export const PRODUCT_IMAGES = {
  soup: UP('photo-1547592166-23ac45744acd'),
  banana: UP('photo-1603833665858-e61d17a86224'),
  shrimp: UP('photo-1565680018434-b75d4c4d0474'),
  juice: UP('photo-1622597467836-fbc3f3586384'),
  hotdog: UP('photo-1612392062798-2d1c8d3ad3f5'),
  fries: UP('photo-1573080496219-bb080dd4f877'),
  soda: UP('photo-1622483767028-3f66f32aef97'),
  pharmacy: UP('photo-1584308666744-24d5c474f2ae'),
  lotion: UP('photo-1556228720-195a672e8a03'),
  rice: UP('photo-1586201375761-83865001e31c'),
  egg: UP('photo-1582722878405-44d4faab0ccb'),
  beer: UP('photo-1608270586620-248524c67de9'),
  food: UP('photo-1546069901-ba9599a7e63c'),
  package: UP('photo-1607083206968-13611e3d76db'),
  pizza: UP('photo-1513104890138-7c749659a591'),
  chicken: UP('photo-1626082927389-6c245bec07ff'),
  coffee: UP('photo-1495474473867-e4fbf7ef9f2d'),
  arepa: UP('photo-1590301157894-861180ed07b7'),
  meat: UP('photo-1555939594-58d7cb561ad1'),
  burger: UP('photo-1568901340865-4c42c4bd3921'),
  sushi: UP('photo-1579584425555-c3ce17fd4351'),
  taco: UP('photo-1565299585323-3814c0c0b44c'),
  icecream: UP('photo-1563805044264-3e1b5491a7b5'),
  cake: UP('photo-1578985545062-69928b1d9587'),
  salad: UP('photo-1512621776951-a57141f2eefd'),
  fish: UP('photo-1544947950-f07eade5f4cc'),
  fruit: UP('photo-1610831308542-7b1b7bdfc4fd'),
  grocery: UP('photo-1604719312566-8912e9227c6a'),
  pet: UP('photo-1450778869180-41d0601e046e'),
  phone: UP('photo-1468495240123-6ed6d9600500'),
  empanada: UP('photo-1626700051175-6814f7d4b03b'),
  bread: UP('photo-1509440159596-0249088772ff'),
  stationery: UP('photo-1456513080510-7bf3a84b82f8'),
  helado: UP('photo-1497034824048-ba4db4de4c83'),
  combo: UP('photo-1546069901-ba9599a7e63c'),
  papaya: UP('photo-1622597467836-fbc3f3586384'),
  drogueria: UP('photo-1576602975982-48f9fb0b5315'),
  miniMarket: UP('photo-1578911373274-32fc53d2a369'),
  chuzo: UP('photo-1529042410751-b472fad9b0b5'),
  verdura: UP('photo-1540420770143-907678b7e0c6'),
};

const EMOJI_PRODUCT_MAP = {
  '🍲': 'soup',
  '🍌': 'banana',
  '🦐': 'shrimp',
  '🥤': 'juice',
  '🌭': 'hotdog',
  '🍟': 'fries',
  '💊': 'pharmacy',
  '🛒': 'grocery',
  '🍽️': 'food',
  '🍺': 'beer',
  '🐾': 'pet',
  '🍕': 'pizza',
  '🍗': 'chicken',
  '☕': 'coffee',
  '🫓': 'arepa',
  '🥩': 'meat',
  '🍚': 'rice',
  '🥚': 'egg',
  '📱': 'phone',
  '🍦': 'helado',
  '🍣': 'sushi',
  '🍔': 'burger',
  '🥟': 'empanada',
  '🌮': 'taco',
  '🥖': 'bread',
  '📚': 'stationery',
  '🏪': 'miniMarket',
};

export function resolveProductImageUrl(product, businessCategory, businessSlug) {
  if (product?.image_url) return product.image_url;

  const emoji = product?.emoji || '';
  const name = (product?.name || '').toLowerCase();

  if (EMOJI_PRODUCT_MAP[emoji]) {
    return PRODUCT_IMAGES[EMOJI_PRODUCT_MAP[emoji]];
  }

  if (name.includes('sancocho') || name.includes('sopa')) return PRODUCT_IMAGES.soup;
  if (name.includes('patac')) return PRODUCT_IMAGES.banana;
  if (name.includes('arepa')) return PRODUCT_IMAGES.arepa;
  if (name.includes('pizza')) return PRODUCT_IMAGES.pizza;
  if (name.includes('pollo') || name.includes('broaster')) return PRODUCT_IMAGES.chicken;
  if (name.includes('ceviche') || name.includes('pescado')) return PRODUCT_IMAGES.shrimp;
  if (name.includes('jugo') || name.includes('batido')) return PRODUCT_IMAGES.juice;
  if (name.includes('café') || name.includes('cafe')) return PRODUCT_IMAGES.coffee;
  if (name.includes('hamburg') || name.includes('burger')) return PRODUCT_IMAGES.burger;
  if (name.includes('empanada')) return PRODUCT_IMAGES.empanada;
  if (name.includes('taco') || name.includes('burrito')) return PRODUCT_IMAGES.taco;
  if (name.includes('sushi') || name.includes('wok') || name.includes('roll')) return PRODUCT_IMAGES.sushi;
  if (name.includes('helado') || name.includes('sundae') || name.includes('malteada')) return PRODUCT_IMAGES.helado;
  if (name.includes('postre') || name.includes('torta') || name.includes('pastel')) return PRODUCT_IMAGES.cake;
  if (name.includes('pandebono') || name.includes('pan ') || name.includes('panader')) return PRODUCT_IMAGES.bread;
  if (name.includes('picada') || name.includes('chuzo') || name.includes('pincho')) return PRODUCT_IMAGES.meat;
  if (name.includes('broaster') || name.includes('combo')) return PRODUCT_IMAGES.combo;
  if (name.includes('papeler') || name.includes('útiles') || name.includes('utiles') || name.includes('copias')) return PRODUCT_IMAGES.stationery;
  if (name.includes('droguer') || name.includes('vitamina') || name.includes('jarabe')) return PRODUCT_IMAGES.drogueria;
  if (name.includes('verdura') || name.includes('lechuga') || name.includes('tomate')) return PRODUCT_IMAGES.verdura;
  if (name.includes('mango') || name.includes('lulo') || name.includes('maracuy')) return PRODUCT_IMAGES.papaya;
  if (name.includes('cerveza') || name.includes('sixpack') || name.includes('licor')) return PRODUCT_IMAGES.beer;
  if (name.includes('perro') || name.includes('salchi')) return PRODUCT_IMAGES.fries;
  if (name.includes('arroz')) return PRODUCT_IMAGES.rice;
  if (name.includes('huevo')) return PRODUCT_IMAGES.egg;
  if (name.includes('acetamin') || name.includes('medic')) return PRODUCT_IMAGES.pharmacy;
  if (name.includes('canasta') || name.includes('abarrote')) return PRODUCT_IMAGES.grocery;
  if (name.includes('fruta') || name.includes('verdura')) return PRODUCT_IMAGES.fruit;
  if (name.includes('mascota') || name.includes('alimento')) return PRODUCT_IMAGES.pet;
  if (name.includes('cable') || name.includes('usb')) return PRODUCT_IMAGES.phone;

  if (businessSlug && BUSINESS_COVERS[businessSlug]) {
    return BUSINESS_COVERS[businessSlug].replace('w=800', 'w=400').replace('h=560', 'h=400');
  }

  const cat = businessCategory || 'comida';
  const cover = CATEGORY_COVERS[cat] || CATEGORY_COVERS.comida;
  return cover.replace('w=800', 'w=400').replace('h=560', 'h=400');
}

/** Clave visual para acentos/colores: cocina (comida) o categoría de negocio. */
export function resolveBusinessVisualKey(business) {
  if (!business) return 'comida';
  const cat = String(business.category || '').toLowerCase();
  if (cat === 'comida' || cat === 'restaurantes' || !cat) {
    return resolveCuisineId(business) || 'otros';
  }
  return cat || 'tiendas';
}

export function resolveBusinessCoverFromCatalog(business) {
  if (!business) return CATEGORY_COVERS.comida;
  if (business.cover_url) return business.cover_url;
  if (business.slug && BUSINESS_COVERS[business.slug]) return BUSINESS_COVERS[business.slug];

  const visualKey = resolveBusinessVisualKey(business);
  if (CUISINE_COVERS[visualKey]) return CUISINE_COVERS[visualKey];

  const cat = String(business.category || '').toLowerCase();
  return CATEGORY_COVERS[cat] || CATEGORY_COVERS.comida;
}

/** Fallback de banners promo (sin import circular) */
export const DEMO_PROMO_BANNERS = [
  {
    id: 'demo-bananero',
    title: 'Restaurante El Bananero',
    image_url: URABA_REGIONAL.bananeras,
    accent: 'food',
  },
  {
    id: 'demo-arepas',
    title: 'Arepas Doña Rosa',
    image_url: BUSINESS_COVERS['arepas-do-a-rosa-b0000001'],
    accent: 'food',
  },
  {
    id: 'demo-farmacia',
    title: 'Farmacia San Rafael',
    image_url: BUSINESS_COVERS['farmacia-san-rafael'],
    accent: 'market',
  },
  {
    id: 'demo-jugos',
    title: 'Jugos Naturales',
    image_url: BUSINESS_COVERS['jugos-naturales-c0000002'],
    accent: 'food',
  },
  {
    id: 'demo-panaderia',
    title: 'Panadería San José',
    image_url: BUSINESS_COVERS['panader-a-san-jos--b0000001'],
    accent: 'commerce',
  },
];
