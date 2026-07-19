import { formatCOP } from '@/utils/currency';
import { formatBusinessHours } from '@/utils/schedule';
import { formatRatingValue } from '@/utils/business-rating';
import AppIcon from '@/design-system/icons/AppIcon';

const TONE = {
  brand: 'biz-pill biz-pill--brand',
  soft: 'biz-pill biz-pill--soft',
  muted: 'biz-pill biz-pill--muted',
  warn: 'biz-pill biz-pill--warn',
};

export default function BusinessTrustPills({ business, ratingSummary }) {
  const isVerified = business?.verification_status === 'approved' && business?.is_published !== false;
  const reviewCount = ratingSummary?.count ?? business?.total_ratings ?? 0;
  const avgRating = ratingSummary?.average ?? business?.rating_avg;
  const prepMinutes = business?.prep_time_minutes ?? business?.delivery_time ?? 25;

  const pills = [
    isVerified && { key: 'verified', label: 'Comercio verificado', icon: 'verified', tone: TONE.brand },
    { key: 'prep', label: `Preparación ~${prepMinutes} min`, icon: 'bolt', tone: TONE.soft },
    Number(business?.min_order) > 0 && {
      key: 'min',
      label: `Mín. ${formatCOP(business.min_order)}`,
      icon: 'cart',
      tone: TONE.soft,
    },
    reviewCount > 0 && avgRating && {
      key: 'rating',
      label: `${formatRatingValue(avgRating)} ★ (${reviewCount})`,
      icon: 'star',
      tone: TONE.soft,
    },
    business?.zone && {
      key: 'zone',
      label: business.zone,
      icon: 'map',
      tone: TONE.muted,
    },
  ].filter(Boolean);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {pills.map((pill) => (
          <span key={pill.key} className={pill.tone}>
            <AppIcon name={pill.icon} size="xs" />
            {pill.label}
          </span>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{formatBusinessHours(business)}</p>
    </div>
  );
}
