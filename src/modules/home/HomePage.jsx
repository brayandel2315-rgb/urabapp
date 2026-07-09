import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useLocationStore, selectActiveBarrio } from '@/store/locationStore';
import { useAuthStore } from '@/store/authStore';
import { useAutoLocation } from '@/hooks/useAutoLocation';
import { useCatalogLocation } from '@/hooks/useCatalogLocation';
import { getHomeDiscovery, getHomeDiscoveryPlaceholder } from '@/services/discovery.service';
import { useHomeAnalytics } from './hooks/useHomeAnalytics';
import HomeCategoryRail from './components/categories/HomeCategoryRail';
import HomeCatalogAwayBanner from './components/catalog/HomeCatalogAwayBanner';
import HomeFeaturedRow from './components/discovery/HomeFeaturedRow';
import HomePromotionsStrip from './components/discovery/HomePromotionsStrip';
import HomePopularProductsRow from './components/discovery/HomePopularProductsRow';
import HomeTrendingChips from './components/trending/HomeTrendingChips';
import HomeMarketPulse from './components/hero/HomeMarketPulse';
import HomeFeedbackCard from './components/feedback/HomeFeedbackCard';
import AppIcon from '@/design-system/icons/AppIcon';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import ClientActiveOrderBanner from '@/modules/client/components/ClientActiveOrderBanner';
import BusinessCard from '@/components/BusinessCard';
import { useClientActivity } from '@/hooks/useClientActivity';
import { STORE } from '@/utils/marketplace-copy';
import HomeDesktopView from './HomeDesktopView';

