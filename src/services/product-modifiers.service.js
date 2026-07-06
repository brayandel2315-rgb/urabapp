import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { inferModifierGroupsFromProduct } from '@/utils/product-modifiers';

function mapGroups(rows, modifiers) {
  return rows.map((group) => ({
    ...group,
    modifiers: modifiers
      .filter((m) => m.group_id === group.id)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
  })).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

async function fetchGroupsFromDb({ productId, businessId }) {
  if (!isSupabaseConfigured || !businessId) return [];

  try {
    const { data: groups, error } = await supabase
      .from('product_modifier_groups')
      .select('*')
      .eq('business_id', businessId)
      .or(productId ? `product_id.eq.${productId},product_id.is.null` : 'product_id.is.null')
      .order('sort_order', { ascending: true });

    if (error || !groups?.length) return [];

    const groupIds = groups.map((g) => g.id);
    const { data: modifiers, error: modError } = await supabase
      .from('product_modifiers')
      .select('*')
      .in('group_id', groupIds)
      .eq('is_available', true)
      .order('sort_order', { ascending: true });

    if (modError) return [];
    return mapGroups(groups, modifiers || []);
  } catch {
    return [];
  }
}

/**
 * Resuelve complementos: primero los del comercio en BD, luego inferencia por nombre/descripción.
 */
export async function resolveProductModifierGroups(product, business) {
  if (!product?.id) return [];

  const businessId = business?.id;
  const dbGroups = await fetchGroupsFromDb({ productId: product.id, businessId });

  const productSpecific = dbGroups.filter((g) => g.product_id === product.id);
  if (productSpecific.length) return productSpecific;

  const businessWide = dbGroups.filter((g) => !g.product_id);
  if (businessWide.length) return businessWide;

  return inferModifierGroupsFromProduct(product);
}

/** @deprecated usar resolveProductModifierGroups */
export async function getProductModifierGroups(productId, { businessCategory, businessId, product } = {}) {
  if (product) {
    return resolveProductModifierGroups(product, { id: businessId, category: businessCategory });
  }
  return fetchGroupsFromDb({ productId, businessId });
}

export async function listProductModifierGroups(productId, businessId) {
  return fetchGroupsFromDb({ productId, businessId });
}

export async function saveProductModifierGroups(productId, businessId, groups = []) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');

  const { data: existing } = await supabase
    .from('product_modifier_groups')
    .select('id')
    .eq('product_id', productId)
    .eq('business_id', businessId);

  const existingIds = (existing || []).map((g) => g.id);
  if (existingIds.length) {
    await supabase.from('product_modifiers').delete().in('group_id', existingIds);
    await supabase.from('product_modifier_groups').delete().in('id', existingIds);
  }

  for (let gi = 0; gi < groups.length; gi += 1) {
    const group = groups[gi];
    const { data: inserted, error } = await supabase
      .from('product_modifier_groups')
      .insert({
        business_id: businessId,
        product_id: productId,
        name: group.name,
        description: group.description || null,
        selection_type: group.selection_type || 'single',
        min_select: group.min_select ?? (group.is_required ? 1 : 0),
        max_select: group.max_select ?? (group.selection_type === 'single' ? 1 : null),
        is_required: Boolean(group.is_required),
        sort_order: gi,
      })
      .select('id')
      .single();

    if (error) throw error;

    const modifiers = (group.modifiers || []).map((m, mi) => ({
      group_id: inserted.id,
      name: m.name,
      price_delta: Number(m.price_delta) || 0,
      is_default: Boolean(m.is_default),
      is_available: true,
      action_type: m.action_type || 'add',
      sort_order: mi,
    }));

    if (modifiers.length) {
      const { error: modErr } = await supabase.from('product_modifiers').insert(modifiers);
      if (modErr) throw modErr;
    }
  }

  return listProductModifierGroups(productId, businessId);
}

export const UPSELL_CATEGORIES = {
  drinks: ['bebidas', 'bebida', 'jugos', 'frutos'],
  utensils: ['cubiertos', 'acompañamientos', 'acompanamientos', 'extras'],
};

export function filterUpsellProducts(products = [], kind = 'drinks') {
  const keys = UPSELL_CATEGORIES[kind] || [];
  return products.filter((p) => {
    const category = (p.category || '').toLowerCase();
    return keys.some((k) => category.includes(k));
  });
}
