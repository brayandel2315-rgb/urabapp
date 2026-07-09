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
        'relative overflow-hidden rounded-2xl bg-card p-3 ring-1 ring-border/30 transition-all duration-300',
        justAdded && !inactive && 'ring-2 ring-[#0E6BA8]/40',
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
            <p className="mt-1 text-[10px] text-muted-foreground">Personalizable</p>
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
          'absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white transition-transform active:scale-95 disabled:cursor-not-allowed',
          inactive
            ? 'bg-[#94A3B8] opacity-60'
            : justAdded
              ? 'bg-emerald-600'
              : 'bg-[#0E6BA8] shadow-sm',
        )}
      >
        {justAdded ? '✓' : '+'}
      </button>
    </article>
  );
}
