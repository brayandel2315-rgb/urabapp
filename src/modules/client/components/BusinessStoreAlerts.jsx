import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';
import { getBusinessOpenState, formatBusinessHours } from '@/utils/schedule';
import { STORE } from '@/utils/marketplace-copy';

const TONE_STYLES = {
  warning: {
    wrap: 'border-amber-200/90 bg-amber-50',
    icon: 'bg-amber-100 text-amber-700',
    title: 'text-amber-950',
    body: 'text-amber-800',
  },
  info: {
    wrap: 'border-sky-200/90 bg-sky-50',
    icon: 'bg-sky-100 text-sky-700',
    title: 'text-sky-950',
    body: 'text-sky-800',
  },
  neutral: {
    wrap: 'border-[#D8E2EC] bg-white',
    icon: 'bg-[#E6F4FF] text-[#0E6BA8]',
    title: 'text-[#0D2B45]',
    body: 'text-[#4A6278]',
  },
  promo: {
    wrap: 'border-primary/25 bg-gradient-to-r from-primary to-emerald-600',
    icon: 'bg-white/20 text-white',
    title: 'text-white',
    body: 'text-white/90',
  },
};

function StoreNotice({ tone = 'neutral', icon, title, children, action }) {
  const styles = TONE_STYLES[tone] || TONE_STYLES.neutral;

  return (
    <div
      className={cn(
        'flex w-full gap-3 rounded-xl border px-3.5 py-3',
        styles.wrap,
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          styles.icon,
        )}
      >
        <AppIcon name={icon} size="sm" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn('font-display text-sm font-bold leading-snug', styles.title)}>{title}</p>
        {children && (
          <div className={cn('mt-1 text-sm leading-relaxed', styles.body)}>{children}</div>
        )}
        {action}
      </div>
    </div>
  );
}

export default function BusinessStoreAlerts({
  business,
  catalog,
  canOrder,
  openNow,
  storeLive,
  promoText,
  className,
}) {
  const openState = business ? getBusinessOpenState(business) : null;
  const isAway = catalog?.awayFromHome && catalog?.mode === 'away_blocked';
  const isUnknown = catalog?.mode === 'unknown';

  const notices = [];

  if (!canOrder && business) {
    notices.push(
      <StoreNotice
        key="coverage"
        tone={isUnknown ? 'warning' : 'info'}
        icon="map"
        title={
          isUnknown
            ? 'Activa tu ubicación para pedir'
            : isAway
              ? 'Estás lejos de esta tienda'
              : 'Sin cobertura en tu zona'
        }
      >
        <p>
          {isUnknown
            ? 'Puedes ver el catálogo. Para comprar, permite GPS o elige tu municipio en inicio.'
            : isAway
              ? `Estás en ${catalog.detected || 'otra zona'} y ${business.name} opera en ${business.municipio}.`
              : `${business.name} en ${business.municipio} no entrega a ${catalog.viewMunicipio || 'tu ubicación'}.`}
        </p>
        <Link to="/" className="mt-2 inline-block text-xs font-bold underline opacity-90">
          {STORE.browseNearby}
        </Link>
      </StoreNotice>,
    );
  }

  if (business && !storeLive) {
    notices.push(
      <StoreNotice key="prep" tone="warning" icon="alert" title="Tienda en preparación">
        Puedes ver el catálogo; los pedidos se habilitan cuando la tienda esté verificada.
      </StoreNotice>,
    );
  }

  if (business && !openNow && storeLive) {
    const hours = formatBusinessHours(business);
    const hasHours = business.opens_at && business.closes_at;
    notices.push(
      <StoreNotice key="closed" tone="neutral" icon="pending" title="Cerrado por horario">
        <p>Puedes explorar el menú y volver cuando abra.</p>
        {hasHours && (
          <p className="mt-1.5 text-xs font-semibold text-[#0E6BA8]">
            Horario: {hours}
          </p>
        )}
        {openState?.hint && !hasHours && (
          <p className="mt-1 text-xs">{openState.hint}</p>
        )}
      </StoreNotice>,
    );
  }

  if (promoText && notices.length === 0) {
    notices.push(
      <StoreNotice key="promo" tone="promo" icon="tag" title="Promo activa">
        {promoText}
      </StoreNotice>,
    );
  }

  if (!notices.length) return null;

  const visible = notices.slice(0, 1);

  return (
    <div className={cn('store-page-alerts flex w-full flex-col gap-3', className)}>
      {visible}
    </div>
  );
}
