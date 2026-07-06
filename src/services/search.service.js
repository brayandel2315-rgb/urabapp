import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SEED_BUSINESSES } from '../data/seed';
import { getBusinesses } from './business.service';
import { buildCatalogContext } from '../utils/catalog-location';
import { assertNoError } from '../utils/service-error';

export async function searchProducts({ q, municipio, catalog, getBusinessesParams, limit = 12 } = {}) {
  const term = q?.trim();
  if (!term) return [];

  const ctx = catalog || buildCatalogContext({ homeMunicipio: municipio, detectedMunicipio: municipio });
  if (ctx.mode === 'away_blocked') return [];

  const bizParams = getBusinessesParams || { catalog: ctx, municipio: ctx.viewMunicipio };
  const businesses = await getBusinesses({ ...bizParams, search: term });
  const bizIds = businesses.slice(0, limit).map((b) => b.id);
  if (!bizIds.length) return [];

  if (!isSupabaseConfigured) {
    return [];
  }

  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, emoji, business_id, businesses!inner(id, name, slug, municipio, emoji, is_active)')
    .eq('is_available', true)
    .eq('businesses.is_active', true)
    .in('business_id', bizIds)
    .ilike('name', `%${term}%`)
    .limit(limit);

  assertNoError(error);
  return (data ?? []).map((p) => ({
    type: 'product',
    id: p.id,
    name: p.name,
    price: p.price,
    emoji: p.emoji,
    businessId: p.business_id,
    businessName: p.businesses?.name,
    businessSlug: p.businesses?.slug,
    municipio: p.businesses?.municipio,
    to: `/tienda/${p.businesses?.slug || p.business_id}`,
  }));
}

export async function globalSearch({
  q,
  municipio,
  catalog,
  getBusinessesParams,
  limit = 10,
} = {}) {
  const term = q?.trim();
  if (!term || term.length < 2) {
    return { businesses: [], products: [] };
  }

  const ctx = catalog || buildCatalogContext({ homeMunicipio: municipio, detectedMunicipio: municipio });
  if (ctx.mode === 'away_blocked') {
    return { businesses: [], products: [] };
  }

  const bizParams = getBusinessesParams || { catalog: ctx, municipio: ctx.viewMunicipio };

  const [businessRows, products] = await Promise.all([
    getBusinesses({ ...bizParams, search: term }),
    searchProducts({ q: term, catalog: ctx, getBusinessesParams: bizParams, limit }),
  ]);

  const businesses = (businessRows ?? []).slice(0, limit).map((b) => ({
    type: 'business',
    id: b.id,
    name: b.name,
    emoji: b.emoji,
    municipio: b.municipio,
    to: `/tienda/${b.slug || b.id}`,
  }));

  if (!isSupabaseConfigured && businesses.length === 0) {
    const local = SEED_BUSINESSES.filter(
      (b) => b.name.toLowerCase().includes(term.toLowerCase())
        && (!ctx.viewMunicipio || b.municipio === ctx.viewMunicipio),
    ).slice(0, limit);
    return {
      businesses: local.map((b) => ({
        type: 'business',
        id: b.id,
        name: b.name,
        emoji: b.emoji,
        municipio: b.municipio,
        to: `/tienda/${b.slug || b.id}`,
      })),
      products: [],
    };
  }

  return { businesses, products };
}
