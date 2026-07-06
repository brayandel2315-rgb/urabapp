import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import CatalogImage from '@/components/ui/CatalogImage';
import { resolveBannerImage } from '@/utils/catalog-images';
import { CARD_SHELL, CARD_INTERACTIVE, IMAGE_ASPECT } from '@/design-system/patterns/commerce-card-tokens';

function resolveBannerLink(banner) {
  if (!banner.link) return null;
  if (banner.link.startsWith('http')) return banner.link;
  if (banner.link.startsWith('/')) return banner.link;
  return `/tienda/${banner.link}`;
}

function PromoBadge({ badge }) {
  if (!badge) return null;
  const isRating = String(badge).includes('⭐');
  return (
    <span
      className={cn(
        'absolute left-2 top-2 z-[1] rounded-md px-2 py-0.5 text-[10px] font-bold shadow-sm',
        isRating ? 'bg-amber-400 text-amber-950' : 'bg-primary text-primary-foreground'
      )}
    >
      {badge}
    </span>
  );
}

export default function PromoBannerCard({ banner, index = 0, className = '', priority = false }) {
  const image = resolveBannerImage(banner, index);
  const to = resolveBannerLink(banner);
  const emoji = banner.emoji || 'store';

  const inner = (
    <article className={cn(CARD_SHELL, CARD_INTERACTIVE, 'flex h-full flex-col', className)}>
      <div className={cn('relative overflow-hidden bg-muted/30', IMAGE_ASPECT)}>
        <CatalogImage
          src={image}
          emoji={emoji}
          alt={banner.title}
          rounded="none"
          size="lg"
          priority={priority}
        />
        <PromoBadge badge={banner.badge} />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-tight text-foreground">
          {banner.title}
        </h3>
        {banner.subtitle && (
          <p className="mt-1 line-clamp-2 flex-1 text-xs leading-snug text-muted-foreground">
            {banner.subtitle}
          </p>
        )}
        {to && (
          <p className="mt-2 text-xs font-bold text-primary">Pedir ahora →</p>
        )}
      </div>
    </article>
  );

  if (to && !to.startsWith('http')) {
    return (
      <Link to={to} className="block h-full transition-transform active:scale-[0.98]">
        {inner}
      </Link>
    );
  }
  if (to?.startsWith('http')) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }
  return inner;
}

export function PromoCarousel({ banners, className }) {
  if (!banners?.length) return null;
  const items = banners.slice(0, 6);
  return (
    <div className={cn('min-w-0', className)}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((b, i) => (
          <div key={b.id || i} className="min-w-0">
            <PromoBannerCard banner={b} index={i} priority={i === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}
