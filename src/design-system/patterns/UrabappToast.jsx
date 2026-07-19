import { useNavigate } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';
import { toast as sonnerToast } from 'sonner';
import {
  resolveNotifKind,
  notifChipLabel,
  notifAccentClass,
  notifFallbackIcon,
} from '@/communication/notification-visuals';

const TYPE_TO_KIND = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  trust: 'order',
  order: 'order',
  cart: 'cart',
  tracking: 'tracking',
};

/**
 * Toast comunicativo — foto del pedido + logo tienda, tap para abrir/cerrar.
 */
export function UrabappToast({
  toastId,
  title,
  description,
  type = 'info',
  trust,
  action,
  image,
  logo,
  href,
  kind: kindProp,
  stage,
  category,
  eventKey,
  eventType,
}) {
  const navigate = useNavigate();
  const kind = resolveNotifKind({
    kind: kindProp || TYPE_TO_KIND[type],
    type,
    category,
    eventKey,
    stage,
  });
  const chip = notifChipLabel(kind, { category, stage, eventType })
    || trust
    || 'Urabapp';
  const iconName = notifFallbackIcon(kind, category);
  const canNavigate = Boolean(href);

  const dismiss = () => sonnerToast.dismiss(toastId);

  const handlePrimary = () => {
    dismiss();
    if (canNavigate) {
      navigate(href);
      return;
    }
    action?.onClick?.();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'urabapp-notif urabapp-notif--toast pointer-events-auto',
        notifAccentClass(kind),
      )}
      onClick={handlePrimary}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePrimary();
        }
      }}
      tabIndex={0}
    >
      <div className="urabapp-notif__media" aria-hidden>
        {image ? (
          <img
            src={image}
            alt=""
            className="urabapp-notif__img"
            width={72}
            height={72}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.parentElement?.querySelector('.urabapp-notif__icon-fallback');
              if (fallback) fallback.hidden = false;
            }}
          />
        ) : null}
        <span className="urabapp-notif__icon-fallback" hidden={Boolean(image)}>
          <AppIcon name={iconName} size={22} />
        </span>
        {logo && logo !== image ? (
          <img
            src={logo}
            alt=""
            className="urabapp-notif__logo-badge"
            width={28}
            height={28}
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>

      <div className="urabapp-notif__body">
        <p className="urabapp-notif__chip">{chip}</p>
        <p className="urabapp-notif__title">{title}</p>
        {description ? <p className="urabapp-notif__desc">{description}</p> : null}
        {(action?.label || canNavigate) && (
          <span className="urabapp-notif__cta">
            {action?.label || (canNavigate ? 'Ver pedido' : 'Cerrar')}
          </span>
        )}
      </div>

      <button
        type="button"
        className="urabapp-notif__close"
        aria-label="Cerrar"
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
      >
        <AppIcon name="close" size="xs" />
      </button>
    </div>
  );
}
