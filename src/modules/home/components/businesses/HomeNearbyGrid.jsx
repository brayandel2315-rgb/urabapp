import { Link } from 'react-router-dom';
import BusinessCard from '@/components/BusinessCard';
import ErrorState from '@/components/ErrorState';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import { PageState } from '@/design-system/patterns/PageState';
import Button from '@/components/ui/Button';
import { STORE } from '@/utils/marketplace-copy';

function NearbySkeleton() {
  return (
    <div className="app-responsive-catalog">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-56 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}

export default function HomeNearbyGrid({
  businesses,
  isLoading,
  isError,
  refetch,
  municipio,
  barrio,
  catalog,
  onEnableIntermunicipal,
  title = STORE.nearby,
}) {
  const awayBlocked = catalog?.mode === 'away_blocked';
  const interOnly = catalog?.mode === 'intermunicipal_only';

  const emptyState = awayBlocked ? (
    <PageState
      type="empty"
      icon="map"
      title={STORE.emptyIn(catalog.detected)}
      description={`Estás fuera de ${catalog.home}. Las tiendas locales de tu municipio no entregan ahí. Activa envíos intermunicipales o cotiza un envío.`}
      action={(
        <div className="flex flex-wrap justify-center gap-2">
          <Button type="button" size="sm" onClick={onEnableIntermunicipal}>
            Ver envíos intermunicipales
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/envios">Cotizar envío</Link>
          </Button>
        </div>
      )}
      className="py-10"
    />
  ) : (
    <PageState
      type="empty"
      icon="store"
      title={STORE.emptyHere}
      description={interOnly
        ? 'No hay tiendas intermunicipales disponibles para tu ubicación ahora.'
        : 'Prueba otro barrio o pide un mandado personalizado.'}
      action={(
        <Button asChild size="sm">
          <Link to="/mandado">Pedir mandado</Link>
        </Button>
      )}
      className="py-10"
    />
  );

  return (
    <section aria-labelledby="home-nearby-title" className="min-w-0">
      <HomeSectionHeader
        id="home-nearby-title"
        title={interOnly ? 'Envíos intermunicipales' : title}
        subtitle={
          awayBlocked
            ? `Fuera de ${catalog.home}`
            : barrio
              ? `En ${barrio}, ${municipio}`
              : interOnly
                ? `Hacia ${municipio}`
                : STORE.nearbyOf(municipio)
        }
      />
      {isLoading ? (
        <NearbySkeleton />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : businesses?.length ? (
        <div className="app-responsive-catalog">
          {businesses.map((b, i) => (
            <BusinessCard
              key={b.id}
              business={b}
              layout="grid"
              imageLoading={i < 3 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
      ) : (
        emptyState
      )}
    </section>
  );
}