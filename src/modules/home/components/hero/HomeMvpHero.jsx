import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { tween } from '@/design-system/motion/presets';
import HomeHeroLocationChip from './HomeHeroLocationChip';
import HomeHeroDashboard from './HomeHeroDashboard';
import HomeTypewriterServices from './HomeTypewriterServices';
import HomePersonalizedGreeting from './HomePersonalizedGreeting';
import HomeMegaSearch from '../search/HomeMegaSearch';

export default function HomeMvpHero({
  municipio,
  catalog,
  pulse,
  search,
  onSearchChange,
  userId,
  onRefreshLocation,
  firstName,
}) {
  return (
    <section
      className="home-premium-hero relative min-h-0 overflow-hidden lg:min-h-[min(58vh,560px)]"
      aria-label="UrabApp — plataforma logística de Urabá"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'url(/uraba/hero-delivery-bag-transparent.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 6% center',
          backgroundSize: 'contain',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 85% 50%, rgba(102, 187, 106, 0.12) 0%, transparent 65%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col justify-center px-4 py-8 sm:px-[6%] sm:py-10 lg:min-h-0 lg:px-[8%] lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,58fr)_minmax(0,42fr)] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tween}
            className="min-w-0"
          >
            <HomeHeroLocationChip
              className="mb-4 !border-[#D9D9D9] !bg-white/90 !text-[#111111] hover:!bg-white [&_span]:!text-[#111111] [&_span:last-child]:!text-[#4B5563]"
              onRefreshLocation={onRefreshLocation}
            />

            {firstName ? (
              <div className="mb-1">
                <HomePersonalizedGreeting
                  firstName={firstName}
                  userId={userId}
                  className="home-personalized-greeting--desktop mb-3 max-w-md"
                />
                <HomeTypewriterServices
                  className="home-premium-hero__title mt-1 max-w-xl font-display text-[1.75rem] font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.15rem] lg:leading-[1.05]"
                />
              </div>
            ) : (
              <HomeTypewriterServices
                className="home-premium-hero__title max-w-xl font-display text-[1.75rem] font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.15rem] lg:leading-[1.05]"
              />
            )}

            <p className="home-premium-hero__lead mt-3 max-w-lg text-base leading-relaxed sm:text-lg">
              {catalog?.awayFromHome && catalog?.mode === 'away_blocked'
                ? `Estás en ${catalog.detected || 'otra zona'}. Activa envíos intermunicipales para pedir desde ${catalog.viewMunicipio || municipio}.`
                : 'Comida · Mercado · Farmacia · Mandados · Envíos · Intermunicipales y mucho más.'}
            </p>

            <div className="mt-6 sm:mt-7">
              <HomeMegaSearch
                query={search}
                onQueryChange={onSearchChange}
                municipio={municipio}
                userId={userId}
                variant="hero"
                sticky={false}
                className="!max-w-[1100px]"
              />
              <p className="mt-3 text-sm text-[#4B5563]">
                ¿Necesitas mandar algo?
                {' '}
                <Link to="/mandado" className="font-semibold text-[#2E7D32] underline-offset-2 hover:underline">
                  Ir a mensajería
                </Link>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...tween, delay: 0.1 }}
            className="hidden min-w-0 lg:block"
          >
            <HomeHeroDashboard pulse={pulse} municipio={municipio} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
