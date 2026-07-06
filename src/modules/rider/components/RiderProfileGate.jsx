import Button from '@/components/ui/Button';
import { PageState } from '@/design-system/patterns/PageState';
import { useMyDriverProfile } from '@/hooks/useMyDriverProfile';
import RiderJoinHero from './RiderJoinHero';

export function renderRiderProfileGate(
  query,
  {
    missing,
    compactMissing = false,
    loadingTitle = 'Cargando tu panel de repartidor…',
    requireDriver = true,
  } = {},
) {
  const {
    data: driver,
    isLoading,
    isError,
    refetch,
    error,
    isFetched,
    fetchStatus,
  } = query;

  const isInitialLoad = isLoading || (fetchStatus === 'fetching' && !isFetched);

  if (isInitialLoad) {
    return (
      <PageState
        type="loading"
        title={loadingTitle}
        description="Un momento, estamos conectando con tu cuenta."
      />
    );
  }

  if (isError) {
    return (
      <PageState
        type="retry"
        title="No pudimos cargar tu perfil"
        description={error?.message || 'Revisa tu conexión e intenta de nuevo.'}
        action={(
          <Button type="button" onClick={() => refetch()}>
            Reintentar
          </Button>
        )}
      />
    );
  }

  if (requireDriver && !driver) {
    return missing ?? <RiderJoinHero compact={compactMissing} />;
  }

  return null;
}

/**
 * Evita spinner infinito al cargar perfil de mensajero.
 */
export default function RiderProfileGate({
  children,
  missing,
  compactMissing = false,
  loadingTitle = 'Cargando tu panel de repartidor…',
}) {
  const query = useMyDriverProfile();
  const blocked = renderRiderProfileGate(query, { missing, compactMissing, loadingTitle });
  if (blocked) return blocked;

  if (typeof children === 'function') {
    return children(query.data);
  }

  return children;
}
