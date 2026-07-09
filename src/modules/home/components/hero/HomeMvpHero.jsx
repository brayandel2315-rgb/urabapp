import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { getMunicipioHeroProfile, URABA_HERO_IMAGES } from '@/utils/uraba-images';
import { tween } from '@/design-system/motion/presets';
import HomeHeroLocationChip from './HomeHeroLocationChip';
import HomeHeroDashboard from './HomeHeroDashboard';
import HomeMegaSearch from '../search/HomeMegaSearch';

function resolveHeroImage(municipio) {
  const profile = getMunicipioHeroProfile(municipio);
  if (profile.image?.includes('Turbouraba')) {
    return URABA_HERO_IMAGES.commerce;
  }
  return profile.image || URABA_HERO_IMAGES.commerce;
}

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
  const sectionRef = useRef(null);
  const heroImage = resolveHeroImage(municipio);
  const profile = getMunicipioHeroProfile(municipio);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <section
      ref={sectionRef}
      className="home-premium-hero relative min-h-0 overflow-hidden border-b border-white/10 lg:min-h-[min(62vh,600px)]"
      aria-label="UrabApp — pedir en tu zona"
    >
      <motion.div className="absolute inset-0 scale-105" style={{ y: bgY }}>
        <img
          src={heroImage}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: profile.objectPosition || 'center 40%' }}
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(13,43,69,.92) 0%, rgba(13,43,69,.82) 60%, rgba(14,107,168,.5) 100%)',
        }}
        aria-hidden
      />
      <div className="hero-noise pointer-events-none absolute inset-0 opacity-[0.2]" aria-hidden />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col justify-center px-4 py-8 sm:px-[6%] sm:py-10 lg:min-h-0 lg:px-[8%] lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,58fr)_minmax(0,42fr)] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tween}
            className="min-w-0"
          >
            <HomeHeroLocationChip className="mb-4" onRefreshLocation={onRefreshLocation} />

            <h1 className="home-premium-hero__title max-w-xl font-display text-[1.75rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
              {firstName ? (
                <>
                  {firstName}, todo Urabá
                  <br />
                  a tu puerta
                </>
              ) : (
                <>
                  Todo Urabá,
                  <br />
                  más cerca de ti
                </>
              )}
            </h1>

            <p className="home-premium-hero__lead mt-3 max-w-lg text-base leading-relaxed sm:text-lg">
              {catalog?.awayFromHome && catalog?.mode === 'away_blocked'
                ? `Estás en ${catalog.detected || 'otra zona'}. Activa envíos intermunicipales para pedir desde ${catalog.viewMunicipio || municipio}.`
                : 'Busca tiendas, pide a domicilio o envía un paquete. Todo desde un solo lugar.'}
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
              <p className="mt-3 text-sm text-white/75">
                ¿Necesitas mandar algo?
                {' '}
                <Link to="/mandado" className="font-semibold text-white underline-offset-2 hover:underline">
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
