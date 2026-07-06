import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import PromoBannerCard from '@/components/marketplace/PromoBannerCard';
import HomeTrustStrip from '@/modules/client/components/HomeTrustStrip';
import { MunicipioHeroBackdrop } from './UrabaHeroBackdrop';
import UrabaHeroCard from './UrabaHeroCard';
import UrabaBarrioPicker from './UrabaBarrioPicker';
import { useAutoLocation } from '@/hooks/useAutoLocation';
import { BRAND, ECONOMICS } from '@/utils/constants';
import { getMunicipioHeroPlace } from '@/utils/uraba-brand';
import { formatCOP } from '@/utils/currency';
import { STORE } from '@/utils/marketplace-copy';

export default function UrabaHomeHero({
  greeting,
  firstName,
  municipio,
  barrio,
  onBarrioChange,
  occupiedBarrios,
  headline,
  search,
  onSearchChange,
  banners = [],
  routeSample,
}) {
  const heroPlace = getMunicipioHeroPlace(municipio);
  const { detect, locationStatus } = useAutoLocation({ auto: false });

  return (
    <>
      <MunicipioHeroBackdrop municipio={municipio} className="border-b border-border">
        <div className="app-container grid items-end gap-6 py-6 sm:gap-8 sm:py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:py-10">
          <UrabaHeroCard className="min-w-0">
            <p className="text-tagline">
              {greeting}
              {firstName ? `, ${firstName}` : ''} · Urabá
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => detect()}
                disabled={locationStatus === 'pending'}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-background/90 px-3 py-1.5 text-xs font-semibold"
              >
                <AppIcon name="location" size="xs" className="text-primary" />
                {municipio}
              </button>
              {onBarrioChange && (
                <UrabaBarrioPicker
                  municipio={municipio}
                  value={barrio}
                  onChange={onBarrioChange}
                  variant="default"
                  occupiedBarrios={occupiedBarrios}
                />
              )}
            </div>
            <h1 className="text-heading mt-4 text-2xl leading-tight sm:text-3xl lg:text-4xl xl:text-[2.75rem]">
              {headline}
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
              {heroPlace} · {STORE.many} de tu municipio con entrega local. {BRAND.tagline}
            </p>
            <div className="search-bar--hero mt-5 border-primary/20 bg-background/90 sm:mt-6 lg:hidden">
              <AppIcon name="search" size="sm" className="text-primary" />
              <input
                type="search"
                value={search}
                onChange={onSearchChange}
                placeholder="¿Qué quieres pedir hoy?"
                className="w-full bg-transparent text-base font-semibold text-foreground outline-none placeholder:font-medium placeholder:text-muted-foreground"
              />
            </div>
            <p className="mt-2 text-[11px] font-medium text-muted-foreground sm:hidden">
              Domicilio desde {formatCOP(ECONOMICS.defaultDeliveryFee)} · pagas al recibir
            </p>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
              <Link to="/soporte">
                <Button size="sm" className="sm:size-default">Soporte</Button>
              </Link>
              {routeSample && (
                <Link to="/envios">
                  <Button variant="outline" size="sm" className="sm:size-default">
                    {routeSample.from} ↔ {routeSample.to}
                  </Button>
                </Link>
              )}
            </div>
          </UrabaHeroCard>

          <div className="grid min-w-0 grid-cols-2 gap-2 pb-1 sm:gap-3 lg:gap-4 lg:pb-2">
            {banners.slice(0, 2).map((b, i) => (
              <PromoBannerCard key={b.id} banner={b} index={i} className="min-w-0 w-full" />
            ))}
          </div>
        </div>
      </MunicipioHeroBackdrop>

      <section className="border-b border-border bg-surface">
        <div className="app-container py-3">
          <HomeTrustStrip />
        </div>
      </section>
    </>
  );
}
