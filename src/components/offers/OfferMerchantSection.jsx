import { Link } from 'react-router-dom';
import CatalogImage from '@/components/ui/CatalogImage';
import { OfferCardHorizontal } from '@/components/offers/OfferCard';
import OfferBadge from '@/components/offers/OfferBadge';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import { formatBusinessPromoText } from '@/utils/promo';
import { cn } from '@/lib/utils';

function MerchantOfferRow({ offer, onOfferClick, className }) {
  return (
    <OfferCardHorizontal
      offer={offer}
      hidePrice
      className={cn('w-full', className)}
      onClick={onOfferClick}
    />
  );
}

function MerchantGroupCard({ group, onOfferClick, compact = false }) {
  const storeUrl = `/tienda/${group.slug || group.businessId}`;
  const primary = group.offers[0];
  const promoSummary = primary?.promoText || formatBusinessPromoText({
    promo_is_active: true,
    promo_discount_type: primary?.discountPercent ? 'percent' : 'fixed',
    promo_discount_value: primary?.discountPercent || primary?.discountFixed,
    promo_min_order: primary?.minOrder,
  });

  return (
    <article className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft">
      <Link to={storeUrl} className="flex items-center gap-3 border-b border-border/50 p-3 transition hover:bg-muted/30">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted/30">
          <CatalogImage
            src={group.imageUrl}
            emoji={group.emoji || '🏪'}
            alt=""
            rounded="xl"
            size="sm"
            className="h-full w-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-bold text-foreground">{group.name}</p>
          <p className="text-xs text-muted-foreground">
            {group.deliveryTime || 25} min
            {group.municipio ? ` · ${group.municipio}` : ''}
            {group.offers.length > 1 ? ` · ${group.offers.length} promos` : ''}
          </p>
        </div>
        {primary?.badge && <OfferBadge badge={primary.badge} />}
      </Link>

      <div className={cn('space-y-2 p-3', compact && 'p-2.5')}>
        {group.offers.map((offer) => (
          <MerchantOfferRow
            key={offer.id}
            offer={offer}
            onOfferClick={onOfferClick}
          />
        ))}
        {!compact && promoSummary && (
          <p className="text-[11px] font-medium text-primary">{promoSummary}</p>
        )}
      </div>
    </article>
  );
}

export default function OfferMerchantSection({
  groups = [],
  title = 'Ofertas por tienda',
  subtitle,
  aside,
  limit,
  onOfferClick,
  className,
  compact = false,
}) {
  const items = limit ? groups.slice(0, limit) : groups;
  if (!items.length) return null;

  return (
    <section className={cn('min-w-0', className)}>
      <HomeSectionHeader
        title={title}
        subtitle={subtitle || `${items.length} tienda${items.length === 1 ? '' : 's'} con promo activa`}
        aside={aside}
      />
      <div className="app-mobile-card-list">
        {items.map((group) => (
          <MerchantGroupCard
            key={group.businessId}
            group={group}
            onOfferClick={onOfferClick}
            compact={compact}
          />
        ))}
      </div>
    </section>
  );
}
