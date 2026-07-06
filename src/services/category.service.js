import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch, sbExec, sbQuery } from '@/lib/supabase-query';
import { mapApiError } from '../utils/errors';
import {
  BUSINESS_CATEGORIES,
  getExploreCategories,
} from '../data/category-catalog';
import { iconForCategory, resolveIconKey } from '@/design-system/icons/icon-map';

function categoryIconKey(row, local) {
  const raw = row?.emoji ?? local?.icon;
  return resolveIconKey(raw) || iconForCategory(row?.id) || 'store';
}

function mergeCategoryRow(row) {
  const local = BUSINESS_CATEGORIES[row.id];
  const icon = categoryIconKey(row, local);
  if (!local) {
    return {
      id: row.id,
      name: row.name,
      shortName: row.name,
      plural: row.name,
      icon,
      sticker: icon,
      emoji: icon,
      sortOrder: row.sort_order ?? 99,
      is_active: row.is_active !== false,
      theme: BUSINESS_CATEGORIES.tiendas?.theme,
    };
  }
  return {
    ...local,
    name: row.name || local.name,
    shortName: row.name?.split(' ')[0] || local.shortName,
    icon,
    sticker: icon,
    emoji: icon,
    sortOrder: row.sort_order ?? local.sortOrder,
    is_active: row.is_active !== false,
  };
}

/** Categorías para explorar — BD como fuente de verdad (nombre, emoji, orden) */
export async function getExploreCategoryList() {
  if (!isSupabaseConfigured) {
    return getExploreCategories();
  }

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, emoji, sort_order, is_active')
    .eq('is_active', true)
    .order('sort_order');

  if (error || !data?.length) {
    return getExploreCategories();
  }

  return data.map(mergeCategoryRow).filter(Boolean);
}

export async function getAllCategoriesAdmin() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('categories')
      .select('*')
      .order('sort_order'),
    'Tiempo agotado cargando categorías',
  );
  return (data ?? []).map(mergeCategoryRow);
}

export async function createCategory(payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const id = String(payload.id || '').trim().toLowerCase();
  if (!/^[a-z0-9_-]+$/.test(id)) {
    throw new Error('El ID solo puede tener letras minúsculas, números, guión o guión bajo');
  }
  const data = await sbFetch(
    supabase
      .from('categories')
      .insert({
        id,
        name: payload.name.trim(),
        emoji: resolveIconKey(payload.emoji) || iconForCategory(id) || 'store',
        sort_order: Number(payload.sort_order) || 0,
        is_active: payload.is_active ?? true,
      })
      .select()
      .single(),
    'Tiempo agotado creando categoría',
  );
  return mergeCategoryRow(data);
}

export async function updateCategory(id, payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const updates = {};
  if (payload.name != null) updates.name = payload.name.trim();
  if (payload.emoji != null) updates.emoji = resolveIconKey(payload.emoji) || 'store';
  if (payload.sort_order != null) updates.sort_order = Number(payload.sort_order) || 0;
  if (payload.is_active != null) updates.is_active = payload.is_active;

  const data = await sbFetch(
    supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single(),
    'Tiempo agotado actualizando categoría',
  );
  return mergeCategoryRow(data);
}

export async function deleteCategory(id) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const { count, error: countErr } = await sbQuery(
    supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('category', id)
      .eq('is_active', true),
    'Tiempo agotado verificando comercios en la categoría',
  );
  if (countErr) throw new Error(mapApiError(countErr));
  if ((count ?? 0) > 0) {
    throw new Error(`No se puede eliminar: hay ${count} comercio(s) activos en esta categoría`);
  }
  await sbExec(
    supabase.from('categories').delete().eq('id', id),
    'Tiempo agotado eliminando categoría',
  );
}

export async function getCategoryBusinessCounts() {
  if (!isSupabaseConfigured) return {};
  const data = await sbFetch(
    supabase
      .from('businesses')
      .select('category')
      .eq('is_active', true),
    'Tiempo agotado cargando conteos por categoría',
  );
  const counts = {};
  for (const row of data ?? []) {
    counts[row.category] = (counts[row.category] || 0) + 1;
  }
  return counts;
}

export async function syncCatalogCategoriesToDb() {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const rows = Object.values(BUSINESS_CATEGORIES).map((c) => ({
    id: c.id,
    name: c.name,
    emoji: c.icon || iconForCategory(c.id),
    sort_order: c.sortOrder,
    is_active: true,
  }));
  await sbExec(
    supabase.from('categories').upsert(rows, { onConflict: 'id' }),
    'Tiempo agotado sincronizando categorías',
  );
  return rows.length;
}
