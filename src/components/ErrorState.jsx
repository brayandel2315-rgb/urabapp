import { PageState, RetryButton } from '@/design-system/patterns/PageState';

export default function ErrorState({ title = 'No pudimos cargar esto', description, onRetry }) {
  return (
    <PageState
      type="error"
      title={title}
      description={description || 'Revisa tu conexión e intenta de nuevo.'}
      action={onRetry ? <RetryButton onClick={onRetry} /> : null}
    />
  );
}
