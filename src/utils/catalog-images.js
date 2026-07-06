/** Imágenes de catálogo — Supabase Storage > fotos reales Urabá > Unsplash */

import { URABA_BANNER_IMAGES } from './uraba-images';
import { resolveBusinessCoverUrl, BUSINESS_COVER_BY_SLUG } from './business-covers';
import {
  CATEGORY_COVERS as CATALOG_CATEGORY_COVERS,
  PRODUCT_IMAGES,
  resolveProductImageUrl,
  DEMO_PROMO_BANNERS,
} from '../data/catalog-visuals';

const CATEGORY_COVERS = {
  ...CATALOG_CATEGORY_COVERS,
  default: CATALOG_CATEGORY_COVERS.comida,
};

export function resolveBusinessCover(business) {
  if (!business) return CATEGORY_COVERS.default;
  return business.cover_url || business.logo_url || resolveBusinessCoverUrl(business);
}

export function resolveBusinessLogo(business) {
  return business?.logo_url || business?.cover_url || null;
}

export function resolveProductImage(product, businessCategory, businessSlug) {
  if (!product) return PRODUCT_IMAGES.food;
  return resolveProductImageUrl(product, businessCategory, businessSlug);
}

export function resolveBannerImage(banner, index = 0) {
  const slug = banner?.link?.replace(/^\/tienda\//, '').split('?')[0];
  if (slug && BUSINESS_COVER_BY_SLUG[slug]) return BUSINESS_COVER_BY_SLUG[slug];
  if (banner?.image_url && !banner.image_url.includes('images.unsplash.com')) {
    return banner.image_url;
  }
  const promos = DEMO_PROMO_BANNERS;
  const promo = promos[index % promos.length];
  return promo?.image_url || URABA_BANNER_IMAGES[index % URABA_BANNER_IMAGES.length];
}

export function getBannerImages() {
  return DEMO_PROMO_BANNERS.map((b) => b.image_url);
}

export { CATEGORY_COVERS, PRODUCT_IMAGES };
