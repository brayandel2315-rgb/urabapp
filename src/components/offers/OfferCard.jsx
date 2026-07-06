import { Link } from 'react-router-dom';
import CatalogImage from '@/components/ui/CatalogImage';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import OfferBadge from './OfferBadge';
import OfferCountdown from './OfferCountdown';
import { formatCOP } from '@/utils/currency';
import { CARD_SHELL, CARD_INTERACTIVE, IMAGE_ASPECT } from '@/design-system/patterns/commerce-card-tokens';
import { cn } from '@/lib/utils';

function OfferActions({ offer, saved, onSave, onShare, compact }) {
  if (offer.isWelcome || offer.isBanner) return null;
  return (
    <div className={cn('flex items-center gap-1', compact ? 'mt-2' : 'mt-3')}>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave?.(offer); }}
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors',
          saved ? 'bg-rose-500/15 text-rose-600' : 'bg-muted/80 text-muted-foreground hover:bg-primary/10 hover:text-primary'
        )}
        aria-label={saved ? 'Quitar de favoritos' : 'Guardar oferta'}
      >
        <AppIcon name="star" size="xs" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onShare?.(offer); }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:bg-primary/10 hover:text-primary"
        aria-label="Compartir oferta"
      >
        <AppIcon name="link" size="xs" />
      </button>
    </div>
  );
}

function PriceBlock({ offer, size = 'md' }) {
  if (offer.isWelcome) return null;
  const sm = size === 'sm';
  return (
    <div className="mt-2 flex flex-wrap items-baseline gap-2">
      {offer.originalPrice > offer.offerPrice && (
        <span className={cn('text-muted-foreground line-through', sm ? 'text-xs' : 'text-sm')}>
          {formatCOP(offer.originalPrice)}
        </span>
      )}
      <span className={cn('font-black text-primary', sm ? 'text-base' : 'text-lg')}>
        {formatCOP(offer.offerPrice || offer.originalPrice)}
      </span>
      {offer.savings > 0 && (
        <span className={cn('font-bold text-emerald-600', sm ? 'text-[10px]' : 'text-xs')}>
          Ahorras {formatCOP(offer.savings)}
        </span>
      )}
    </div>
  );
}

export function OfferCardHero({ offer, onClick, onSave, saved, onShare }) {
  const to = offer.link || (offer.slug ? `/tienda/${offer.slug}` : '/ofertas');
  const inner = (
    <article className={cn(CARD_SHELL, 'relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden')}>
      <div className="absolute inset-0">
        <CatalogImage src={offer.imageUrl} emoji={offer.emoji} alt="" rounded="none" size="lg" className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="relative p-5 on-media">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <OfferBadge badge={offer.badge} />
          {offer.isFlash && <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold">FLASH</span>}
        </div>
        <h3 className="text-heading text-2xl leading-tight text-white drop-shadow-sm">{offer.title}</h3>
        {offer.subtitle && <p className="mt-1 text-sm text-white/90 line-clamp-2 drop-shadow-sm">{offer.subtitle}</p>}
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <OfferCountdown
            endsAt={offer.endsAt}
            className="[&_p]:!text-white [&_p:last-child]:text-emerald-300"
          />
          <div className="flex items-center gap-2">
            <OfferActions offer={offer} saved={saved} onSave={onSave} onShare={onShare} compact />
            <Button size="sm" className="shadow-lg">{offer.ctaLabel || 'Pedir ahora'}</Button>
          </div>
        </div>
      </div>
    </article>
  );

  if (offer.isWelcome || to.startsWith('/cuenta/perfil') || to.startsWith('/perfil')) {
    return <Link to={to} onClick={() => onClick?.(offer)} className="block">{inner}</Link>;
  }
  return <Link to={to} onClick={() => onClick?.(offer)} className="block">{inner}</Link>;
}

export function OfferCardFeatured({ offer, onSave, saved, onShare, onClick }) {
  const to = `/tienda/${offer.slug || offer.businessId}`;
  return (
    <Link to={to} onClick={() => onClick?.(offer)} className={cn(CARD_SHELL, CARD_INTERACTIVE, 'flex h-full flex-col')}>
      <div className={cn('relative', IMAGE_ASPECT)}>
        <CatalogImage src={offer.imageUrl} emoji={offer.emoji} alt={offer.name} rounded="none" size="md" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          <OfferBadge badge={offer.badge} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="line-clamp-1 text-sm font-bold text-foreground">{offer.name}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{offer.promoText || offer.subtitle}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {offer.distanceKm != null ? `${offer.distanceKm.toFixed(1)} km · ` : ''}
          {offer.deliveryTime} min
        </p>
        <PriceBlock offer={offer} size="sm" />
        <OfferActions offer={offer} saved={saved} onSave={onSave} onShare={onShare} compact />
      </div>
    </Link>
  );
}

export function OfferCardHorizontal({ offer, onClick, hidePrice = false, className }) {
  const to = `/tienda/${offer.slug || offer.businessId}`;
  return (
    <Link
      to={to}
      onClick={() => onClick?.(offer)}
      className={cn(
        CARD_SHELL,
        CARD_INTERACTIVE,
        'flex h-full w-full min-w-0 gap-3 p-3',
        className,
      )}
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted/30">
        <CatalogImage src={offer.imageUrl} emoji={offer.emoji} alt="" rounded="xl" size="sm" className="h-full w-full" />
        <div className="absolute left-1 top-1"><OfferBadge badge={offer.badge} /></div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 font-bold text-sm">{offer.name}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{offer.promoText || offer.subtitle}</p>
        <p className="mt-1 text-[11px] font-semibold text-primary">{offer.deliveryTime} min · {formatCOP(offer.deliveryFee)} dom.</p>
        {!hidePrice && <PriceBlock offer={offer} size="sm" />}
      </div>
    </Link>
  );
}

export function OfferCardFlash({ offer, onExpire, onClick }) {
  const to = `/tienda/${offer.slug || offer.businessId}`;
  return (
    <Link
      to={to}
      onClick={() => onClick?.(offer)}
      className="block w-full min-w-0 snap-start overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-rose-500 to-primary p-4 text-white shadow-lg ring-1 ring-white/20 md:min-w-[260px] md:shrink-0"
    >
      <div className="flex items-start justify-between gap-2">
        <OfferBadge badge="EXPIRA_HOY" />
        <OfferCountdown endsAt={offer.endsAt} compact onExpire={onExpire} className="[&_p:last-child]:text-white" />
      </div>
      <p className="mt-3 text-lg font-black leading-tight">{offer.title || offer.name}</p>
      <p className="mt-1 text-sm text-white/90">{offer.promoText}</p>
      <p className="mt-3 text-xs font-bold uppercase tracking-wide opacity-90">{offer.ctaLabel || 'Comprar rápido →'}</p>
    </Link>
  );
}

export function OfferCardBundle({ offer, onClick }) {
  const to = `/tienda/${offer.slug || offer.businessId}`;
  return (
    <Link to={to} onClick={() => onClick?.(offer)} className={cn(CARD_SHELL, CARD_INTERACTIVE, 'p-4')}>
      <p className="text-xs font-bold uppercase tracking-wide text-primary">Combo</p>
      <p className="text-subheading mt-1">{offer.bundleItems?.join(' · ')}</p>
      <p className="mt-2 text-2xl font-black text-primary">{offer.discountPercent}% OFF</p>
      <p className="mt-1 text-sm text-muted-foreground">{offer.name}</p>
    </Link>
  );
}
