import { formatCOP } from '@/utils/currency';
import { formatBusinessHours } from '@/utils/schedule';
import { formatRatingValue } from '@/utils/business-rating';
import AppIcon from '@/design-system/icons/AppIcon';

export default function BusinessTrustPills({ business, ratingSummary }) {
  const isVerified = business?.verification_status === 'approved' && business?.is_published !== false;
  const reviewCount = ratingSummary?.count ?? business?.total_ratings ?? 0;
  const avgRating = ratingSummary?.average ?? business?.rating_avg;
  const prepMinutes = business?.prep_time_minutes ?? business?.delivery_time ?? 25;

  const pills = [
    isVerified && { key: 'verified', label: 'Comercio verificado', icon: 'lock', tone: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' },
    { key: 'prep', label: `Preparación ~${prepMinutes} min`, icon: 'bolt', tone: 'bg-sky-500/15 text-sky-800 dark:text-sky-200' },
    Number(business?.min_order) > 0 && {
      key: 'min',
      label: `Mín. ${formatCOP(business.min_order)}`,
      icon: 'cart',
      tone: 'bg-amber-500/15 text-amber-800 dark:text-amber-200',
    },
    reviewCount > 0 && avgRating && {
      key: 'rating',
      label: `${formatRatingValue(avgRating)} ★ (${reviewCount})`,
      icon: 'star',
      tone: 'bg-violet-500/15 text-violet-800 dark:text-violet-200',
    },
    business?.zone && {
      key: 'zone',
      label: business.zone,
      icon: 'map',
      tone: 'bg-muted text-muted-foreground',
    },
  ].filter(Boolean);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {pills.map((pill) => (
          <span
            key={pill.key}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${pill.tone}`}
          >
            <AppIcon name={pill.icon} size="xs" />
            {pill.label}
          </span>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{formatBusinessHours(business)}</p>
    </div>
  );
}
