import { Link } from 'react-router-dom';
import { CLIENT_SEARCH } from '@/app/clientNav';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { CATEGORIES } from '@/utils/constants';
import { getCategoryRoute } from '@/data/category-catalog';
import UrabaHeroBackdrop from './UrabaHeroBackdrop';
import UrabaHeroCard from './UrabaHeroCard';
import UrabaHighwayStrip from './UrabaHighwayStrip';
import { URABA_HERO_IMAGES } from '@/utils/uraba-brand';

export default function UrabaLandingHero() {
  return (
    <>
      {/* Mobile */}
      <UrabaHeroBackdrop className="lg:hidden" image={URABA_HERO_IMAGES.primary}>
        <div className="h-28 sm:h-36" aria-hidden />
        <div className="uraba-hero-sheet rounded-t-[1.75rem] bg-background px-4 pb-8 pt-6 shadow-[0_-12px_40px_rgba(15,31,53,0.12)]">
          <p className="text-tagline">Urabá, Antioquia</p>
          <h1 className="text-heading mt-2 text-[1.75rem] leading-[1.15] sm:text-3xl">
            Delivery hecho para tu región
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Comida, tiendas y envíos entre municipios. De Necoclí a Chigorodó, en una sola app.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link to={CLIENT_SEARCH}>
              <Button className="w-full py-3.5 text-base">Explorar y pedir</Button>
            </Link>
            <Link to="/soporte">
              <Button variant="outline" className="w-full py-3.5 text-base">
                Centro de soporte
              </Button>
            </Link>
          </div>
        </div>
      </UrabaHeroBackdrop>

      {/* Desktop */}
      <UrabaHeroBackdrop className="hidden lg:block" image={URABA_HERO_IMAGES.primary}>
        <div className="app-container grid items-center gap-10 py-16 lg:grid-cols-2">
          <UrabaHeroCard>
            <p className="text-tagline">Urabá, Antioquia</p>
            <h1 className="text-heading mt-3 text-5xl leading-tight xl:text-6xl">
              Delivery hecho para tu región
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
              Comercios locales, mensajeros de acá y soporte en la app. La troncal une Necoclí, Turbo, Apartadó, Carepa y Chigorodó.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={CLIENT_SEARCH}>
                <Button size="lg">Explorar y pedir</Button>
              </Link>
              <Link to="/soporte">
                <Button size="lg" variant="outline">
                  Soporte
                </Button>
              </Link>
            </div>
          </UrabaHeroCard>

          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.filter((c) => !c.comingSoon).slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                to={getCategoryRoute(cat.id) || `${CLIENT_SEARCH}?category=${cat.id}`}
                className="group rounded-2xl border border-border/60 bg-background/95 p-5 shadow-card backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                {cat.tagline && (
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">{cat.tagline}</p>
                )}
                <AppIcon name={cat.icon} size="lg" className="mt-1 text-primary" />
                <p className="text-subheading mt-2 text-base">{cat.name}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{cat.description}</p>
                <p className="mt-2 text-xs font-bold text-primary opacity-80 transition-opacity group-hover:opacity-100">
                  {cat.cta} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </UrabaHeroBackdrop>

      <section className="border-b border-border bg-surface">
        <div className="app-container py-4">
          <UrabaHighwayStrip activeMunicipio="Apartadó" compact variant="surface" />
        </div>
      </section>
    </>
  );
}
