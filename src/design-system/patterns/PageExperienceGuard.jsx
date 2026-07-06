import { PageState, PageLoader, RetryButton } from '@/design-system/patterns/PageState';

/**
 * Estados de red/carga unificados — patrón CX para toda el área cliente.
 */
export default function PageExperienceGuard({
  online = true,
  isLoading = false,
  isError = false,
  onRetry,
  children,
  loadingRows = 4,
  offlineDescription = 'Conéctate a internet para continuar.',
  errorDescription = 'No pudimos cargar la información. Intenta de nuevo.',
  empty,
}) {
  if (!online) {
    return (
      <PageState
        type="offline"
        title="Sin conexión"
        description={offlineDescription}
        action={onRetry ? <RetryButton onClick={onRetry} /> : null}
      />
    );
  }

  if (isLoading) {
    return <PageLoader rows={loadingRows} />;
  }

  if (isError) {
    return (
      <PageState
        type="error"
        title="Algo salió mal"
        description={errorDescription}
        action={onRetry ? <RetryButton onClick={onRetry} /> : null}
      />
    );
  }

  if (empty) return empty;

  return children;
}
