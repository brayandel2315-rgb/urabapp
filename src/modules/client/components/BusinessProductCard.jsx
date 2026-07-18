import CatalogImage from '@/components/ui/CatalogImage';
import { formatCOP } from '@/utils/currency';
import { cn } from '@/lib/utils';
import { iconForCategory } from '@/design-system/icons/icon-map';
import { resolveProductImage } from '@/utils/catalog-images';
import { isDishLikeProduct } from '@/utils/product-modifiers';

export default function BusinessProductCard({
  product,
  business,
  coverFallback,
  canPurchase,
  storeInactive = false,
  justAdded,
  onAdd,
  featured = false,
}) {
  const image = resolveProductImage(product, business?.category, business?.slug) || coverFallback;
  const icon = iconForCategory(business?.category) || business?.emoji || 'store';
  const inactive = storeInactive || !canPurchase;
  const customizable = canPurchase && isDishLikeProduct(product, business?.category);
  const hasDeal = Number(product.compare_at_price) > Number(product.price);

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-component)] border border-border bg-card p-3 shadow-soft transition-all duration-300',
        featured && 'ring-1 ring-primary/20',
        justAdded && !inactive && 'ring-2 ring-primary/45',
        inactive && 'store-product-card--off bg-muted/50 border-border opacity-90',
      )}
    >
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          {featured && (
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-primary">Popular</p>
          )}
          <h4 className="pr-8 font-display text-[15px] font-bold leading-tight text-foreground">
            {product.name}
          </h4>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <p className={cn(
              'text-base font-black',
              inactive ? 'text-muted-foreground' : 'text-primary',
            )}
            >
              {formatCOP(product.price)}
            </p>
            {hasDeal && (
              <p className="text-xs font-semibold text-muted-foreground line-through">
                {formatCOP(product.compare_at_price)}
              </p>
            )}
          </div>
          {customizable && (
            <p className="mt-1 text-[10px] font-medium text-muted-foreground">Personalizable</p>
          )}
        </div>
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[1.1rem] bg-muted/40">
          <CatalogImage
            src={image}
            emoji={icon}
            categoryFallback={business?.category}
            alt={product.name}
            size="lg"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={onAdd}
        disabled={!canPurchase}
        aria-label={`Agregar ${product.name}`}
        className={cn(
          'absolute bottom-3 right-3 flex h-11 w-11 min-h-[var(--touch-min)] min-w-[var(--touch-min)] items-center justify-center rounded-[0.9rem] text-lg font-bold text-primary-foreground transition-transform active:scale-95 disabled:cursor-not-allowed',
          inactive
            ? 'bg-muted-foreground/50 opacity-70'
            : justAdded
              ? 'bg-primary'
              : 'bg-primary shadow-soft',
        )}
      >
        {justAdded ? '✓' : '+'}
      </button>
    </article>
  );
}
