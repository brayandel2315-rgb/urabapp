import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import CatalogImage from '@/components/ui/CatalogImage';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { formatCOP } from '@/utils/currency';
import {
  buildModifierLineSummary,
  calculateUnitPrice,
  countRequiredGroups,
  countSatisfiedRequiredGroups,
  flattenSelectedModifiers,
  getDefaultSelection,
  selectionFromModifiers,
  validateModifierSelection,
} from '@/utils/product-modifiers';
import { resolveProductImage } from '@/utils/catalog-images';

export default function ProductCustomizerModal({
  open,
  product,
  business,
  groups = [],
  onClose,
  onConfirm,
  initialModifiers = null,
  initialQuantity = 1,
  confirmLabel = 'Agregar al carrito',
}) {
  const [selectedByGroup, setSelectedByGroup] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState([]);

  const hasOptions = groups.length > 0;

  useEffect(() => {
    if (!open || !product) return;
    if (initialModifiers?.length && groups.length) {
      setSelectedByGroup(selectionFromModifiers(groups, initialModifiers));
    } else {
      setSelectedByGroup(hasOptions ? getDefaultSelection(groups) : {});
    }
    setQuantity(initialQuantity || 1);
    setErrors([]);
  }, [open, product?.id, groups, hasOptions, initialModifiers, initialQuantity]);

  const flatModifiers = useMemo(
    () => flattenSelectedModifiers(groups, selectedByGroup),
    [groups, selectedByGroup],
  );

  const unitPrice = useMemo(
    () => calculateUnitPrice(product?.price || 0, flatModifiers),
    [product?.price, flatModifiers],
  );

  const compareAtPrice = Number(product?.compare_at_price || 0) || null;
  const savings = compareAtPrice && compareAtPrice > unitPrice
    ? (compareAtPrice - unitPrice)
    : 0;

  const requiredTotal = countRequiredGroups(groups);
  const requiredDone = countSatisfiedRequiredGroups(groups, selectedByGroup);
  const allRequiredDone = requiredDone >= requiredTotal;

  const toggleModifier = (group, modifierId) => {
    setErrors([]);
    setSelectedByGroup((prev) => {
      const current = prev[group.id] || [];
      const isSingle = group.selection_type === 'single' || group.max_select === 1;
      if (isSingle) {
        return { ...prev, [group.id]: [modifierId] };
      }
      if (current.includes(modifierId)) {
        return { ...prev, [group.id]: current.filter((id) => id !== modifierId) };
      }
      const max = group.max_select || 99;
      if (current.length >= max) return prev;
      return { ...prev, [group.id]: [...current, modifierId] };
    });
  };

  const handleConfirm = () => {
    if (hasOptions) {
      const validationErrors = validateModifierSelection(groups, selectedByGroup);
      if (validationErrors.length) {
        setErrors(validationErrors);
        return;
      }
    }
    onConfirm({
      modifiers: flatModifiers,
      modifierSummary: buildModifierLineSummary(flatModifiers),
      unitPrice,
      compareAtPrice,
      quantity,
    });
  };

  return (
    <AnimatePresence>
      {open && product && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg"
          >
            <SurfaceCard className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[1.75rem] rounded-b-none p-0 shadow-lift sm:rounded-[1.75rem]">
              <div className="flex justify-center pt-2 sm:hidden">
                <span className="h-1 w-10 rounded-full bg-border" aria-hidden />
              </div>
        <div className="relative h-40 bg-muted/20 sm:h-44">
          <CatalogImage
            src={resolveProductImage(product, business?.category, business?.slug)}
            emoji={product.emoji || 'food'}
            alt={product.name}
            rounded="none"
            size="3xl"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {hasOptions ? 'Personaliza tu pedido' : 'Detalle del producto'}
            </p>
            <h2 className="mt-1 font-display text-xl font-black text-secondary">{product.name}</h2>
            {product.description ? (
              <p className="mt-2 rounded-2xl bg-muted/40 p-3 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                Revisa el producto y agrégalo a tu carrito.
              </p>
            )}
          </div>

          {hasOptions && requiredTotal > 0 && (
            <div className={`rounded-2xl px-3 py-2 text-xs font-semibold ${
              allRequiredDone
                ? 'bg-primary/10 text-primary-dark'
                : 'bg-amber-500/15 text-amber-900'
            }`}
            >
              {allRequiredDone
                ? 'Opciones obligatorias completas'
                : `Completa las opciones obligatorias (${requiredDone}/${requiredTotal})`}
            </div>
          )}

          {hasOptions ? (
            groups.map((group) => {
              const groupSelected = selectedByGroup[group.id] || [];
              const groupIncomplete = group.is_required && groupSelected.length === 0;
              return (
                <section key={group.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{group.name}</h3>
                      {group.description && (
                        <p className="text-xs text-muted-foreground">{group.description}</p>
                      )}
                    </div>
                    {group.is_required && (
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        groupIncomplete
                          ? 'bg-amber-500/20 text-amber-900'
                          : 'bg-primary-light text-primary-dark'
                      }`}
                      >
                        Obligatorio
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {group.modifiers.map((modifier) => {
                      const active = groupSelected.includes(modifier.id);
                      return (
                        <button
                          key={modifier.id}
                          type="button"
                          onClick={() => toggleModifier(group, modifier.id)}
                          className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition-colors ${
                            active
                              ? 'border-primary bg-primary-light/40'
                              : 'border-border/60 bg-background'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold text-foreground">{modifier.name}</p>
                            {modifier.action_type === 'remove' && (
                              <p className="text-xs text-muted-foreground">Quitar del plato</p>
                            )}
                            {modifier.action_type === 'add' && modifier.price_delta === 0 && group.is_required && (
                              <p className="text-xs text-muted-foreground">Incluido</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {modifier.price_delta > 0 && (
                              <span className="text-sm font-bold text-primary-dark">
                                +{formatCOP(modifier.price_delta)}
                              </span>
                            )}
                            {active && <AppIcon name="check" size="sm" className="text-primary" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4 text-center text-sm text-muted-foreground">
              Este producto no tiene complementos adicionales. Confirma para agregarlo al carrito.
            </div>
          )}

          {errors.length > 0 && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {errors.map((err) => <p key={err}>{err}</p>)}
            </div>
          )}
        </div>

        <div
          className="border-t border-border/50 bg-background p-4"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground">Cantidad</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted font-bold text-foreground"
                  aria-label="Menos"
                >
                  −
                </button>
                <span className="w-6 text-center font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light font-bold text-primary"
                  aria-label="Más"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-black text-foreground">{formatCOP(unitPrice * quantity)}</p>
              {savings > 0 && (
                <p className="text-xs font-semibold text-primary">
                  Ahorras {formatCOP(savings * quantity)} en promo
                </p>
              )}
            </div>
          </div>
          {flatModifiers.length > 0 && (
            <p className="mb-3 text-xs text-muted-foreground">
              {buildModifierLineSummary(flatModifiers)}
            </p>
          )}
          <Button
            className="w-full rounded-2xl py-3.5 text-base font-bold shadow-glow"
            onClick={handleConfirm}
            disabled={hasOptions && requiredTotal > 0 && !allRequiredDone}
          >
            {confirmLabel}
          </Button>
        </div>
      </SurfaceCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
