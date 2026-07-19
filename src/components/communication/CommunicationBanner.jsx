import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { useCommunicationBannerStore } from '@/store/communicationBannerStore';
import { normalizeAppPath } from '@/utils/navigation';
import { cn } from '@/lib/utils';

export default function CommunicationBanner() {
  const { visible, title, body, deepLink, dismiss } = useCommunicationBannerStore();

  if (!visible || !title) return null;

  const href = normalizeAppPath(deepLink) || '/';
  const isCart = typeof deepLink === 'string'
    && (deepLink.includes('/carrito') || deepLink.includes('/tienda/'));

  return (
    <div
      className={cn(
        'relative z-40 border-b px-4 py-3',
        isCart
          ? 'border-primary/30 bg-primary text-primary-foreground'
          : 'border-primary/20 bg-primary/10',
      )}
    >
      <div className="mx-auto flex max-w-3xl items-start gap-3">
        <AppIcon
          name="cart"
          size="sm"
          className={cn('mt-0.5 shrink-0', isCart ? 'text-white' : 'text-primary')}
        />
        <div className="min-w-0 flex-1">
          <p className={cn('text-sm font-bold', isCart ? 'text-white' : 'text-foreground')}>
            {title}
          </p>
          {body && (
            <p className={cn('text-xs', isCart ? 'text-white/90' : 'text-muted-foreground')}>
              {body}
            </p>
          )}
          {deepLink && (
            <Link
              to={href}
              onClick={dismiss}
              className={cn(
                'mt-2 inline-flex min-h-9 items-center rounded-xl px-3 text-xs font-bold',
                isCart
                  ? 'bg-white text-primary'
                  : 'bg-primary text-primary-foreground',
              )}
            >
              {isCart ? 'Completar pedido →' : 'Ver más →'}
            </Link>
          )}
        </div>
        <button
          type="button"
          aria-label="Cerrar aviso"
          onClick={dismiss}
          className={cn(
            'rounded-lg p-1',
            isCart ? 'text-white/80 hover:bg-white/15' : 'text-muted-foreground hover:bg-muted',
          )}
        >
          <AppIcon name="close" size="xs" />
        </button>
      </div>
    </div>
  );
}
