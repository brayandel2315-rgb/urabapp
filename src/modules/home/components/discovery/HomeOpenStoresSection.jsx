import { Link } from 'react-router-dom';
import BusinessCard from '@/components/BusinessCard';
import AppIcon from '@/design-system/icons/AppIcon';
import { usePausedCarousel } from '@/hooks/usePausedCarousel';
import { STORE } from '@/utils/marketplace-copy';

function OpenStoresSkeleton({ variant = 'mobile' }) {
  const itemClass = variant === 'desktop'
    ? 'home-open-stores__carousel-item home-open-stores__carousel-item--desktop'
    : 'home-open-stores__carousel-item';

  return (
    <div className="home-open-stores__carousel" aria-hidden>
      {Array.from({ length: variant === 'desktop' ? 6 : 4 }).map((_, i) => (
        <div key={i} className={itemClass}>
          <div className={`home-store-tile home-store-tile--skeleton animate-pulse ${variant === 'desktop' ? 'home-store-tile--desktop' : ''}`}>
            <div className="home-store-tile__media bg-[#EFEFEF]" />
            <div className="home-store-tile__body space-y-2">
              <div className="h-3.5 w-full rounded bg-[#EFEFEF]" />
              <div className="h-2.5 w-2/3 rounded bg-[#F7F7F7]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OpenStoresCarousel({
  items,
  variant = 'mobile',
  ariaLabel,
}) {
  const { ref, pause, resume, onScroll } = usePausedCarousel({
    itemCount: items.length,
    intervalMs: variant === 'desktop' ? 4200 : 3800,
    enabled: items.length > 1,
  });

  return (
    <div
      ref={ref}
      className="home-open-stores__carousel"
      aria-label={ariaLabel}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onScroll={onScroll}
    >
      {items.map((business, i) => (
        <div
          key={business.id}
          className={variant === 'desktop'
            ? 'home-open-stores__carousel-item home-open-stores__carousel-item--desktop'
            : 'home-open-stores__carousel-item'}
        >
          <BusinessCard
            business={business}
            layout="store-tile"
            imageLoading={i < 3 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
    </div>
  );
}

export default function HomeOpenStoresSection({
  municipio,
  openNow = 0,
  businesses = [],
  isLoading = false,
  emptyMessage,
  variant = 'mobile',
  limit = variant === 'desktop' ? 24 : 12,
}) {
  const items = businesses.slice(0, limit);

  if (!isLoading && items.length === 0 && !emptyMessage) {
    return null;
  }

  const subtitle = openNow > 0
    ? STORE.openNowSubtitle
    : items.length > 0
      ? STORE.openNowSubtitleClosed
      : STORE.openNowSubtitleFallback;

  return (
    <section
      className={variant === 'desktop' ? 'home-open-stores home-open-stores--desktop' : 'home-open-stores'}
      aria-labelledby="home-open-stores-title"
    >
      <header className="home-open-stores__header">
        <div className="home-open-stores__heading">
          <p className="home-open-stores__eyebrow">
            <span className="home-open-stores__live-dot" aria-hidden />
            {STORE.openNowEyebrow}
          </p>
          <div className="home-open-stores__title-row">
            <h2 id="home-open-stores-title" className="home-open-stores__title">
              {STORE.openNowTitle(municipio)}
            </h2>
            {openNow > 0 && (
              <span className="home-open-stores__count" aria-label={STORE.openNowCount(openNow)}>
                {openNow}
              </span>
            )}
          </div>
          <p className="home-open-stores__subtitle">{subtitle}</p>
        </div>

        <Link
          to="/restaurantes"
          className={variant === 'desktop' ? 'home-desktop-cta' : 'home-open-stores__cta'}
        >
          {variant === 'desktop' ? (
            <>
              Ver todas las tiendas
              <AppIcon name="back" size={14} className="rotate-180" />
            </>
          ) : (
            'Ver todos'
          )}
        </Link>
      </header>

      {isLoading ? (
        <OpenStoresSkeleton variant={variant} />
      ) : items.length > 0 ? (
        <OpenStoresCarousel
          items={items}
          variant={variant}
          ariaLabel={`Tiendas abiertas en ${municipio}`}
        />
      ) : emptyMessage ? (
        <div className="home-open-stores__empty">
          <p>{emptyMessage}</p>
        </div>
      ) : null}
    </section>
  );
}
