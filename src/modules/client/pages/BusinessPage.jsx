import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
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
import {
  resolveBusinessCover,
  resolveBusinessLogo,
  getBusinessVisualKey,
} from '../../../utils/catalog-images';
import { getBusinessCoverageForUser, isBusinessOrderableInCatalog } from '../../../utils/business-coverage';
import { useCatalogLocation } from '../../../hooks/useCatalogLocation';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { PageState } from '@/design-system/patterns/PageState';
import AppIcon from '@/design-system/icons/AppIcon';
import { formatBusinessPromoText } from '../../../utils/promo';
import BusinessStoreAlerts from '../components/BusinessStoreAlerts';
import BusinessStoreMeta from '../components/BusinessStoreMeta';
import BusinessStoreProfile from '../components/BusinessStoreProfile';
import BusinessProductCard from '../components/BusinessProductCard';
import PreviewStoreBanner from '../components/PreviewStoreBanner';
import StoreMenuNav from '../components/StoreMenuNav';
import StoreTrustFooter from '../components/StoreTrustFooter';
import CartStoreSwitchModal from '@/components/cart/CartStoreSwitchModal';
import MobileStickyCheckoutBar from '@/design-system/patterns/MobileStickyCheckoutBar';
import { useAuthStore } from '../../../store/authStore';
import { isBusinessFavorited, toggleFavoriteBusiness } from '../../../services/favorites.service';
import { emitCommEvent } from '@/communication';
import { iconForCategory } from '@/design-system/icons/icon-map';
import { isOnboardingPreview } from '@/utils/onboarding-preview';
import { cn } from '@/lib/utils';
import { STORE } from '@/utils/marketplace-copy';

function sectionDomId(label) {
  const slug = String(label || 'catalogo')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'catalogo';
  return `store-menu-${slug}`;
}

function matchesProductQuery(product, query) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = `${product.name || ''} ${product.description || ''} ${product.category || ''}`.toLowerCase();
  return hay.includes(q);
}

