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
}) {
  const image = resolveProductImage(product, business?.category, business?.slug) || coverFallback;
  const icon = iconForCategory(business?.category) || business?.emoji || 'store';
  const inactive = storeInactive || !canPurchase;
  const customizable = canPurchase && isDishLikeProduct(product, business?.category);

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-[1.35rem] bg-card p-3 shadow-sm ring-1 ring-border/40 transition-all duration-300',
        justAdded && !inactive && 'scale-[1.01] ring-2 ring-primary shadow-glow-promo',
        inactive && 'store-product-card--off bg-[#F0F4F8] ring-[#D8E2EC]',
      )}
    >
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="pr-8 font-display text-[15px] font-bold leading-tight text-foreground">
            {product.name}
          </h4>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
          )}
          <p className={cn(
            'mt-3 text-base font-black',
            inactive ? 'text-muted-foreground' : 'text-primary-dark',
          )}
          >
            {formatCOP(product.price)}
          </p>
          {customizable && (
            <p className="mt-1 text-[11px] font-semibold text-primary/80">
              Toca + para adiciones y bebidas
            </p>
          )}
        </div>
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted/20">
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
          'absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-glow-promo transition-transform active:scale-95 disabled:cursor-not-allowed',
          inactive
            ? 'bg-[#94A3B8] opacity-60 shadow-none'
            : justAdded
              ? 'bg-emerald-500'
              : 'bg-gradient-promo',
        )}
      >
        {justAdded ? '✓' : '+'}
      </button>
    </article>
  );
}
