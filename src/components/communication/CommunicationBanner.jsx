import { useNavigate } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { useCommunicationBannerStore } from '@/store/communicationBannerStore';
import { normalizeAppPath } from '@/utils/navigation';
import { cn } from '@/lib/utils';
import {
  resolveNotifKind,
  notifChipLabel,
  notifAccentClass,
  notifFallbackIcon,
} from '@/communication/notification-visuals';

export default function CommunicationBanner() {
  const navigate = useNavigate();
  const {
    visible,
    title,
    body,
    deepLink,
    imageUrl,
    logoUrl,
    kind: kindProp,
    stage,
    ctaLabel,
    dismiss,
  } = useCommunicationBannerStore();

  if (!visible || !title) return null;

  const href = normalizeAppPath(deepLink) || '/';
  const kind = resolveNotifKind({
    kind: kindProp,
    eventKey: kindProp === 'cart' ? 'cart_recovery' : undefined,
    stage,
  });
  const chip = notifChipLabel(kind, { stage });
  const iconName = notifFallbackIcon(kind);
  const actionLabel = ctaLabel
    || (kind === 'cart' ? 'Completar pedido' : 'Ver más');

  const open = () => {
    dismiss();
    navigate(href);
  };

  return (
    <div
      className={cn(
        'urabapp-notif urabapp-notif--banner relative z-40',
        notifAccentClass(kind),
      )}
      role="region"
      aria-label={title}
    >
      <button
        type="button"
        className="urabapp-notif__banner-hit"
        onClick={open}
        aria-label={`${title}. ${actionLabel}`}
      >
        <span className="urabapp-notif__media" aria-hidden>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="urabapp-notif__img"
              width={72}
              height={72}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="urabapp-notif__icon-fallback">
              <AppIcon name={iconName} size={20} />
            </span>
          )}
          {logoUrl && logoUrl !== imageUrl ? (
            <img
              src={logoUrl}
              alt=""
              className="urabapp-notif__logo-badge"
              width={28}
              height={28}
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </span>

        <span className="urabapp-notif__body">
          <span className="urabapp-notif__chip">{chip}</span>
          <span className="urabapp-notif__title">{title}</span>
          {body ? <span className="urabapp-notif__desc">{body}</span> : null}
          <span className="urabapp-notif__cta">{actionLabel} →</span>
        </span>
      </button>

      <button
        type="button"
        aria-label="Cerrar aviso"
        onClick={dismiss}
        className="urabapp-notif__close"
      >
        <AppIcon name="close" size="xs" />
      </button>
    </div>
  );
}
