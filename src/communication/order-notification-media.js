/**
 * Resuelve imagen de producto + logo de tienda para notificaciones de pedido.
 */
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { resolveProductImageUrl } from '@/data/catalog-visuals';

export function pickItemImage(items = []) {
  for (const item of items) {
    const img = item?.image_url || item?.imageUrl || item?.image || item?.photo_url;
    if (typeof img === 'string' && img.trim()) return img.trim();
  }
  // Fallback visual por emoji/nombre del primer ítem
  const first = items[0];
  if (first) {
    const resolved = resolveProductImageUrl(first);
    if (resolved) return resolved;
  }
  return null;
}

/**
 * @returns {Promise<{ imageUrl: string|null, logoUrl: string|null, businessName: string|null }>}
 */
export async function resolveOrderNotificationMedia({
  orderId,
  businessId,
  items = [],
} = {}) {
  let imageUrl = pickItemImage(items);
  let logoUrl = null;
  let businessName = null;

  if (!isSupabaseConfigured) {
    return { imageUrl, logoUrl, businessName };
  }

  try {
    if (orderId && !String(orderId).startsWith('local-')) {
      const { data: order } = await supabase
        .from('orders')
        .select(`
          business_id,
          businesses(id, name, logo_url, cover_url),
          order_items(name, emoji, product_id, products(image_url, name, emoji))
        `)
        .eq('id', orderId)
        .maybeSingle();

      if (order) {
        businessName = order.businesses?.name || businessName;
        logoUrl = order.businesses?.logo_url || order.businesses?.cover_url || logoUrl;

        if (!imageUrl && Array.isArray(order.order_items)) {
          for (const row of order.order_items) {
            const productImg = row.products?.image_url;
            if (productImg) {
              imageUrl = productImg;
              break;
            }
            const fallback = resolveProductImageUrl({
              name: row.products?.name || row.name,
              emoji: row.products?.emoji || row.emoji,
              image_url: row.products?.image_url,
            });
            if (fallback) {
              imageUrl = fallback;
              break;
            }
          }
        }
      }
    }

    const bizId = businessId || null;
    if ((!logoUrl || !imageUrl) && bizId) {
      const { data: biz } = await supabase
        .from('businesses')
        .select('name, logo_url, cover_url')
        .eq('id', bizId)
        .maybeSingle();
      if (biz) {
        businessName = businessName || biz.name;
        logoUrl = logoUrl || biz.logo_url || biz.cover_url || null;
      }

      if (!imageUrl) {
        const productIds = items.map((i) => i.productId || i.product_id).filter(Boolean);
        if (productIds.length) {
          const { data: products } = await supabase
            .from('products')
            .select('id, image_url, name, emoji')
            .in('id', productIds)
            .limit(5);
          const hit = (products || []).find((p) => p.image_url);
          if (hit?.image_url) {
            imageUrl = hit.image_url;
          } else if (products?.[0]) {
            imageUrl = resolveProductImageUrl(products[0]);
          }
        }
      }
    }
  } catch {
    /* best-effort media */
  }

  // Si no hay foto de producto, usar logo de tienda como imagen principal
  if (!imageUrl && logoUrl) imageUrl = logoUrl;

  return { imageUrl, logoUrl, businessName };
}
