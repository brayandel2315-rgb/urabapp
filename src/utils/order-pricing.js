import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { calculateUnitPrice } from './product-modifiers';
import { mapApiError } from './errors';

/**
 * Recalcula precios desde la BD — el cliente no puede fijar montos arbitrarios.
 */
export async function validateAndPriceOrderItems(businessId, items = []) {
  if (!items.length) {
    throw new Error('El carrito está vacío');
  }
  if (!isSupabaseConfigured || !businessId) {
    return items.map((item) => ({
      ...item,
      price: Number(item.price) || 0,
    }));
  }

  const productIds = [...new Set(items.map((i) => i.productId).filter(Boolean))];
  if (!productIds.length) {
    throw new Error('Productos del carrito inválidos');
  }

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, emoji, price, is_available, business_id')
    .eq('business_id', businessId)
    .in('id', productIds);

  if (error) throw new Error(mapApiError(error));

  const byId = new Map((products ?? []).map((p) => [p.id, p]));

  return items.map((item) => {
    const product = byId.get(item.productId);
    if (!product) {
      throw new Error(`"${item.name || 'Producto'}" ya no está disponible`);
    }
    if (product.is_available === false) {
      throw new Error(`"${product.name}" está agotado`);
    }
    const basePrice = Number(product.price) || 0;
    const unitPrice = calculateUnitPrice(basePrice, item.modifiers || []);
    return {
      ...item,
      name: product.name,
      emoji: product.emoji || item.emoji,
      basePrice,
      price: unitPrice,
    };
  });
}
