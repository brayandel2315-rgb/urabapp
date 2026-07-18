import { useMemo, useState } from 'react';
import HomeMvpHero from './components/hero/HomeMvpHero';
import HomeDiscoveryCategoryGrid from './components/categories/HomeDiscoveryCategoryGrid';
import HomePromotionsStrip from './components/discovery/HomePromotionsStrip';
import HomeOpenStoresSection from './components/discovery/HomeOpenStoresSection';
import HomePopularProductsRow from './components/discovery/HomePopularProductsRow';
import HomeOrderAgainRow from './components/discovery/HomeOrderAgainRow';
import HomeLiveTrustStrip from './components/discovery/HomeLiveTrustStrip';
import HomeTrendingChips from './components/trending/HomeTrendingChips';
import HomeCatalogAwayBanner from './components/catalog/HomeCatalogAwayBanner';
import HomeIntermunicipalBlock from './components/shipment/HomeIntermunicipalBlock';
import HomeDesktopFooter from './components/footer/HomeDesktopFooter';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import ClientActiveOrderBanner from '@/modules/client/components/ClientActiveOrderBanner';
import { getContextualOpenStoresCopy } from './utils/home-context';

export default function HomeDesktopView({
  user,
  firstName,
  viewMuni,
  homeMunicipio,
  catalog,
  outsideCoverage,
  noLocalBusinesses,
  discovery,
  discoveryLoading,
  topRestaurants,
  hasPromos,
  openNow,
  pulse,
  myActiveOrders,
  onDetect,
  onEnableIntermunicipal,
  onCategoryNavigate,
  onTrending,
  onPopularProduct,
}) {
  const [search, setSearch] = useState('');
  const stores = topRestaurants;
  const showAwayBanner = catalog?.awayFromHome || catalog?.mode === 'out_of_coverage';
  const liveActiveOrders = user ? myActiveOrders : (pulse?.activeOrders ?? 0);
  const openStoresCopy = useMemo(
    () => getContextualOpenStoresCopy(outsideCoverage ? homeMunicipio : viewMuni),
    [outsideCoverage, homeMunicipio, viewMuni],
  );

  return (
    <div className="home-desktop min-h-0 w-full">
      <HomeMvpHero
        municipio={viewMuni}
        catalog={catalog}
        search={search}
        onSearchChange={setSearch}
        userId={user?.id}
        onRefreshLocation={onDetect}
        firstName={firstName}
        openCount={openNow}
        avgDeliveryMin={pulse?.avgDeliveryMin}
        activeOrders={liveActiveOrders}
      />

      <div className="home-desktop__body">
        <div className="home-desktop__section">
          <HomeLiveTrustStrip
            openCount={openNow}
            avgDeliveryMin={pulse?.avgDeliveryMin}
            activeOrders={liveActiveOrders}
          />
        </div>

        {user && (
          <div className="home-desktop__section">
            <ClientActiveOrderBanner />
          </div>
        )}

        {user && (
          <div className="home-desktop__section">
            <HomeOrderAgainRow userId={user.id} />
          </div>
        )}

        {showAwayBanner && (
          <HomeCatalogAwayBanner
            catalog={catalog}
            onEnableIntermunicipal={onEnableIntermunicipal}
            onRefreshLocation={onDetect}
          />
        )}

        <section className="home-desktop__section">
          <HomeDiscoveryCategoryGrid onNavigate={onCategoryNavigate} />
        </section>

        <section className="home-desktop__section">
          <HomeOpenStoresSection
            municipio={outsideCoverage ? homeMunicipio : viewMuni}
            openNow={openNow}
            businesses={stores}
            isLoading={discoveryLoading && stores.length === 0}
            title={openStoresCopy.title}
            subtitle={openStoresCopy.subtitle}
            emptyMessage={
              openNow === 0 && !noLocalBusinesses
                ? 'Ninguna tienda está abierta en este momento. Vuelve en su horario o usa mensajería.'
                : noLocalBusinesses
                  ? 'Activa envíos intermunicipales para ver tiendas que lleguen a tu ubicación.'
                  : 'Pronto habrá más tiendas en tu zona.'
            }
            variant="desktop"
          />
        </section>

        {(hasPromos || discoveryLoading) && (
          <section className="home-desktop__section">
            <HomePromotionsStrip
              promotions={discovery?.promotions ?? []}
              promotionsByMerchant={discovery?.promotionsByMerchant ?? []}
              isLoading={discoveryLoading}
              municipio={viewMuni}
            />
          </section>
        )}

        <HomePopularProductsRow
          products={discovery?.popularProducts ?? []}
          isLoading={discoveryLoading}
          municipio={viewMuni}
          onProductClick={onPopularProduct}
        />

        {(discovery?.trending?.length ?? 0) > 0 && (
          <section className="home-desktop__section">
            <HomeSectionHeader
              title="Búsquedas frecuentes"
              subtitle="Lo que más buscan en Urabá hoy"
              variant="brand"
            />
            <HomeTrendingChips
              chips={discovery?.trending ?? []}
              onSelect={onTrending}
            />
          </section>
        )}

        <section className="home-desktop__section">
          <HomeIntermunicipalBlock originMunicipio={outsideCoverage ? homeMunicipio : viewMuni} />
        </section>
      </div>

      <HomeDesktopFooter />
    </div>
  );
}
