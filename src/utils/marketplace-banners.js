/**
 * Banners del carrusel en /explorar — comercios reales de Apartadó + comida urabaña.
 */

import { BUSINESS_COVERS } from '../data/catalog-visuals';
import { resolveBusinessCoverUrl, BUSINESS_COVER_BY_SLUG } from './business-covers';

function coverForSlug(slug) {
  return BUSINESS_COVERS[slug] || null;
}

const CATEGORY_BANNER_META = {
  comida: { accent: 'food', badge: 'Comida' },
  farmacia: { accent: 'market', badge: 'Farmacia' },
  mercado: { accent: 'market', badge: 'Mercado' },
  licoreria: { accent: 'commerce', badge: 'Licores' },
  tiendas: { accent: 'commerce', badge: 'Tienda' },
  mandados: { accent: 'delivery', badge: 'Mandado' },
};

const GENERIC_BANNER_TITLE = /validaci[oó]n|conexi[oó]n local|fase\s*\d/i;

/** Comercios destacados de Apartadó — fallback con tiendas reales del catálogo */
export const APARTADO_FEATURED_BANNERS = [
  {
    id: 'feat-bananero',
    title: 'Restaurante El Bananero',
    subtitle: 'Sancocho, patacón y comida típica urabaense — pide ya en Apartadó',
    link: '/tienda/restaurante-el-bananero',
    image_url: coverForSlug('restaurante-el-bananero'),
    emoji: 'food',
    accent: 'food',
    badge: '⭐ 4.8',
  },
  {
    id: 'feat-arepas',
    title: 'Arepas Doña Rosa',
    subtitle: 'Arepas recién hechas en el barrio — domicilio desde $5.000',
    link: '/tienda/arepas-do-a-rosa-b0000001',
    image_url: coverForSlug('arepas-do-a-rosa-b0000001'),
    emoji: 'food',
    accent: 'food',
    badge: 'Comida',
  },
  {
    id: 'feat-farmacia',
    title: 'Cruz Verde Plaza del Río',
    subtitle: 'Medicamentos y cuidado personal — te lo llevamos a la puerta',
    link: '/tienda/preview-cruz-verde-plaza-del-rio',
    image_url: coverForSlug('preview-cruz-verde-plaza-del-rio') || coverForSlug('farmacia-san-rafael'),
    emoji: 'pharmacy',
    accent: 'market',
    badge: 'Farmacia',
  },
  {
    id: 'feat-jugos',
    title: 'Jugos Naturales',
    subtitle: 'Jugos de mango, lulo y frutas de la región — frescos y naturales',
    link: '/tienda/jugos-naturales-c0000002',
    image_url: coverForSlug('jugos-naturales-c0000002'),
    emoji: 'juice',
    accent: 'food',
    badge: 'Bebidas',
  },
  {
    id: 'feat-panaderia',
    title: 'Panadería San José',
    subtitle: 'Pan fresco y mecato del barrio — sin hacer fila',
    link: '/tienda/panader-a-san-jos--b0000001',
    image_url: coverForSlug('panader-a-san-jos--b0000001'),
    emoji: 'bakery',
    accent: 'commerce',
    badge: 'Mercado',
  },
  {
    id: 'feat-pizza',
    title: 'Pizza Roma',
    subtitle: 'Pizzas al horno y pastas — el sabor italiano en Apartadó',
    link: '/tienda/pizza-roma-b0000001',
    image_url: coverForSlug('pizza-roma-b0000001'),
    emoji: 'pizza',
    accent: 'food',
    badge: '⭐ 4.7',
  },
  {
    id: 'feat-mecato',
    title: 'Mecato La Esquina',
    subtitle: 'Salchipapas, perros calientes y antojos — rápido y rico',
    link: '/tienda/mecato-la-esquina',
    image_url: coverForSlug('mecato-la-esquina'),
    emoji: 'fries',
    accent: 'food',
    badge: 'Rápida',
  },
  {
    id: 'feat-ceviche',
    title: 'Cevichería El Mar',
    subtitle: 'Ceviches frescos y cocteles de mar — sabor costeño',
    link: '/tienda/cevicher-a-el-mar-b0000001',
    image_url: coverForSlug('cevicher-a-el-mar-b0000001'),
    emoji: 'shrimp',
    accent: 'food',
    badge: 'Mariscos',
  },
  {
    id: 'feat-super',
    title: 'Supermercado El Ahorro',
    subtitle: 'Tu mercado del barrio a domicilio — arroz, huevos y más',
    link: '/tienda/supermercado-el-ahorro',
    image_url: coverForSlug('supermercado-el-ahorro'),
    emoji: 'grocery',
    accent: 'market',
    badge: 'Mercado',
  },
  {
    id: 'feat-asados',
    title: 'Asados El Prado',
    subtitle: 'Carnes a la parrilla y picadas familiares — para compartir',
    link: '/tienda/asados-el-prado-b0000001',
    image_url: coverForSlug('asados-el-prado-b0000001'),
    emoji: 'meat',
    accent: 'food',
    badge: 'Parrilla',
  },
];