export default function HomeMvpPage() {
  const navigate = useNavigate();
  const { profile, user } = useAuthStore();
  const barrio = useLocationStore(selectActiveBarrio);
  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);
  const coords = latitude != null && longitude != null ? { latitude, longitude } : null;
  const {
    catalog,
    activeMunicipio,
    homeMunicipio,
    detectedMunicipio,
    intermunicipalCatalog,
    getBusinessesParams,
    setIntermunicipalCatalog,
  } = useCatalogLocation();
  const { detect } = useAutoLocation({ auto: false });
  const { trackCategory, trackConversion } = useHomeAnalytics(user?.id, activeMunicipio);
  const { activeCount: myActiveOrders } = useClientActivity({ enabled: !!user?.id });

  const noLocalBusinesses = catalog.noLocalBusinesses;
  const outsideCoverage = catalog.outsideCoverage;
  const viewMuni = catalog.viewMunicipio || homeMunicipio;

  const { data: discovery, isError, isFetching } = useQuery({
    queryKey: [
      'home-discovery',
      homeMunicipio,
      detectedMunicipio,
      intermunicipalCatalog,
      catalog.mode,
      barrio,
      user?.id,
    ],
    queryFn: () => getHomeDiscovery({
      municipio: homeMunicipio,
      barrio,
      userId: user?.id,
      profile,
      catalog,
      getBusinessesParams,
      coords,
    }),
    placeholderData: () => getHomeDiscoveryPlaceholder(homeMunicipio),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });

  const featuredBusinesses = discovery?.featured ?? [];
  const discoveryLoading = isFetching && featuredBusinesses.length === 0 && !isError;
  const hasPromos = (discovery?.promotionsByMerchant?.length ?? 0) > 0 || (discovery?.promotions?.length ?? 0) > 0;
  const popularProducts = discovery?.popularProducts ?? [];
  const topRestaurants = featuredBusinesses.slice(0, 8);

  const headerLocation = useMemo(() => {
    if (catalog?.viewMunicipio && catalog?.viewMunicipio !== 'Apartadó') {
      return `${catalog.viewMunicipio}, Urabá`;
    }
    return `${catalog?.viewMunicipio || activeMunicipio || 'Apartadó'}, Antioquia`;
  }, [catalog?.viewMunicipio, activeMunicipio]);

  const handleTrending = useCallback((chip) => {
    trackConversion('trending_chip', { chip });
    navigate(`/search?q=${encodeURIComponent(chip)}`);
  }, [navigate, trackConversion]);

  const handlePopularProduct = useCallback((product) => {
    trackConversion('popular_product_click', {
      productId: product.id,
      businessId: product.businessId,
      orderCount: product.orderCount,
    });
  }, [trackConversion]);

  const handleCategoryNavigate = useCallback((catId) => {
    trackCategory(catId);
  }, [trackCategory]);

  const stats = discovery?.stats;
  const pulse = stats ? {
    activeOrders: stats.activeOrders,
    avgDeliveryMin: stats.avgDeliveryMin,
    avgBizDelivery: stats.avgBizDelivery,
    openBusinessesCount: stats.openBusinessesCount ?? 0,
    totalBusinessesCount: stats.totalBusinessesCount ?? 0,
    ordersToday: stats.ordersToday,
    shipmentsToday: stats.shipmentsToday,
    businessPromos: discovery?.promotions,
  } : null;

  const firstName = profile?.full_name?.trim().split(/\s+/)[0];
  const openNow = stats?.openBusinessesCount ?? 0;
  const showAwayBanner = catalog?.awayFromHome || catalog?.mode === 'out_of_coverage';

  return (
    <>
      <div className="w-full min-w-0 mobile-app-bg lg:hidden">
        <div className="app-container space-y-6 py-4 sm:py-5">
          <section className="home-hero-card">
            <button
              type="button"
              onClick={detect}
              className="home-location-chip"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#4A6278]">
                Entregar en
              </span>
              <span className="flex min-w-0 items-center gap-1.5 text-[#0D2B45]">
                <AppIcon name="map" size={16} className="shrink-0 text-[#0E6BA8]" />
                <span className="truncate font-semibold">{headerLocation}</span>
                <AppIcon name="chevronDown" size={14} className="shrink-0 text-[#4A6278]" />
              </span>
            </button>

            <h1 className="mt-3 font-display text-xl font-black leading-tight text-[#0D2B45] sm:text-2xl">
              {user && firstName
                ? `${firstName}, ¿qué pedimos hoy?`
                : `Lo mejor de ${viewMuni}, a tu puerta`}
            </h1>

            <HomeMarketPulse
              className="mt-2"
              municipio={viewMuni}
              openCount={openNow}
              avgDeliveryMin={pulse?.avgDeliveryMin}
              activeOrders={user ? myActiveOrders : pulse?.activeOrders}
            />
          </section>

          {user && <ClientActiveOrderBanner />}

          {showAwayBanner && (
            <HomeCatalogAwayBanner
              catalog={catalog}
              onEnableIntermunicipal={setIntermunicipalCatalog}
              onRefreshLocation={detect}
            />
          )}

          <section className="space-y-3">
            <HomeSectionHeader
              title={`Abiertos en ${outsideCoverage ? homeMunicipio : viewMuni}`}
              subtitle={
                openNow > 0
                  ? STORE.readyCount(openNow)
                  : topRestaurants.length > 0
                    ? 'Hay tiendas en tu zona, pero ninguna abierta ahora'
                    : 'Entrega local con seguimiento en vivo'
              }
              variant="brand"
              aside={(
                <Link to="/restaurantes" className="home-cta-link">
                  Ver todos
                </Link>
              )}
            />

            {topRestaurants.length > 0 ? (
              <div className="home-store-carousel">
                {topRestaurants.map((business, i) => (
                  <div key={business.id} className="home-store-carousel__item">
                    <BusinessCard
                      business={business}
                      layout="compact"
                      rank={i < 3 ? i + 1 : undefined}
                      imageLoading={i < 2 ? 'eager' : 'lazy'}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <HomeFeaturedRow
                businesses={featuredBusinesses}
                isLoading={discoveryLoading}
                municipio={outsideCoverage ? homeMunicipio : viewMuni}
                emptyMessage={openNow === 0 && !noLocalBusinesses
                  ? 'Ninguna tienda está abierta en este momento. Vuelve en su horario o usa el botón de servicios.'
                  : noLocalBusinesses
                    ? 'Activa envíos intermunicipales para ver tiendas que lleguen a tu ubicación.'
                    : 'Pronto habrá más tiendas en tu zona.'}
              />
            )}
          </section>

          {(hasPromos || discoveryLoading) && (
            <HomePromotionsStrip
              promotions={discovery?.promotions ?? []}
              promotionsByMerchant={discovery?.promotionsByMerchant ?? []}
              isLoading={discoveryLoading}
              municipio={viewMuni}
            />
          )}

          <HomeCategoryRail onNavigate={handleCategoryNavigate} variant="mobile" />

          <HomePopularProductsRow
            products={popularProducts}
            isLoading={discoveryLoading}
            municipio={viewMuni}
            onProductClick={handlePopularProduct}
          />

          {(discovery?.trending?.length ?? 0) > 0 && (
            <section className="home-surface-card">
              <HomeTrendingChips
                compact
                chips={discovery?.trending ?? []}
                onSelect={handleTrending}
              />
            </section>
          )}

          <HomeFeedbackCard deferUntilVisit={2} />
        </div>
      </div>

      <div className="hidden lg:block">
        <HomeDesktopView
          user={user}
          firstName={firstName}
          viewMuni={viewMuni}
          homeMunicipio={homeMunicipio}
          headerLocation={headerLocation}
          catalog={catalog}
          outsideCoverage={outsideCoverage}
          noLocalBusinesses={noLocalBusinesses}
          discovery={discovery}
          discoveryLoading={discoveryLoading}
          featuredBusinesses={featuredBusinesses}
          topRestaurants={topRestaurants}
          hasPromos={hasPromos}
          openNow={openNow}
          pulse={pulse}
          myActiveOrders={myActiveOrders}
          onDetect={detect}
          onEnableIntermunicipal={setIntermunicipalCatalog}
          onCategoryNavigate={handleCategoryNavigate}
          onTrending={handleTrending}
          onPopularProduct={handlePopularProduct}
        />
      </div>
    </>
  );
}
