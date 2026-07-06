import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { PageState } from '@/design-system/patterns/PageState';
import { STORE } from '@/utils/marketplace-copy';

export function OffersEmptyState() {
  return (
    <PageState
      type="empty"
      icon="tag"
      title="Sin ofertas por ahora"
      description="No hay promociones activas en tu zona. Vuelve pronto o explora el catálogo completo."
      action={(
        <Link to="/">
          <Button>{STORE.explore}</Button>
        </Link>
      )}
    />
  );
}

export function OffersErrorState({ onRetry }) {
  return (
    <PageState
      type="error"
      title="No pudimos cargar las ofertas"
      description="Revisa tu conexión e intenta de nuevo."
      action={<Button onClick={onRetry}>Reintentar</Button>}
    />
  );
}

export function OffersOfflineState() {
  return (
    <PageState
      type="offline"
      title="Sin conexión"
      description="Conéctate a internet para ver ofertas actualizadas."
    />
  );
}
