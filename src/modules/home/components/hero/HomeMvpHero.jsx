import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { tween } from '@/design-system/motion/presets';
import { HERO_BANNER_FALLBACK, HERO_BANNER_SRC } from '@/modules/home/constants/hero-banner';
import BrandLogo from '@/components/brand/BrandLogo';
import { BRAND } from '@/utils/constants';
import HomeHeroLocationChip from './HomeHeroLocationChip';
import HomePersonalizedGreeting from './HomePersonalizedGreeting';
import HomeMegaSearch from '../search/HomeMegaSearch';

export default function HomeMvpHero({
  municipio,
  catalog,
  search,
  onSearchChange,
  userId,
  onRefreshLocation,
  firstName,
}) {
  const [bannerSrc, setBannerSrc] = useState(HERO_BANNER_SRC);

  return (
    <section
      className="home-premium-hero relative min-h-0 overflow-hidden lg:min-h-[min(62vh,640px)]"
      aria-label="UrabApp — Todo Urabá, a un toque"
    >
      <div className="home-premium-hero__ambient" aria-hidden />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col justify-center px-4 py-8 sm:px-[6%] sm:py-10 lg:min-h-0 lg:px-[8%] lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link to="/" className="home-premium-hero__mark" aria-label={BRAND.name}>
            <BrandLogo variant="desktop-nav" className="home-premium-hero__mark-img" />
          </Link>
          <HomeHeroLocationChip
            className="home-premium-hero__location"
            onRefreshLocation={onRefreshLocation}
          />
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,54fr)_minmax(0,46fr)] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tween}
            className="flex min-w-0 flex-col"
          >
            {firstName ? (
              <HomePersonalizedGreeting
                firstName={firstName}
                userId={userId}
                className="home-personalized-greeting--desktop mb-3 max-w-md"
              />
            ) : null}

            <p className="home-premium-hero__brand-name" aria-hidden>
              <span className="home-premium-hero__brand-urab">URAB</span>
              <span className="home-premium-hero__brand-app">APP</span>
            </p>

            <h1 className="home-premium-hero__title">
              Todo Urabá,{' '}
              <span className="home-premium-hero__title-accent">a un toque.</span>
            </h1>

            <p className="home-premium-hero__lead">
              {catalog?.awayFromHome && catalog?.mode === 'away_blocked'
                ? `Estás en ${catalog.detected || 'otra zona'}. Activa envíos intermunicipales para pedir desde ${catalog.viewMunicipio || municipio}.`
                : BRAND.homeHeroLead}
            </p>

            <div className="home-premium-hero__search-block">
              <HomeMegaSearch
                query={search}
                onQueryChange={onSearchChange}
                municipio={municipio}
                userId={userId}
                variant="hero"
                sticky={false}
                className="home-premium-hero__search"
              />
              <p className="mt-3 text-sm text-[#6B7280]">
                ¿Necesitas mandar algo?
                {' '}
                <Link to="/mandado" className="font-semibold text-[#1E6F43] underline-offset-2 hover:underline">
                  Ir a mensajería
                </Link>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...tween, delay: 0.08 }}
            className="home-premium-hero__art-wrap hidden min-w-0 lg:flex"
            aria-hidden
          >
            <div className="home-premium-hero__art-glow" />
            <img
              src={bannerSrc}
              alt=""
              className="home-premium-hero__art"
              loading="eager"
              decoding="async"
              onError={() => setBannerSrc(HERO_BANNER_FALLBACK)}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
