import { Badge } from '@/design-system/ui/badge';
import AppIcon from '@/design-system/icons/AppIcon';
import BusinessRating from '@/components/reviews/BusinessRating';
import CategoryBadge from '@/components/marketplace/CategoryBadge';
import { ETA_CHIP } from '@/design-system/patterns/commerce-card-tokens';
import { cn } from '@/lib/utils';

/**
 * Meta premium del storefront: estado, ETA, rating, domicilio.
 */
export default function BusinessStoreMeta({
  business,
  ratingSummary,
  openNow,
  coverage,
  etaMinutes,
  deliveryLabel,
  minOrderLabel,
  distanceLabel,
  promoText,
  storeActive,
  className,
}) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <CategoryBadge categoryId={business.category} />
        {openNow ? (
          <Badge variant="success">Abierto</Badge>
        ) : (
          <Badge variant="destructive">Cerrado</Badge>
        )}
        {coverage?.available && coverage.tier === 'intermunicipal' && (
          <Badge variant="info">{coverage.label}</Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-muted-foreground">
        <BusinessRating business={business} ratingSummary={ratingSummary} size="sm" />
        <span className={ETA_CHIP}>
          <AppIcon name="pending" size={12} aria-hidden />
          ~{etaMinutes} min
        </span>
        <span>Domicilio {deliveryLabel}{minOrderLabel}</span>
        {distanceLabel ? <span>{distanceLabel}</span> : null}
      </div>

      {storeActive && promoText ? (
        <p className="rounded-[var(--radius-component)] border border-accent/40 bg-accent/15 px-3.5 py-2.5 text-sm font-semibold text-foreground">
          <span className="mr-1.5 inline-flex items-center gap-1 text-accent-foreground">
            <AppIcon name="promo" size={14} className="text-[hsl(var(--urgency))]" aria-hidden />
            Promo
          </span>
          {promoText}
        </p>
      ) : null}
    </div>
  );
}
