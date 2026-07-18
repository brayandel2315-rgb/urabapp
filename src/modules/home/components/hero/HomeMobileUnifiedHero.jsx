import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HERO_BANNER_FALLBACK, HERO_BANNER_SRC } from '@/modules/home/constants/hero-banner';
import BrandWordmark from '@/components/brand/BrandWordmark';
import AppIcon from '@/design-system/icons/AppIcon';
import HomeMegaSearch from '@/modules/home/components/search/HomeMegaSearch';
import HomeMarketPulse from '@/modules/home/components/hero/HomeMarketPulse';
import { ClientHeaderAuthActions } from '@/components/layout/ClientHeaderAuthActions';
import { BRAND } from '@/utils/constants';
import HomeTypewriterServices from './HomeTypewriterServices';
import HomePersonalizedGreeting from './HomePersonalizedGreeting';

const HERO_BAG_SRC = HERO_BANNER_SRC;
const HERO_BAG_FALLBACK = HERO_BANNER_FALLBACK;

export default function HomeMobileUnifiedHero({
  user,
  profile,
  firstName,
  headerLocation,
  notificationCount = 0,
  onDetectLocation,
  viewMuni,
  openCount = 0,
  avgDeliveryMin,
  activeOrders,
}) {
  const [heroArtSrc, setHeroArtSrc] = useState(HERO_BAG_SRC);
  const [search, setSearch] = useState('');
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
            <AppIcon name="location" size={13} className="text-[#2E7D32]" />
          </span>
          <span className="home-mobile-hero__location-text">{headerLocation}</span>
          <AppIcon name="chevronDown" size={11} className="shrink-0 text-[#9CA3AF]" />
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
        <img
          src={heroArtSrc}
          alt=""
          className="home-mobile-hero__bag"
          loading="eager"
          decoding="async"
          onError={() => setHeroArtSrc(HERO_BAG_FALLBACK)}
        />

        <div className="home-mobile-hero__banner">
          <div className="home-mobile-hero__banner-glow" aria-hidden />

          <div className="home-mobile-hero__brand-panel">
            <Link to="/" className="home-mobile-hero__wordmark-link" aria-label={BRAND.name}>
              <BrandWordmark size="hero" />
            </Link>

            <HomeMarketPulse
              className="home-mobile-hero__pulse"
              municipio={viewMuni}
              openCount={openCount}
              avgDeliveryMin={avgDeliveryMin}
              activeOrders={activeOrders}
              variant="hero"
            />

            {hasPersonalGreeting ? (
              <div className="home-mobile-hero__user-copy">
                <HomePersonalizedGreeting
                  firstName={firstName}
                  userId={user?.id}
                  className="home-mobile-hero__welcome"
                />
                <HomeTypewriterServices className="home-mobile-hero__title" prefix="Pide ya tu" />
              </div>
            ) : (
              <div className="home-mobile-hero__guest">
                <HomeTypewriterServices className="home-mobile-hero__title" prefix="Pide ya tu" />
                <p className="home-mobile-hero__tagline">{BRAND.homeHeroTagline}</p>
              </div>
            )}

          </div>
        </div>

        <div className="home-mobile-hero__search-block">
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
      </div>
    </section>
  );
}
