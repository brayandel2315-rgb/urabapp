import { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandWordmark from '@/components/brand/BrandWordmark';
import AppIcon from '@/design-system/icons/AppIcon';
import HomeMegaSearch from '@/modules/home/components/search/HomeMegaSearch';
import HomeMarketPulse from '@/modules/home/components/hero/HomeMarketPulse';
import { ClientHeaderAuthActions } from '@/components/layout/ClientHeaderAuthActions';
import { BRAND } from '@/utils/constants';
import HomeTypewriterServices from './HomeTypewriterServices';
import HomePersonalizedGreeting from './HomePersonalizedGreeting';

const HERO_BAG_TRANSPARENT = '/uraba/hero-delivery-bag-transparent.png';
const HERO_BAG_FALLBACK = '/uraba/hero-delivery-bag.png';

const HOME_QUICK_CHIPS = [
  { label: 'Hamburguesa', emoji: '🍔', query: 'Hamburguesa' },
  { label: 'Ibuprofeno', emoji: '💊', query: 'Ibuprofeno' },
  { label: 'Enviar paquete', emoji: '📦', query: 'Enviar paquete' },
  { label: 'Mercado', emoji: '🛒', query: 'Mercado' },
];

export default function HomeMobileUnifiedHero({
  user,
  profile,
  firstName,
  headerLocation,
  notificationCount = 0,
  onDetectLocation,
  onQuickSearch,
  viewMuni,
  openCount = 0,
  avgDeliveryMin,
  activeOrders,
}) {
  const [bagSrc, setBagSrc] = useState(HERO_BAG_TRANSPARENT);
  const [search, setSearch] = useState('');
  const bagFallback = bagSrc === HERO_BAG_FALLBACK;
  const hasPersonalGreeting = Boolean(user && firstName?.trim());

  return (
    <section className="home-mobile-hero" aria-label="Inicio Urabapp">
      <div className="home-mobile-hero__ambient" aria-hidden />

      <header className="home-mobile-hero__toolbar">
        <button
          type="button"
          onClick={onDetectLocation}
          className="home-mobile-hero__location"
        >
          <span className="home-mobile-hero__location-icon" aria-hidden>
            <AppIcon name="map" size={15} className="text-[#2E7D32]" />
          </span>
          <span className="home-mobile-hero__location-text truncate">{headerLocation}</span>
          <AppIcon name="chevronDown" size={13} className="shrink-0 text-[#6B7280]" />
        </button>

        <div className="home-mobile-hero__actions">
          <ClientHeaderAuthActions
            user={user}
            profile={profile}
            notificationCount={notificationCount}
            accountLabel="Perfil"
            buttonClassName="home-mobile-hero__action"
            showOnlineStatus
          />
        </div>
      </header>

      <div className="home-mobile-hero__headline">
        <div className="home-mobile-hero__banner">
          <div className="home-mobile-hero__banner-glow" aria-hidden />

          <div className="home-mobile-hero__brand-panel">
            <Link to="/" className="home-mobile-hero__wordmark-link" aria-label={BRAND.name}>
              <BrandWordmark size="hero" />
            </Link>

            {hasPersonalGreeting ? (
              <>
                <HomePersonalizedGreeting
                firstName={firstName}
                userId={user?.id}
                className="home-mobile-hero__welcome"
              />
                <HomeTypewriterServices className="home-mobile-hero__title" prefix="Pide ya tu" />
              </>
            ) : (
              <div className="home-mobile-hero__guest">
                <HomeTypewriterServices className="home-mobile-hero__title" prefix="Pide ya tu" />
                <p className="home-mobile-hero__tagline">{BRAND.homeHeroTagline}</p>
              </div>
            )}
          </div>
        </div>

        <img
          src={bagSrc}
          alt=""
          className={bagFallback ? 'home-mobile-hero__bag home-mobile-hero__bag--fallback' : 'home-mobile-hero__bag'}
          loading="eager"
          decoding="async"
          onError={() => setBagSrc(HERO_BAG_FALLBACK)}
        />

        <HomeMegaSearch
          query={search}
          onQueryChange={setSearch}
          municipio={viewMuni}
          userId={user?.id}
          variant="hero-mobile"
          sticky={false}
          className="home-mobile-hero__search"
        />
      </div>

      <div className="home-mobile-hero__tools">
        <div className="home-mobile-hero__chips" aria-label="Búsquedas rápidas">
          {HOME_QUICK_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => onQuickSearch(chip.query)}
              className="home-quick-chip"
            >
              <span aria-hidden>{chip.emoji}</span>
              {chip.label}
            </button>
          ))}
        </div>

        <HomeMarketPulse
          className="home-mobile-hero__pulse"
          municipio={viewMuni}
          openCount={openCount}
          avgDeliveryMin={avgDeliveryMin}
          activeOrders={activeOrders}
        />
      </div>
    </section>
  );
}
