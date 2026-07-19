import { useState } from 'react';
import { Link } from 'react-router-dom';
import { STORE } from '@/utils/marketplace-copy';
import { useQuery } from '@tanstack/react-query';
import MobileStickyCheckoutBar from '@/design-system/patterns/MobileStickyCheckoutBar';
import PageLayout from '@/design-system/layouts/PageLayout';
import ClientScreenHeader from '@/design-system/patterns/ClientScreenHeader';
import PageExperienceGuard from '@/design-system/patterns/PageExperienceGuard';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import PriceSummary from '@/design-system/patterns/PriceSummary';
import { PageState } from '@/design-system/patterns/PageState';
import Button from '../../../components/ui/Button';
import CatalogImage from '../../../components/ui/CatalogImage';
import ProductCustomizerModal from '@/components/catalog/ProductCustomizerModal';
import { resolveProductImage } from '../../../utils/catalog-images';
import { useCartStore, cartLineKey } from '../../../store/cartStore';
import { ECONOMICS } from '../../../utils/constants';
import { formatCOP } from '../../../utils/currency';
import { getProductsByBusiness, getBusinessById } from '@/services/business.service';
import { getBusinessEtaMinutes } from '@/utils/schedule';
import { canCheckoutWithBusiness } from '@/utils/business-checkout';
import { filterUpsellProducts, resolveProductModifierGroups } from '@/services/product-modifiers.service';
import { calculateUnitPrice } from '@/utils/product-modifiers';
import { buildModifierLineSummary } from '@/utils/product-modifiers';
import { toast } from '@/utils/toast';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useClientAddressGate } from '@/hooks/useClientAddressGate';
import ClientAddressGateExperience from '@/components/client/ClientAddressGateExperience';

function lineKey(item) {
  return cartLineKey(item);
}

