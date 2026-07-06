import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Button } from '@/design-system/ui/button';
import { getMunicipioHeroProfile, URABA_HERO_IMAGES } from '@/utils/uraba-images';
import AppIcon from '@/design-system/icons/AppIcon';
import { HOME_TRUST_SIGNALS } from '../../constants/home-categories';
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
  onExplore,
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
      className="home-premium-hero relative min-h-0 overflow-hidden border-b border-white/10 lg:min-h-[min(72vh,680px)]"
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
          background: 'linear-gradient(180deg, rgba(13,43,69,.9) 0%, rgba(13,43,69,.78) 55%, rgba(14,107,168,.55) 100%)',
        }}
        aria-hidden
      />
      <div className="hero-noise pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 backdrop-blur-[2px]" aria-hidden />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col justify-center px-4 py-8 sm:px-[6%] sm:py-10 lg:min-h-0 lg:px-[8%] lg:py-12">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tween}
            className="min-w-0"
          >
            <HomeHeroLocationChip className="mb-5" onRefreshLocation={onRefreshLocation} />

            <h1 className="home-premium-hero__title max-w-xl font-display text-[1.75rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.75rem] lg:leading-[1.05]">
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

            <p className="home-premium-hero__lead mt-4 max-w-lg text-base leading-snug sm:text-lg lg:line-clamp-2">
              {catalog?.awayFromHome && catalog?.mode === 'away_blocked'
                ? `Estás en ${catalog.detected || 'otra zona'}. Activa envíos intermunicipales para pedir desde ${catalog.viewMunicipio || municipio}.`
                : 'Compra, envía y descubre negocios disponibles para tu zona.'}
            </p>

            <ul className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2" aria-label="Beneficios">
              {HOME_TRUST_SIGNALS.map((s) => (
                <li
                  key={s.id}
                  className="inline-flex items-center gap-1 rounded-[16px] border border-white/15 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md sm:rounded-[20px] sm:px-3 sm:py-2 sm:text-xs"
                >
                  <AppIcon name={s.icon} size="xs" className="text-emerald-200" />
                  {s.label}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-3">
              <Button
                size="lg"
                className="h-12 rounded-2xl px-6 text-sm font-bold shadow-lift sm:h-[60px] sm:rounded-[20px] sm:px-8 sm:text-base"
                onClick={onExplore}
              >
                Explorar
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-2xl border-white/30 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-md hover:bg-white/20 sm:h-[60px] sm:rounded-[20px] sm:px-8 sm:text-base"
              >
                <Link to="/mandado">Enviar paquete</Link>
              </Button>
            </div>

            <div className="mt-5 sm:mt-8">
              <HomeMegaSearch
                query={search}
                onQueryChange={onSearchChange}
                municipio={municipio}
                userId={userId}
                variant="hero"
                sticky={false}
                className="!max-w-[1100px]"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...tween, delay: 0.12 }}
            className="hidden min-w-0 lg:block lg:pt-4"
          >
            <HomeHeroDashboard pulse={pulse} municipio={municipio} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
