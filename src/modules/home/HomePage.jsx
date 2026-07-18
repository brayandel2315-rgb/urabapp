import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import HomeIntermunicipalBlock from './components/shipment/HomeIntermunicipalBlock';
import { useLocationStore, selectActiveBarrio } from '@/store/locationStore';
import { useAuthStore } from '@/store/authStore';
import { useAutoLocation } from '@/hooks/useAutoLocation';
import { useCatalogLocation } from '@/hooks/useCatalogLocation';
import { getHomeDiscovery, getHomeDiscoveryPlaceholder } from '@/services/discovery.service';
import { useHomeAnalytics } from './hooks/useHomeAnalytics';
import HomeCategoryRail from './components/categories/HomeCategoryRail';
import HomeCatalogAwayBanner from './components/catalog/HomeCatalogAwayBanner';
import HomeOpenStoresSection from './components/discovery/HomeOpenStoresSection';
import HomePromotionsStrip from './components/discovery/HomePromotionsStrip';
import HomePopularProductsRow from './components/discovery/HomePopularProductsRow';
import HomeMobileUnifiedHero from './components/hero/HomeMobileUnifiedHero';
import HomeOrderAgainRow from './components/discovery/HomeOrderAgainRow';
import HomeLiveTrustStrip from './components/discovery/HomeLiveTrustStrip';
import ClientActiveOrderBanner from '@/modules/client/components/ClientActiveOrderBanner';
import { useClientActivity } from '@/hooks/useClientActivity';
import { useCommunicationBadge } from '@/hooks/useCommunicationBadge';
import { getContextualOpenStoresCopy } from './utils/home-context';
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
  const communicationBadge = useCommunicationBadge(user?.id);

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
  const topRestaurants = featuredBusinesses.slice(0, 16);

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
  const liveActiveOrders = user ? myActiveOrders : (pulse?.activeOrders ?? 0);
  const openStoresCopy = getContextualOpenStoresCopy(outsideCoverage ? homeMunicipio : viewMuni);

  return (
    <>
      <div className="w-full min-w-0 mobile-app-bg lg:hidden">
        <div className="app-container space-y-7 pb-4 pt-0 sm:space-y-7 sm:pb-6">
          <HomeMobileUnifiedHero
            user={user}
            profile={profile}
            firstName={firstName}
            headerLocation={headerLocation}
            notificationCount={communicationBadge}
            onDetectLocation={detect}
            viewMuni={viewMuni}
            openCount={openNow}
            avgDeliveryMin={pulse?.avgDeliveryMin}
            activeOrders={liveActiveOrders}
          />

          <HomeLiveTrustStrip
            openCount={openNow}
            avgDeliveryMin={pulse?.avgDeliveryMin}
            activeOrders={liveActiveOrders}
          />

          {user && <ClientActiveOrderBanner />}

          {user && <HomeOrderAgainRow userId={user.id} />}

          {showAwayBanner && (
            <HomeCatalogAwayBanner
              catalog={catalog}
              onEnableIntermunicipal={setIntermunicipalCatalog}
              onRefreshLocation={detect}
            />
          )}

          <HomeCategoryRail onNavigate={handleCategoryNavigate} variant="mobile" />

          <HomeOpenStoresSection
            municipio={outsideCoverage ? homeMunicipio : viewMuni}
            openNow={openNow}
            businesses={topRestaurants}
            isLoading={discoveryLoading && topRestaurants.length === 0}
            title={openStoresCopy.title}
            subtitle={openStoresCopy.subtitle}
            emptyMessage={
              openNow === 0 && !noLocalBusinesses
                ? 'Ninguna tienda está abierta en este momento. Vuelve en su horario o usa el botón de servicios.'
                : noLocalBusinesses
                  ? 'Activa envíos intermunicipales para ver tiendas que lleguen a tu ubicación.'
                  : 'Pronto habrá más tiendas en tu zona.'
            }
            variant="mobile"
          />

          {(hasPromos || discoveryLoading) && (
            <HomePromotionsStrip
              promotions={discovery?.promotions ?? []}
              promotionsByMerchant={discovery?.promotionsByMerchant ?? []}
              isLoading={discoveryLoading}
              municipio={viewMuni}
            />
          )}

          <HomePopularProductsRow
            products={popularProducts}
            isLoading={discoveryLoading}
            municipio={viewMuni}
            onProductClick={handlePopularProduct}
          />

          <HomeIntermunicipalBlock originMunicipio={viewMuni} />
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
