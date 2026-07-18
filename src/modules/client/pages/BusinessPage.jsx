import { useMemo, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../../../utils/toast';
import PageLayout from '@/design-system/layouts/PageLayout';
import PageExperienceGuard from '@/design-system/patterns/PageExperienceGuard';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '../../../components/ui/Button';
import CatalogImage from '../../../components/ui/CatalogImage';
import ProductCustomizerModal from '@/components/catalog/ProductCustomizerModal';
import { getBusinessByIdOrSlug, getProductsByBusiness } from '../../../services/business.service';
import { resolveProductModifierGroups } from '@/services/product-modifiers.service';
import { getBusinessRatingSummary } from '../../../services/review.service';
import { useCartStore } from '../../../store/cartStore';
import { formatCOP } from '../../../utils/currency';
import { formatDistanceKm } from '@/utils/format-distance';
import { isDishLikeProduct } from '@/utils/product-modifiers';
import { buildBusinessUrl, copyToClipboard } from '../../../utils/app';
import { openWhatsApp, buildBusinessWhatsAppMessage } from '../../../utils/whatsapp';
import { isBusinessOpenNow, isBusinessStoreLive, getBusinessEtaMinutes, formatBusinessHours } from '../../../utils/schedule';
import { resolveBusinessCover } from '../../../utils/catalog-images';
import { getBusinessCoverageForUser, isBusinessOrderableInCatalog } from '../../../utils/business-coverage';
import { useCatalogLocation } from '../../../hooks/useCatalogLocation';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { PageState } from '@/design-system/patterns/PageState';
import AppIcon from '@/design-system/icons/AppIcon';
import { formatBusinessPromoText } from '../../../utils/promo';
import BusinessStoreAlerts from '../components/BusinessStoreAlerts';
import BusinessStoreMeta from '../components/BusinessStoreMeta';
import BusinessProductCard from '../components/BusinessProductCard';
import CartStoreSwitchModal from '@/components/cart/CartStoreSwitchModal';
import MobileStickyCheckoutBar from '@/design-system/patterns/MobileStickyCheckoutBar';
import { useAuthStore } from '../../../store/authStore';
import { isBusinessFavorited, toggleFavoriteBusiness } from '../../../services/favorites.service';
import { emitCommEvent } from '@/communication';
import { iconForCategory } from '@/design-system/icons/icon-map';
import { cn } from '@/lib/utils';
import { STORE } from '@/utils/marketplace-copy';

export default function BusinessPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const addItem = useCartStore((s) => s.addItem);
  const itemCount = useCartStore((s) => s.getItemCount());
  const cartSubtotal = useCartStore((s) => s.getSubtotal());
  const { catalog } = useCatalogLocation();
  const [activeSection, setActiveSection] = useState(0);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [customizerProduct, setCustomizerProduct] = useState(null);
  const [customizerGroups, setCustomizerGroups] = useState([]);
  const [justAddedId, setJustAddedId] = useState(null);
  const [storeConflict, setStoreConflict] = useState(null);
  const pendingCartRetryRef = useRef(null);
  const online = useOnlineStatus();

  const { data: business, isLoading, isError, refetch } = useQuery({
    queryKey: ['business', id],
    queryFn: () => getBusinessByIdOrSlug(id),
    retry: 2,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products', business?.id],
    queryFn: () => getProductsByBusiness(business.id),
    enabled: !!business?.id,
    retry: 1,
  });

  const { data: ratingSummary } = useQuery({
    queryKey: ['business-rating', business?.id],
    queryFn: () => getBusinessRatingSummary(business.id),
    enabled: !!business?.id,
  });

  const { data: isFavorited = false } = useQuery({
    queryKey: ['favorite-business', user?.id, business?.id],
    queryFn: () => isBusinessFavorited(user.id, business.id),
    enabled: !!user?.id && !!business?.id,
  });

  const favoriteMutation = useMutation({
    mutationFn: () => toggleFavoriteBusiness(user.id, business.id),
    onSuccess: (result) => {
      queryClient.setQueryData(['favorite-business', user?.id, business?.id], result.favorited);
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      toast(result.favorited ? 'Agregado a favoritos' : 'Quitado de favoritos');
      if (result.favorited) {
        emitCommEvent('account_favorite_added', {
          recipientId: user.id,
          actorId: user.id,
          payload: { businessId: business.id, action: 'added' },
          push: false,
        }).catch(() => {});
      }
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const menuSections = useMemo(() => {
    const groups = {};
    for (const product of products) {
      const key = product.category || 'Catálogo';
      if (!groups[key]) groups[key] = [];
      groups[key].push(product);
    }
    return Object.entries(groups);
  }, [products]);

  const popularProducts = useMemo(() => {
    if (products.length < 4) return [];
    return [...products]
      .sort((a, b) => {
        const dealA = Number(a.compare_at_price) > Number(a.price) ? 1 : 0;
        const dealB = Number(b.compare_at_price) > Number(b.price) ? 1 : 0;
        if (dealB !== dealA) return dealB - dealA;
        return Number(a.price) - Number(b.price);
      })
      .slice(0, 4);
  }, [products]);

  const openNow = business ? isBusinessOpenNow(business) : false;
  const storeLive = business ? isBusinessStoreLive(business) : false;
  const coverage = business ? getBusinessCoverageForUser(business, catalog.viewMunicipio) : null;
  const canOrder = business ? isBusinessOrderableInCatalog(business, catalog) : false;
  const canPurchase = canOrder && openNow && storeLive;
  const storeActive = storeLive && openNow;
  const etaMinutes = business ? getBusinessEtaMinutes(business) : 25;
  const cover = business ? resolveBusinessCover(business) : null;
  const promoText = business ? formatBusinessPromoText(business) : null;
  const storeIcon = business ? iconForCategory(business.category) : 'store';
  const distanceLabel = business
    ? formatDistanceKm(business.distance_km ?? business.distanceKm) || 'Cerca de ti'
    : null;
  const activeItems = menuSections[activeSection]?.[1] ?? products;
  const sectionTitle = menuSections[activeSection]?.[0] || 'Catálogo';
  const deliveryLabel = Number(business?.delivery_fee) > 0
    ? formatCOP(business.delivery_fee)
    : 'gratis';
  const minOrderLabel = Number(business?.min_order) > 0
    ? ` · Mín. ${formatCOP(business.min_order)}`
    : '';

  const flashAdded = (productId) => {
    setJustAddedId(productId);
    window.setTimeout(() => setJustAddedId((current) => (current === productId ? null : current)), 1200);
  };

  const runCartAction = useCallback((action, onSuccess) => {
    const result = action();
    if (result.conflict) {
      pendingCartRetryRef.current = () => action({ replaceCart: true });
      setStoreConflict(result.conflict);
      return;
    }
    if (result.error) {
      toast(result.error, 'error');
      return;
    }
    onSuccess?.(result);
  }, []);

  const handleConfirmStoreSwitch = () => {
    const retry = pendingCartRetryRef.current;
    pendingCartRetryRef.current = null;
    setStoreConflict(null);
    retry?.();
  };

  const handleAdd = async (product) => {
    if (!canOrder) {
      toast('Activa tu ubicación o elige una tienda en tu zona', 'error');
      return;
    }
    if (!storeLive) {
      toast(STORE.notPublished, 'error');
      return;
    }
    if (!openNow) {
      toast(STORE.closed, 'error');
      return;
    }

    if (!isDishLikeProduct(product, business.category)) {
      runCartAction(
        (opts = {}) => useCartStore.getState().addSimpleItem(product, business, opts),
        () => {
          flashAdded(product.id);
          toast(`${product.name} agregado al carrito`);
        },
      );
      return;
    }

    const groups = await resolveProductModifierGroups(product, business);
    setCustomizerProduct(product);
    setCustomizerGroups(groups);
    setCustomizerOpen(true);
  };

  const handleCustomizerConfirm = (payload) => {
    runCartAction(
      (opts = {}) => addItem(customizerProduct, business, {
        modifiers: payload.modifiers,
        modifierSummary: payload.modifierSummary,
        unitPrice: payload.unitPrice,
        compareAtPrice: payload.compareAtPrice,
        quantity: payload.quantity || 1,
        ...opts,
      }),
      () => {
        setCustomizerOpen(false);
        setCustomizerProduct(null);
        flashAdded(customizerProduct?.id);
        toast((payload.quantity || 1) > 1
          ? `${payload.quantity} × ${customizerProduct?.name || 'productos'} en el carrito`
          : `${customizerProduct?.name || 'Producto'} agregado al carrito`);
      },
    );
  };

  const handleShare = async () => {
    if (!business) return;
    const copied = await copyToClipboard(buildBusinessUrl(business));
    if (copied) toast('Link copiado');
    openWhatsApp(buildBusinessWhatsAppMessage(business));
  };

  if (!business && !isLoading && !isError) {
    return (
      <PageLayout title="Tienda" backTo="/" maxWidth="lg">
        <PageState
          type="empty"
          title="Tienda no encontrada"
          description="El enlace puede estar vencido o la tienda ya no está activa."
          action={<Link to="/"><Button size="sm">Volver al catálogo</Button></Link>}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout title={false} backTo="/" maxWidth="store" contentClassName="!px-0">
      <PageExperienceGuard
        online={online}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        loadingRows={6}
        offlineDescription="Conéctate para ver el menú y pedir."
        errorDescription="No pudimos cargar esta tienda. Intenta de nuevo."
      >
        {business && (
          <>
            <div
              className={cn(
                'store-cover relative h-52 overflow-hidden sm:h-60 lg:h-64',
                !storeActive && 'store-cover--off',
              )}
            >
              <CatalogImage
                src={cover}
                emoji={storeIcon}
                alt={business.name}
                rounded="none"
                size="3xl"
                imgClassName="store-cover-media"
              />
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/45 to-foreground/10',
                  !storeActive && 'from-foreground/80 via-foreground/50',
                )}
              />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                <Link
                  to="/"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/35 text-white backdrop-blur-md"
                  aria-label="Volver"
                >
                  <AppIcon name="chevronDown" className="rotate-90 text-white" />
                </Link>
                <div className="flex items-center gap-2">
                  {user?.id && (
                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/35 text-white backdrop-blur-md"
                      onClick={() => favoriteMutation.mutate()}
                      disabled={favoriteMutation.isPending}
                      aria-label={isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      <AppIcon
                        name="star"
                        className={isFavorited ? 'text-accent' : 'text-white'}
                      />
                    </button>
                  )}
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/35 text-white backdrop-blur-md"
                    onClick={handleShare}
                    aria-label="Compartir menú"
                  >
                    <AppIcon name="link" className="text-white" />
                  </button>
                </div>
              </div>
              <div className="on-media absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/50 to-transparent p-4 pb-5 sm:p-5">
                <h1 className="font-display text-2xl font-black leading-tight text-white sm:text-3xl">
                  {business.name}
                </h1>
                <p className="mt-1 text-sm font-medium text-white/90">
                  {business.municipio}
                  {business.zone ? ` · ${business.zone}` : ''}
                  {openNow ? ' · Abierto' : ' · Cerrado'}
                  {' · '}
                  ~{etaMinutes} min
                </p>
              </div>
            </div>

            <div className="store-page-content w-full space-y-4 px-4 pb-28 pt-3 sm:px-5 lg:px-8 lg:pb-4">
              <BusinessStoreAlerts
                business={business}
                catalog={catalog}
                canOrder={canOrder}
                openNow={openNow}
                storeLive={storeLive}
                promoText={null}
              />

              <div className="client-page-split client-page-split--store">
              <div className={cn('min-w-0 space-y-4', !storeActive && 'store-page-dimmed')}>
                <BusinessStoreMeta
                  business={business}
                  ratingSummary={ratingSummary}
                  openNow={openNow}
                  coverage={coverage}
                  etaMinutes={etaMinutes}
                  deliveryLabel={deliveryLabel}
                  minOrderLabel={minOrderLabel}
                  distanceLabel={distanceLabel}
                  promoText={promoText}
                  storeActive={storeActive}
                />

                {!storeActive && business.opens_at && business.closes_at && (
                  <p className="text-xs text-muted-foreground">
                    Horario: {formatBusinessHours(business)}
                  </p>
                )}

                {popularProducts.length > 0 && (
                  <section className="space-y-3" aria-labelledby="store-popular-title">
                    <h2 id="store-popular-title" className="font-display text-lg font-bold text-foreground">
                      Populares
                    </h2>
                    <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                      {popularProducts.map((p) => (
                        <BusinessProductCard
                          key={`popular-${p.id}`}
                          product={p}
                          business={business}
                          coverFallback={cover}
                          canPurchase={canPurchase}
                          storeInactive={!storeActive}
                          justAdded={justAddedId === p.id}
                          featured
                          onAdd={() => handleAdd(p)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {menuSections.length > 1 && (
                  <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 hide-scrollbar" role="tablist" aria-label="Secciones del menú">
                    {menuSections.map(([section], index) => (
                      <button
                        key={section}
                        type="button"
                        role="tab"
                        aria-selected={index === activeSection}
                        onClick={() => setActiveSection(index)}
                        className={cn(
                          'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
                          index === activeSection
                            ? storeActive
                              ? 'bg-primary text-primary-foreground shadow-soft'
                              : 'bg-muted-foreground text-card'
                            : 'border border-border bg-card text-muted-foreground hover:border-primary/35',
                        )}
                      >
                        {section}
                      </button>
                    ))}
                  </div>
                )}

              <section className="space-y-3">
                {products.length === 0 ? (
                  <SurfaceCard className="border-dashed py-10 text-center">
                    <AppIcon name={storeIcon} size="2xl" className="mx-auto text-muted-foreground" />
                    <p className="mt-3 font-semibold text-foreground">Catálogo en actualización</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Esta tienda aún no tiene productos publicados. Vuelve pronto.
                    </p>
                  </SurfaceCard>
                ) : (
                  <>
                    <h2 className="font-display text-lg font-bold text-foreground">
                      {sectionTitle}
                    </h2>
                    <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-2">
                      {activeItems.map((p) => (
                        <BusinessProductCard
                          key={p.id}
                          product={p}
                          business={business}
                          coverFallback={cover}
                          canPurchase={canPurchase}
                          storeInactive={!storeActive}
                          justAdded={justAddedId === p.id}
                          onAdd={() => handleAdd(p)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </section>
              </div>

              <aside className="client-sticky-panel hidden lg:block">
                {itemCount > 0 ? (
                  <SurfaceCard className="space-y-4 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display text-sm font-bold text-foreground">Tu pedido</p>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        {itemCount}
                      </span>
                    </div>
                    <p className="font-display text-2xl font-black text-foreground">{formatCOP(cartSubtotal)}</p>
                    <p className="text-xs text-muted-foreground">~{etaMinutes} min · Domicilio {deliveryLabel}</p>
                    <Link to="/carrito">
                      <Button className="w-full rounded-[var(--radius-component)] py-3 text-base font-bold">
                        Ver carrito
                      </Button>
                    </Link>
                  </SurfaceCard>
                ) : (
                  <SurfaceCard className="p-4 text-center text-sm text-muted-foreground">
                    Agrega productos del menú para armar tu pedido.
                    <span className="mt-1 block text-xs">Entrega estimada ~{etaMinutes} min</span>
                  </SurfaceCard>
                )}
              </aside>
              </div>
            </div>

            {itemCount > 0 && (
              <MobileStickyCheckoutBar
                total={cartSubtotal}
                totalLabel={`Carrito · ${itemCount}`}
                actionLabel="Ver carrito"
                href="/carrito"
                hint={`~${etaMinutes} min · Domicilio ${deliveryLabel}`}
              />
            )}

            <ProductCustomizerModal
              open={customizerOpen}
              product={customizerProduct}
              business={business}
              groups={customizerGroups}
              onClose={() => {
                setCustomizerOpen(false);
                setCustomizerProduct(null);
              }}
              onConfirm={handleCustomizerConfirm}
            />

            <CartStoreSwitchModal
              open={Boolean(storeConflict)}
              conflict={storeConflict}
              onClose={() => {
                pendingCartRetryRef.current = null;
                setStoreConflict(null);
              }}
              onConfirm={handleConfirmStoreSwitch}
            />
          </>
        )}
      </PageExperienceGuard>
    </PageLayout>
  );
}