export default function CartPage() {
  const online = useOnlineStatus();
  const {
    items,
    businessId,
    businessName,
    minOrder,
    deliveryFee,
    updateQuantity,
    updateLineItem,
    removeItem,
    addSimpleItem,
    getSubtotal,
    getSavings,
  } = useCartStore();

  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [editingLine, setEditingLine] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingGroups, setEditingGroups] = useState([]);

  const subtotal = getSubtotal();
  const savings = getSavings();
  const fee = deliveryFee ?? ECONOMICS.defaultDeliveryFee;
  const minimum = minOrder ?? 0;
  const belowMin = minimum > 0 && subtotal < minimum;
  const { data: cartBusiness } = useQuery({
    queryKey: ['cart-business', businessId],
    queryFn: () => getBusinessById(businessId),
    enabled: !!businessId,
    staleTime: 60_000,
  });

  const prepMinutes = getBusinessEtaMinutes(cartBusiness);
  const etaMin = prepMinutes;
  const etaMax = prepMinutes + 15;
  const storeReady = canCheckoutWithBusiness(cartBusiness);
  const { needsAddress, authed } = useClientAddressGate();
  const addressBlocked = authed && needsAddress;
  const canCheckout = !belowMin && storeReady && !addressBlocked;
  const checkoutHref = addressBlocked
    ? '/cuenta/direcciones?required=1&redirect=/checkout'
    : '/checkout';
  const checkoutLabel = addressBlocked
    ? 'Registrar dirección'
    : belowMin
      ? 'Pedido mínimo'
      : !storeReady
        ? 'Tienda cerrada'
        : 'Ir a pagar';

  const { data: catalogProducts = [] } = useQuery({
    queryKey: ['cart-upsell-products', businessId],
    queryFn: () => getProductsByBusiness(businessId),
    enabled: !!businessId,
    staleTime: 60_000,
  });

  const drinkUpsells = filterUpsellProducts(catalogProducts, 'drinks').slice(0, 2);
  const utensilUpsells = filterUpsellProducts(catalogProducts, 'utensils').slice(0, 1);
  const upsellProducts = [...drinkUpsells, ...utensilUpsells];

  const businessStub = {
    id: businessId,
    name: businessName,
    min_order: minimum,
    delivery_fee: deliveryFee,
  };

  const handleQuickAdd = (product) => {
    const { error } = addSimpleItem(product, businessStub);
    if (error) toast(error, 'error');
    else toast('Agregado al carrito');
  };

  const handleEditLine = async (item) => {
    const product = catalogProducts.find((p) => p.id === item.productId);
    if (!product) {
      toast('Producto no disponible para editar', 'error');
      return;
    }
    const groups = await resolveProductModifierGroups(product, businessStub);
    setEditingLine(item);
    setEditingProduct(product);
    setEditingGroups(groups);
    setCustomizerOpen(true);
  };

  const handleCustomizerConfirm = (payload) => {
    if (!editingLine) return;
    const unitPrice = payload.unitPrice ?? calculateUnitPrice(editingProduct.price, payload.modifiers);
    updateLineItem(lineKey(editingLine), {
      price: unitPrice,
      quantity: payload.quantity || 1,
      modifiers: payload.modifiers || [],
      modifierSummary: payload.modifierSummary || buildModifierLineSummary(payload.modifiers),
      compareAtPrice: payload.compareAtPrice ?? editingLine.compareAtPrice,
    });
    setCustomizerOpen(false);
    setEditingLine(null);
    setEditingProduct(null);
    toast('Producto actualizado');
  };

  if (items.length === 0) {
    return (
      <PageLayout title="Carrito" maxWidth="lg">
        <PageState
          type="empty"
          icon="cart"
          title="Tu carrito está vacío"
          description="Agrega productos de una tienda."
          action={<Link to="/"><Button>{STORE.browse}</Button></Link>}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout title={false} maxWidth="lg" bottomPad stickyCheckout>
      <ClientScreenHeader
        tag="Tu pedido"
        title={businessName}
        subtitle={storeReady
          ? `Entrega ~${etaMin}–${etaMax} min · ${formatCOP(fee)} domicilio`
          : 'La tienda no acepta pedidos ahora'}
      />

      <PageExperienceGuard
        online={online}
        offlineDescription="Conéctate para revisar tu carrito y continuar al pago."
      >
      {addressBlocked ? (
        <div className="mb-3">
          <ClientAddressGateExperience
            variant="card"
            href="/cuenta/direcciones?required=1&redirect=/checkout"
          />
        </div>
      ) : null}
      <div className="client-page-split client-page-split--cart">
        <div className="min-w-0 space-y-3">
        {items.map((item) => (
          <SurfaceCard key={lineKey(item)} className="flex items-start gap-3 p-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <CatalogImage src={resolveProductImage(item)} emoji={item.emoji || 'food'} alt={item.name} size="sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold text-foreground">{item.name}</p>
              {item.modifierSummary && (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.modifierSummary}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <p className="text-base font-black text-foreground">{formatCOP(item.price)}</p>
                {item.compareAtPrice && item.compareAtPrice > item.price && (
                  <p className="text-xs text-muted-foreground line-through">{formatCOP(item.compareAtPrice)}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(lineKey(item), item.quantity - 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-component)] bg-primary/10 text-lg font-bold text-primary"
                  aria-label="Menos"
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold tabular-nums">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(lineKey(item), item.quantity + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-component)] bg-primary/10 text-lg font-bold text-primary"
                  aria-label="Más"
                >
                  +
                </button>
              </div>
              <button type="button" onClick={() => removeItem(lineKey(item))} className="text-xs font-medium text-muted-foreground hover:text-destructive">
                Quitar
              </button>
              {(item.modifiers?.length > 0 || item.modifierSummary) && (
                <button
                  type="button"
                  onClick={() => handleEditLine(item)}
                  className="text-xs font-semibold text-primary"
                >
                  Editar
                </button>
              )}
            </div>
          </SurfaceCard>
        ))}
      {upsellProducts.length > 0 && (
        <SurfaceCard className="mt-4">
          <SectionTitle>Agrega algo más</SectionTitle>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0 xl:grid-cols-3">
            {upsellProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleQuickAdd(product)}
                className="min-w-[132px] rounded-[var(--radius-component)] border border-border/50 bg-background p-3 text-left transition-colors hover:border-primary/30 lg:min-w-0"
              >
                <p className="line-clamp-2 text-sm font-semibold text-foreground">{product.name}</p>
                <p className="mt-1 text-sm font-bold text-primary">{formatCOP(product.price)}</p>
              </button>
            ))}
          </div>
        </SurfaceCard>
      )}
        </div>

        <aside className="client-sticky-panel hidden space-y-4 lg:block">
          <PriceSummary
            rows={[
              { label: 'Subtotal', value: formatCOP(subtotal) },
              ...(savings > 0 ? [{ label: 'Ahorro en promos', value: `-${formatCOP(savings)}`, accent: true }] : []),
              {
                label: 'Domicilio',
                value: fee === 0 ? 'Gratis' : formatCOP(fee),
                accent: fee === 0,
              },
            ]}
            totalLabel="Total estimado"
            totalValue={formatCOP(subtotal + fee)}
            etaLabel={`${etaMin}–${etaMax} min`}
            footnote={STORE.partialFulfillment}
          />

          {minimum > 0 && (
            <SurfaceCard className="space-y-2 rounded-[var(--radius-component)]">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-semibold text-foreground">Pedido mínimo</span>
                <span className="tabular-nums text-muted-foreground">{formatCOP(minimum)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / minimum) * 100)}%` }}
                />
              </div>
              <p className="text-xs font-semibold text-foreground">
                {belowMin
                  ? `Te faltan ${formatCOP(minimum - subtotal)}`
                  : 'Listo para pagar'}
              </p>
            </SurfaceCard>
          )}

          {!storeReady && cartBusiness && !belowMin && (
            <SurfaceCard className="text-center text-sm text-muted-foreground">
              La tienda está cerrada o no acepta pedidos en este momento.
            </SurfaceCard>
          )}

          {canCheckout || addressBlocked ? (
            <Link to={checkoutHref}>
              <Button className="h-12 w-full rounded-[var(--radius-component)] py-3.5 text-base font-bold">
                {checkoutLabel}
              </Button>
            </Link>
          ) : (
            <Button className="h-12 w-full rounded-[var(--radius-component)] py-3.5 text-base font-bold" disabled>
              {checkoutLabel}
            </Button>
          )}
        </aside>
      </div>

      <div className="mt-4 space-y-3 lg:hidden">
      <PriceSummary
        rows={[
          { label: 'Subtotal', value: formatCOP(subtotal) },
          ...(savings > 0 ? [{ label: 'Ahorro en promos', value: `-${formatCOP(savings)}`, accent: true }] : []),
          {
            label: 'Domicilio',
            value: fee === 0 ? 'Gratis' : formatCOP(fee),
            accent: fee === 0,
          },
        ]}
        totalLabel="Total estimado"
        totalValue={formatCOP(subtotal + fee)}
        etaLabel={`${etaMin}–${etaMax} min`}
        footnote={STORE.partialFulfillment}
      />

      {minimum > 0 && (
        <SurfaceCard className="space-y-2 rounded-[var(--radius-component)]">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-semibold text-foreground">Pedido mínimo</span>
            <span className="tabular-nums text-muted-foreground">{formatCOP(minimum)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(100, (subtotal / minimum) * 100)}%` }}
            />
          </div>
          <p className="text-xs font-semibold text-foreground">
            {belowMin
              ? `Te faltan ${formatCOP(minimum - subtotal)}`
              : 'Listo para pagar'}
          </p>
        </SurfaceCard>
      )}

      {!storeReady && cartBusiness && !belowMin && (
        <SurfaceCard className="text-center text-sm text-muted-foreground">
          La tienda está cerrada o no acepta pedidos en este momento.
        </SurfaceCard>
      )}
      </div>

      <MobileStickyCheckoutBar
        total={subtotal + fee}
        totalLabel="Total estimado"
        actionLabel={checkoutLabel}
        href={(canCheckout || addressBlocked) ? checkoutHref : undefined}
        disabled={!canCheckout && !addressBlocked}
        hint={addressBlocked
          ? 'Tipo · barrio · dirección · referencia'
          : belowMin
            ? `Faltan ${formatCOP(minimum - subtotal)}`
            : `${etaMin}-${etaMax} min`}
      />

      <ProductCustomizerModal
        open={customizerOpen}
        product={editingProduct}
        business={businessStub}
        groups={editingGroups}
        initialModifiers={editingLine?.modifiers}
        initialQuantity={editingLine?.quantity}
        confirmLabel="Guardar cambios"
        onClose={() => {
          setCustomizerOpen(false);
          setEditingLine(null);
          setEditingProduct(null);
        }}
        onConfirm={handleCustomizerConfirm}
      />
      </PageExperienceGuard>
    </PageLayout>
  );
}
