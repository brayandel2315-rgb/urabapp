import { cn } from '@/lib/utils';
import StarRating from './StarRating';
import { formatRatingValue, getBusinessReviewStats } from '@/utils/business-rating';

export default function BusinessRating({
  business,
  ratingSummary,
  size = 'sm',
  showCount = true,
  showValue = true,
  emptyLabel = 'Sin calificaciones',
  className,
}) {
  const stats = ratingSummary
    ? {
        average: ratingSummary.average,
        count: ratingSummary.count,
        hasReviews: ratingSummary.count > 0,
      }
    : getBusinessReviewStats(business);

  if (!stats.hasReviews) {
    return (
      <span className={cn('text-xs font-medium text-muted-foreground', className)}>
        {emptyLabel}
      </span>
    );
  }

  const displayValue = formatRatingValue(stats.average);
  const starValue = Math.min(5, Math.max(1, Math.round(stats.average)));

  return (
    <div
      className={cn('inline-flex flex-wrap items-center gap-1.5', className)}
      aria-label={`${displayValue} de 5 estrellas, ${stats.count} calificaciones`}
    >
      <StarRating value={starValue} readOnly size={size} />
      {showValue && (
        <span className="text-xs font-bold tabular-nums text-foreground">{displayValue}</span>
      )}
      {showCount && (
        <span className="text-[11px] font-medium text-muted-foreground">
          ({stats.count})
        </span>
      )}
    </div>
  );
}
