import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HERO_BANNER_FALLBACK, HERO_BANNER_SRC } from '@/modules/home/constants/hero-banner';
import BrandLogo from '@/components/brand/BrandLogo';
import AppIcon from '@/design-system/icons/AppIcon';
import HomeMegaSearch from '@/modules/home/components/search/HomeMegaSearch';
import { ClientHeaderAuthActions } from '@/components/layout/ClientHeaderAuthActions';
import { BRAND } from '@/utils/constants';
import HomePersonalizedGreeting from './HomePersonalizedGreeting';

export default function HomeMobileUnifiedHero({
  user,
  profile,
  firstName,
  headerLocation,
  notificationCount = 0,
  onDetectLocation,
  viewMuni,
}) {
  const [heroArtSrc, setHeroArtSrc] = useState(HERO_BANNER_SRC);
  const [search, setSearch] = useState('');
  const hasPersonalGreeting = Boolean(user && firstName?.trim());

  return (
    <section className="home-mobile-hero" aria-label="Inicio Urabapp">
      <div className="home-mobile-hero__ambient" aria-hidden />

      <header className="home-mobile-hero__toolbar">
        <Link to="/" className="home-mobile-hero__mark" aria-label={BRAND.name}>
          <BrandLogo variant="nav" className="home-mobile-hero__mark-img" />
        </Link>

        <button
          type="button"
          onClick={onDetectLocation}
          className="home-mobile-hero__location"
        >
          <span className="home-mobile-hero__location-icon" aria-hidden>
            <AppIcon name="location" size={13} className="text-[var(--brand-primary)]" />
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
        <div className="home-mobile-hero__copy">
          {hasPersonalGreeting ? (
            <HomePersonalizedGreeting
              firstName={firstName}
              userId={user?.id}
              className="home-mobile-hero__welcome"
            />
          ) : null}

          <p className="home-mobile-hero__brand-name" aria-hidden>
            <span className="home-mobile-hero__brand-urab">URAB</span>
            <span className="home-mobile-hero__brand-app">APP</span>
          </p>

          <h1 className="home-mobile-hero__title">
            Todo Urabá,{' '}
            <span className="home-mobile-hero__title-accent">a un toque.</span>
          </h1>

          <p className="home-mobile-hero__lead">
            {BRAND.homeHeroLead}
          </p>
        </div>

        <img
          src={heroArtSrc}
          alt=""
          className="home-mobile-hero__art"
          loading="eager"
          decoding="async"
          onError={() => setHeroArtSrc(HERO_BANNER_FALLBACK)}
        />
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
    </section>
  );
}
