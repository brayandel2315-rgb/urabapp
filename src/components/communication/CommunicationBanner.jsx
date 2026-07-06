import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { useCommunicationBannerStore } from '@/store/communicationBannerStore';

export default function CommunicationBanner() {
  const { visible, title, body, deepLink, dismiss } = useCommunicationBannerStore();

  if (!visible || !title) return null;

  return (
    <div className="relative z-40 border-b border-primary/20 bg-primary/10 px-4 py-2.5">
      <div className="mx-auto flex max-w-3xl items-start gap-3">
        <AppIcon name="bell" size="sm" className="mt-0.5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {body && <p className="text-xs text-muted-foreground">{body}</p>}
          {deepLink && (
            <Link to={deepLink} onClick={dismiss} className="mt-1 inline-block text-xs font-semibold text-primary">
              Ver más →
            </Link>
          )}
        </div>
        <button
          type="button"
          aria-label="Cerrar aviso"
          onClick={dismiss}
          className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
        >
          <AppIcon name="close" size="xs" />
        </button>
      </div>
    </div>
  );
}
