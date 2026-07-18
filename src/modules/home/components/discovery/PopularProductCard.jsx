import { Link } from 'react-router-dom';
import CatalogImage from '@/components/ui/CatalogImage';
import { formatCOP } from '@/utils/currency';
import { resolveProductImage } from '@/utils/catalog-images';
import { iconForCategory } from '@/design-system/icons/icon-map';
import { cn } from '@/lib/utils';
import { CARD_SHELL, CARD_INTERACTIVE } from '@/design-system/patterns/commerce-card-tokens';

const RANK_STYLES = {
  1: 'bg-amber-400 text-amber-950 ring-amber-200',
  2: 'bg-muted text-foreground ring-border',
  3: 'bg-[hsl(var(--urgency)/0.25)] text-[hsl(var(--urgency))] ring-[hsl(var(--urgency)/0.2)]',
};

function formatOrderProof({ orderCount, orderLines, isOrganic }) {
  if (!isOrganic || orderCount <= 0) return null;
  if (orderCount >= 50) return `${orderCount}+ pedidos`;
  if (orderLines >= 10) return `${orderLines} clientes lo pidieron`;
  if (orderCount >= 5) return `${orderCount} pedidos recientes`;
  return 'Empezando a destacar';
}

export default function PopularProductCard({ product, rank, className, onClick }) {
  const image = resolveProductImage(product, product.businessCategory, product.businessSlug);
  const icon = product.emoji || iconForCategory(product.businessCategory) || product.businessEmoji || 'food';
  const storePath = `/tienda/${product.businessSlug || product.businessId}`;
  const proof = formatOrderProof(product);

  return (
    <Link
      to={storePath}
      onClick={onClick}
      className={cn('group block h-full', className)}
    >
      <article className={cn(CARD_SHELL, CARD_INTERACTIVE, 'flex h-full flex-col')}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
          <CatalogImage
            src={image}
            emoji={icon}
            categoryFallback={product.businessCategory}
            alt={product.name}
            rounded="none"
            size="3xl"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/45 via-transparent to-transparent" />
          {rank <= 3 && (
            <span
              className={cn(
                'absolute left-2.5 top-2.5 flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-[11px] font-black ring-2',
                RANK_STYLES[rank],
              )}
            >
              #{rank}
            </span>
          )}
          {proof && (
            <span className="absolute bottom-2 left-2 right-2 truncate rounded-full bg-card/95 px-2.5 py-1 text-center text-[10px] font-bold text-foreground shadow-soft backdrop-blur-sm">
              {proof}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-3">
          <p className="line-clamp-2 font-display text-[15px] font-bold leading-snug text-foreground group-hover:text-primary">
            {product.name}
          </p>
          <p className="truncate text-xs font-medium text-muted-foreground">
            {product.businessName}
          </p>
          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <p className="font-display text-base font-black text-primary">
              {formatCOP(product.price)}
            </p>
            {product.businessRating > 0 && (
              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                ★ {Number(product.businessRating).toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
