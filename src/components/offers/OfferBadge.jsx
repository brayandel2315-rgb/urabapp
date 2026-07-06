import { OFFER_BADGES } from '@/data/offers-filters';
import { cn } from '@/lib/utils';

export default function OfferBadge({ badge, className }) {
  if (!badge || !OFFER_BADGES[badge]) return null;
  const cfg = OFFER_BADGES[badge];
  return (
    <span className={cn(
      'inline-flex rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide shadow-sm',
      cfg.className,
      className
    )}>
      {cfg.label}
    </span>
  );
}