export default function BusinessPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const addItem = useCartStore((s) => s.addItem);
  const itemCount = useCartStore((s) => s.getItemCount());
  const cartSubtotal = useCartStore((s) => s.getSubtotal());
  const { catalog } = useCatalogLocation();
  const [activeCategoryId, setActiveCategoryId] = useState('todos');
  const [catalogQuery, setCatalogQuery] = useState('');
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [customizerProduct, setCustomizerProduct] = useState(null);
  const [customizerGroups, setCustomizerGroups] = useState([]);
  const [justAddedId, setJustAddedId] = useState(null);
  const [storeConflict, setStoreConflict] = useState(null);
  const pendingCartRetryRef = useRef(null);
  const categoryNavLockRef = useRef(0);
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
      if (!matchesProductQuery(product, catalogQuery)) continue;
      const key = product.category || 'Catálogo';
      if (!groups[key]) groups[key] = [];
      groups[key].push(product);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, 'es'));
  }, [products, catalogQuery]);

  const filteredProductCount = useMemo(
    () => menuSections.reduce((sum, [, items]) => sum + items.length, 0),
    [menuSections],
  );

  const popularProducts = useMemo(() => {
    if (products.length < 4) return [];
    const pool = catalogQuery
      ? products.filter((p) => matchesProductQuery(p, catalogQuery))
      : products;
    if (pool.length < 2) return [];
    return [...pool]
      .sort((a, b) => {
        const dealA = Number(a.compare_at_price) > Number(a.price) ? 1 : 0;
        const dealB = Number(b.compare_at_price) > Number(b.price) ? 1 : 0;
        if (dealB !== dealA) return dealB - dealA;
        return Number(a.price) - Number(b.price);
      })
      .slice(0, 4);
  }, [products, catalogQuery]);

  const dealProducts = useMemo(
    () => products
      .filter((p) => Number(p.compare_at_price) > Number(p.price))
      .filter((p) => matchesProductQuery(p, catalogQuery))
      .slice(0, 6),
    [products, catalogQuery],
  );

  const openNow = business ? isBusinessOpenNow(business) : false;
  const storeLive = business ? isBusinessStoreLive(business) : false;
  const coverage = business ? getBusinessCoverageForUser(business, catalog.viewMunicipio) : null;
  const canOrder = business ? isBusinessOrderableInCatalog(business, catalog) : false;
  const canPurchase = canOrder && openNow && storeLive;
  const storeActive = storeLive && openNow;
  const purchaseBlockReason = !storeLive
    ? 'No publicada'
    : !openNow
      ? 'Cerrado'
      : !canOrder
        ? (catalog?.mode === 'unknown' || !catalog?.viewMunicipio ? 'Elige tu zona' : 'Fuera de zona')
        : null;
  const etaMinutes = business ? getBusinessEtaMinutes(business) : 25;
  const cover = business ? resolveBusinessCover(business) : null;
  const logo = business ? resolveBusinessLogo(business) : null;
  const visualKey = business ? getBusinessVisualKey(business) : 'comida';
  const isPreview = business ? isOnboardingPreview(business) : false;
  const promoText = business ? formatBusinessPromoText(business) : null;
  const storeIcon = business ? iconForCategory(business.category) : 'store';
  const distanceLabel = business
    ? formatDistanceKm(business.distance_km ?? business.distanceKm) || 'Cerca de ti'
    : null;
  const menuNavSections = useMemo(() => {
    const cats = menuSections.map(([label, items]) => ({
      id: sectionDomId(label),
      label,
      count: items.length,
    }));
    return [
      { id: 'todos', label: 'Todos', count: filteredProductCount },
      ...cats,
    ];
  }, [menuSections, filteredProductCount]);

  const deliveryLabel = Number(business?.delivery_fee) > 0
    ? formatCOP(business.delivery_fee)
    : 'gratis';
  const minOrderLabel = Number(business?.min_order) > 0
    ? ` · Mín. ${formatCOP(business.min_order)}`
    : '';

  useEffect(() => {
    setActiveCategoryId('todos');
    setCatalogQuery('');
  }, [business?.id]);

  useEffect(() => {
    if (!menuSections.length) return undefined;
    const sectionIds = menuSections.map(([label]) => sectionDomId(label));
    const nodes = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!nodes.length) return undefined;

    let rafId = 0;
    let pendingId = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < categoryNavLockRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const nextId = visible[0]?.target?.id;
        if (!nextId) return;
        pendingId = nextId;
        if (rafId) return;
        rafId = window.requestAnimationFrame(() => {
          rafId = 0;
          if (!pendingId || Date.now() < categoryNavLockRef.current) return;
          setActiveCategoryId((current) => (current === pendingId ? current : pendingId));
          pendingId = null;
        });
      },
      { rootMargin: '-22% 0px -58% 0px', threshold: [0.2, 0.45] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [menuSections, filteredProductCount]);

  const handleSelectCategory = useCallback((id) => {
    setActiveCategoryId(id);
    categoryNavLockRef.current = Date.now() + 1200;
    const el = id === 'todos'
      ? document.getElementById(sectionDomId(menuSections[0]?.[0]))
      : document.getElementById(id);
    if (!el) {
      if (id === 'todos') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, [menuSections]);

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
      toast(
        catalog?.mode === 'unknown' || !catalog?.viewMunicipio
          ? 'Elige tu municipio para pedir en esta farmacia'
          : 'Esta tienda no cubre tu zona actual',
        'error',
      );
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
    <PageLayout
      title={false}
      backTo="/"
      maxWidth="store"
      contentClassName="!px-0"
      bottomPad
      stickyCheckout={itemCount > 0}
    >
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
                categoryFallback={business.category}
                visualKey={visualKey}
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
                <div className="flex items-end gap-3">
                  {logo ? (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/90 bg-white shadow-md sm:h-[4.5rem] sm:w-[4.5rem]">
                      <CatalogImage
                        src={logo}
                        emoji={storeIcon}
                        categoryFallback={business.category}
                        visualKey={visualKey}
                        alt={`Logo ${business.name}`}
                        rounded="none"
                        size="lg"
                        imgClassName="h-full w-full object-contain p-1"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    {isPreview ? (
                      <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                        <AppIcon name="verified" size={11} aria-hidden />
                        Preview
                      </span>
                    ) : null}
                    <h1 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                      {business.name.replace(/\s*·\s*Preview UrabApp\s*$/i, '')}
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
              </div>
            </div>

            <div className="store-page-content urab-page-stack w-full space-y-4 px-4 pb-8 pt-3 sm:px-5 lg:px-8 lg:pb-4">
              {isPreview ? <PreviewStoreBanner /> : null}

              <BusinessStoreAlerts
                business={business}
                catalog={catalog}
                canOrder={canOrder}
                openNow={openNow}
                storeLive={storeLive}
                promoText={null}
              />

              <div className="client-page-split client-page-split--store">
              <div className={cn('min-w-0 space-y-5', !storeActive && 'store-page-dimmed')}>
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

                <BusinessStoreProfile business={business} />

                {!storeActive && business.opens_at && business.closes_at && (
                  <p className="text-xs text-muted-foreground">
                    Horario: {formatBusinessHours(business)}
                  </p>
                )}

                {popularProducts.length > 0 && (
                  <section className="space-y-3" aria-labelledby="store-popular-title">
                    <h2 id="store-popular-title" className="urab-section-title">
                      Populares
                    </h2>
                    <div className="space-y-3">
                      {popularProducts.map((p) => (
                        <BusinessProductCard
                          key={`popular-${p.id}`}
                          product={p}
                          business={business}
                          coverFallback={cover}
                          canPurchase={canPurchase}
                          storeInactive={!storeActive}
                          blockReason={purchaseBlockReason}
                          justAdded={justAddedId === p.id}
                          featured
                          featuredLabel="Popular"
                          layout="list"
                          onAdd={() => handleAdd(p)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {dealProducts.length > 0 && (
                  <section className="space-y-3" aria-labelledby="store-offers-title">
                    <h2 id="store-offers-title" className="urab-section-title">
                      Ofertas
                    </h2>
                    <div className="space-y-3">
                      {dealProducts.map((p) => (
                        <BusinessProductCard
                          key={`deal-${p.id}`}
                          product={p}
                          business={business}
                          coverFallback={cover}
                          canPurchase={canPurchase}
                          storeInactive={!storeActive}
                          blockReason={purchaseBlockReason}
                          justAdded={justAddedId === p.id}
                          featured
                          featuredLabel="Oferta"
                          layout="list"
                          onAdd={() => handleAdd(p)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {products.length > 0 ? (
                  <div className="space-y-3">
                    <label className="store-catalog-search block">
                      <span className="sr-only">Buscar en el catálogo</span>
                      <span className="store-catalog-search__field">
                        <AppIcon name="search" size={16} className="shrink-0 text-muted-foreground" aria-hidden />
                        <input
                          type="search"
                          value={catalogQuery}
                          onChange={(e) => {
                            setCatalogQuery(e.target.value);
                            setActiveCategoryId('todos');
                          }}
                          placeholder={
                            business.category === 'farmacia'
                              ? 'Buscar medicamento o producto…'
                              : 'Buscar en el catálogo…'
                          }
                          className="store-catalog-search__input"
                          autoComplete="off"
                          enterKeyHint="search"
                        />
                        {catalogQuery ? (
                          <button
                            type="button"
                            className="store-catalog-search__clear"
                            aria-label="Limpiar búsqueda"
                            onClick={() => setCatalogQuery('')}
                          >
                            <AppIcon name="close" size={14} />
                          </button>
                        ) : null}
                      </span>
                    </label>
                    <StoreMenuNav
                      sections={menuNavSections}
                      activeId={activeCategoryId}
                      onSelect={handleSelectCategory}
                      storeActive={storeActive}
                    />
                  </div>
                ) : null}

                {products.length === 0 ? (
                  <SurfaceCard className="border-dashed py-10 text-center">
                    <AppIcon name={storeIcon} size="2xl" className="mx-auto text-muted-foreground" />
                    <p className="mt-3 font-semibold text-foreground">Catálogo en actualización</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Esta tienda aún no tiene productos publicados. Vuelve pronto.
                    </p>
                  </SurfaceCard>
                ) : filteredProductCount === 0 ? (
                  <SurfaceCard className="store-catalog-empty border-dashed py-8 text-center">
                    <AppIcon name="search" size="xl" className="mx-auto text-muted-foreground" />
                    <p className="mt-3 font-semibold text-foreground">Sin resultados</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      No hay productos que coincidan con “{catalogQuery.trim()}”.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setCatalogQuery('')}
                    >
                      Ver todo el catálogo
                    </Button>
                  </SurfaceCard>
                ) : (
                  menuSections.map(([sectionLabel, sectionItems]) => {
                    const sid = sectionDomId(sectionLabel);
                    return (
                      <section
                        key={sid}
                        id={sid}
                        className="store-menu-section space-y-3 scroll-mt-28"
                        aria-labelledby={`${sid}-title`}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <h2 id={`${sid}-title`} className="urab-section-title">
                            {sectionLabel}
                          </h2>
                          <span className="text-xs font-medium tabular-nums text-muted-foreground">
                            {sectionItems.length}
                          </span>
                        </div>
                        <div className="store-menu-grid">
                          {sectionItems.map((p) => (
                            <BusinessProductCard
                              key={p.id}
                              product={p}
                              business={business}
                              coverFallback={cover}
                              canPurchase={canPurchase}
                              storeInactive={!storeActive}
                              blockReason={purchaseBlockReason}
                              justAdded={justAddedId === p.id}
                              layout="grid"
                              onAdd={() => handleAdd(p)}
                            />
                          ))}
                        </div>
                      </section>
                    );
                  })
                )}

                <StoreTrustFooter
                  businessName={business.name.replace(/\s*·\s*Preview UrabApp\s*$/i, '')}
                />

              {isPreview ? (
                <section
                  className="space-y-3 rounded-2xl border border-primary/25 bg-primary/5 p-4"
                  aria-labelledby="activate-store-title"
                >
                  <h2 id="activate-store-title" className="urab-section-title">
                    Activa esta tienda en UrabApp
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Así verán tus clientes la vitrina en el celular. Actívala con tu logo oficial,
                    menú real y horarios para empezar a recibir pedidos.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link to="/info/registrar-comercio" className="flex-1">
                      <Button className="w-full min-h-11 font-bold">Quiero activar mi tienda</Button>
                    </Link>
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-11 flex-1 font-semibold"
                      onClick={() => openWhatsApp(
                        `Hola UrabApp, vi el preview de ${business.name.replace(/\s*·\s*Preview UrabApp\s*$/i, '')} y quiero activarlo.`,
                      )}
                    >
                      Hablar por WhatsApp
                    </Button>
                  </div>
                  <Link to="/vitrinas" className="block text-center text-xs font-semibold text-primary">
                    Ver todas las vitrinas de onboarding →
                  </Link>
                </section>
              ) : null}
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
