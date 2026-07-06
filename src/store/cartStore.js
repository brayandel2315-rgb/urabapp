import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateUnitPrice } from '@/utils/product-modifiers';

function emptyCartState() {
  return { businessId: null, businessName: null, minOrder: null, deliveryFee: null, items: [] };
}

export function cartLineKey(item) {
  return item.lineId || item.productId;
}

function lineKey(item) {
  return cartLineKey(item);
}

function normalizeBusinessId(id) {
  if (id == null || id === '') return null;
  return String(id);
}

function cartHasItems(state) {
  return (state.items?.length ?? 0) > 0;
}

function checkBusinessConflict(state, business, { replaceCart = false } = {}) {
  const nextId = normalizeBusinessId(business?.id);
  if (!nextId) return { allowed: true };

  const currentId = normalizeBusinessId(state.businessId);
  const hasItems = cartHasItems(state);

  if (!hasItems) {
    return {
      allowed: true,
      resetStale: Boolean(currentId && currentId !== nextId),
    };
  }

  if (currentId && currentId !== nextId) {
    if (replaceCart) return { allowed: true, clearFirst: true };
    return {
      allowed: false,
      conflict: {
        currentBusinessName: state.businessName || 'otra tienda',
        nextBusinessName: business.name || 'esta tienda',
      },
    };
  }

  return { allowed: true };
}

function applyBusinessGate(get, set, business, options = {}) {
  const check = checkBusinessConflict(get(), business, options);
  if (!check.allowed) {
    return { ok: false, conflict: check.conflict };
  }
  if (check.clearFirst || check.resetStale) {
    set(emptyCartState());
  }
  return { ok: true };
}

function applyBusinessMeta(business) {
  return {
    businessId: business.id,
    businessName: business.name,
    minOrder: business.min_order ?? 0,
    deliveryFee: business.delivery_fee ?? null,
  };
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      ...emptyCartState(),

      addItem: (product, business, options = {}) => {
        const gate = applyBusinessGate(get, set, business, options);
        if (!gate.ok) {
          return { error: null, conflict: gate.conflict };
        }

        const { items } = get();
        const modifiers = options.modifiers || [];
        const quantity = options.quantity || 1;
        const basePrice = Number(product.price) || 0;
        const compareAtPrice = options.compareAtPrice
          ?? (Number(product.compare_at_price || product.compareAtPrice || 0) || null);
        const unitPrice = options.unitPrice ?? calculateUnitPrice(basePrice, modifiers);
        const lineId = options.lineId || crypto.randomUUID();

        const newItem = {
          lineId,
          productId: product.id,
          name: product.name,
          emoji: product.emoji,
          basePrice,
          compareAtPrice,
          price: unitPrice,
          quantity,
          modifiers,
          modifierSummary: options.modifierSummary || '',
        };

        set({
          ...applyBusinessMeta(business),
          items: [...items, newItem],
        });
        return { error: null, conflict: null, lineId };
      },

      addSimpleItem: (product, business, options = {}) => {
        const gate = applyBusinessGate(get, set, business, options);
        if (!gate.ok) {
          return { error: null, conflict: gate.conflict };
        }

        const items = get().items;
        const existing = items.find((i) => i.productId === product.id && !(i.modifiers?.length));
        if (existing) {
          set({
            ...applyBusinessMeta(business),
            items: items.map((i) =>
              lineKey(i) === lineKey(existing)
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          const result = get().addItem(product, business, {
            ...options,
            modifiers: [],
            quantity: 1,
            replaceCart: false,
          });
          if (result.conflict) return result;
        }
        return { error: null, conflict: null };
      },

      removeItem: (lineId) => {
        const items = get().items.filter((i) => lineKey(i) !== lineId);
        set(items.length ? { items } : emptyCartState());
      },

      updateQuantity: (lineId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(lineId);
          return;
        }
        set({
          items: get().items.map((i) =>
            lineKey(i) === lineId ? { ...i, quantity } : i
          ),
        });
      },

      updateLineItem: (lineId, updates) => {
        set({
          items: get().items.map((i) =>
            lineKey(i) === lineId ? { ...i, ...updates } : i
          ),
        });
      },

      setCartFromReorder: (business, lines, options = {}) => {
        const gate = applyBusinessGate(get, set, business, options);
        if (!gate.ok) {
          return { error: null, conflict: gate.conflict };
        }
        if (!lines?.length) return { error: 'No hay productos para repetir', conflict: null };
        set({
          ...applyBusinessMeta(business),
          items: lines,
        });
        return { error: null, conflict: null };
      },

      clearCart: () => set(emptyCartState()),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getSavings: () =>
        get().items.reduce((sum, i) => {
          if (!i.compareAtPrice || i.compareAtPrice <= i.price) return sum;
          return sum + (i.compareAtPrice - i.price) * i.quantity;
        }, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'urabapp-cart' }
  )
);