export const MARKETPLACE_PROMO_BANNERS = APARTADO_FEATURED_BANNERS;

/**
 * Genera banners dinámicos desde comercios activos del municipio.
 */
export function buildBusinessPromoBanners(businesses = [], { limit = 6 } = {}) {
  const priority = ['comida', 'mercado', 'farmacia', 'licoreria', 'tiendas', 'mandados'];
  const sorted = [...businesses].sort((a, b) => {
    const catA = priority.indexOf(a.category);
    const catB = priority.indexOf(b.category);
    const scoreA = catA === -1 ? 99 : catA;
    const scoreB = catB === -1 ? 99 : catB;
    if (scoreA !== scoreB) return scoreA - scoreB;
    return (Number(b.rating) || 0) - (Number(a.rating) || 0);
  });

  return sorted.slice(0, limit).map((b) => {
    const meta = CATEGORY_BANNER_META[b.category] || CATEGORY_BANNER_META.comida;
    const rating = Number(b.rating || 0).toFixed(1);
    return {
      id: `biz-${b.id}`,
      title: b.name,
      subtitle: b.description?.trim() || `Pide en ${b.name} — entrega local en ${b.municipio || 'Urabá'}`,
      link: `/tienda/${b.slug || b.id}`,
      image_url: resolveBusinessCoverUrl(b),
      objectPosition: 'center center',
      accent: meta.accent,
      badge: rating > 0 ? `⭐ ${rating}` : meta.badge,
    };
  });
}

function isGenericDbBanner(banner) {
  if (!banner?.title) return true;
  return GENERIC_BANNER_TITLE.test(banner.title) && !banner.image_url;
}

function findTemplateForBanner(banner, templates) {
  if (!banner?.link) return null;
  return templates.find((t) => t.link === banner.link) ?? null;
}

export function enrichMarketplaceBanners(dbBanners, businessBanners = []) {
  const templates =
    businessBanners.length > 0 ? businessBanners : APARTADO_FEATURED_BANNERS;

  const activeDb = (dbBanners ?? []).filter((b) => b.is_active !== false);
  const allGeneric =
    activeDb.length > 0 && activeDb.every((b) => isGenericDbBanner(b));

  if (!activeDb.length || allGeneric) {
    return templates;
  }

  const merged = activeDb.map((banner, index) => {
    const template =
      findTemplateForBanner(banner, templates) || templates[index % templates.length];
    const generic = isGenericDbBanner(banner);
    const slug = banner.link?.replace(/^\/tienda\//, '');
    const slugCover = slug ? BUSINESS_COVER_BY_SLUG[slug] : null;

    return {
      id: banner.id || template.id,
      title: generic ? template.title : (banner.title?.trim() || template.title),
      subtitle: generic
        ? template.subtitle
        : banner.subtitle?.trim() || template.subtitle,
      link: generic ? template.link : banner.link || template.link,
      image_url:
        banner.image_url || slugCover || template.image_url,
      objectPosition: template.objectPosition || 'center center',
      accent: template.accent,
      badge: template.badge,
      color: banner.color || 'primary',
    };
  });

  if (merged.length < templates.length) {
    return [...merged, ...templates.slice(merged.length)];
  }

  return merged;
}
