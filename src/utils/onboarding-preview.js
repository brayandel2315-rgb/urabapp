/** Vitrinas de onboarding comercial (previews para reuniones de venta). */

export const ONBOARDING_PREVIEW_DISCLAIMER =
  'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.';

export const ONBOARDING_PREVIEW_DISCLAIMER_SHORT =
  'Preview UrabApp · Onboarding comercial. Activos de marca de sus titulares.';

/** Slugs conocidos de vitrinas preview (índice de ventas). */
export const ONBOARDING_PREVIEW_STORES = [
  {
    slug: 'preview-exito-plaza-del-rio',
    name: 'Éxito Plaza del Río',
    municipio: 'Apartadó',
    category: 'mercado',
    brand: 'Éxito',
  },
  {
    slug: 'preview-exito-carepa',
    name: 'Éxito Carepa',
    municipio: 'Carepa',
    category: 'mercado',
    brand: 'Éxito',
  },
  {
    slug: 'preview-olimpica-cc-nuestro',
    name: 'Olímpica CC Nuestro',
    municipio: 'Apartadó',
    category: 'mercado',
    brand: 'Olímpica',
  },
  {
    slug: 'preview-tiendas-d1-apartado',
    name: 'Tiendas D1 Apartadó',
    municipio: 'Apartadó',
    category: 'mercado',
    brand: 'D1',
  },
  {
    slug: 'preview-cruz-verde-plaza-del-rio',
    name: 'Cruz Verde Plaza del Río',
    municipio: 'Apartadó',
    category: 'farmacia',
    brand: 'Cruz Verde',
  },
  {
    slug: 'preview-cruz-verde-nuevo-apartado',
    name: 'Cruz Verde Nuevo Apartadó',
    municipio: 'Apartadó',
    category: 'farmacia',
    brand: 'Cruz Verde',
  },
  {
    slug: 'preview-cruz-verde-turbo',
    name: 'Cruz Verde Turbo',
    municipio: 'Turbo',
    category: 'farmacia',
    brand: 'Cruz Verde',
  },
  {
    slug: 'preview-cruz-verde-chigorodo',
    name: 'Cruz Verde Chigorodó',
    municipio: 'Chigorodó',
    category: 'farmacia',
    brand: 'Cruz Verde',
  },
  {
    slug: 'preview-cruz-verde-carepa',
    name: 'Cruz Verde Carepa',
    municipio: 'Carepa',
    category: 'farmacia',
    brand: 'Cruz Verde',
  },
  {
    slug: 'preview-supermercado-los-ibanez',
    name: 'Supermercado Los Ibañez',
    municipio: 'Apartadó',
    category: 'mercado',
    brand: 'Los Ibañez',
  },
  {
    slug: 'preview-asadero-riko-pollo',
    name: 'Asadero Riko Pollo',
    municipio: 'Apartadó',
    category: 'comida',
    brand: 'Riko Pollo',
  },
  {
    slug: 'preview-juan-valdez-plaza-del-rio',
    name: 'Juan Valdez Plaza del Río',
    municipio: 'Apartadó',
    category: 'comida',
    brand: 'Juan Valdez',
  },
];

export function isOnboardingPreview(business) {
  if (!business) return false;
  if (business.is_onboarding_preview === true) return true;
  const slug = String(business.slug || '');
  if (slug.startsWith('preview-')) return true;
  const name = String(business.name || '');
  return /preview urabapp/i.test(name);
}

/** Historia corta: quita el bloque de disclaimer legal del description. */
export function getPreviewStory(business) {
  if (!business) return '';
  const raw = String(business.description || business.story || '').trim();
  if (!raw) return '';
  const parts = raw
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !/preview creado por urabapp/i.test(p));
  return parts.join(' ').trim() || raw.replace(ONBOARDING_PREVIEW_DISCLAIMER, '').trim();
}

export function getPreviewMerchantLevel(business) {
  return business?.merchant_level || 'Preview Gold';
}
