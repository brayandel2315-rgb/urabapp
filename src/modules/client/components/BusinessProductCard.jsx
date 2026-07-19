import CatalogImage from '@/components/ui/CatalogImage';
import AppIcon from '@/design-system/icons/AppIcon';
import { formatCOP } from '@/utils/currency';
import { cn } from '@/lib/utils';
import { iconForCategory } from '@/design-system/icons/icon-map';
import { resolveProductImage, getBusinessVisualKey } from '@/utils/catalog-images';
import { isDishLikeProduct } from '@/utils/product-modifiers';
import { CARD_SHELL } from '@/design-system/patterns/commerce-card-tokens';

/**
 * Card de producto del storefront — layout grid (móvil) o list (destacados).
 * Toda la card es táctil: agrega o muestra el motivo si no se puede comprar.
 */
export default function BusinessProductCard({
  product,
  business,
  coverFallback,
  canPurchase,
  storeInactive = false,
  blockReason = null,
  justAdded,
  onAdd,
  featured = false,
  featuredLabel = 'Destacado',
  layout = 'grid',
}) {
  const image = resolveProductImage(product, business?.category, business?.slug) || coverFallback;
  const icon = iconForCategory(business?.category) || business?.emoji || 'store';
  const visualKey = getBusinessVisualKey(business);
  const soldOut = product?.is_available === false;
  const purchaseBlocked = !canPurchase || storeInactive || soldOut;
  const customizable = canPurchase && !storeInactive && isDishLikeProduct(product, business?.category);
  const hasDeal = Number(product.compare_at_price) > Number(product.price);
  const isGrid = layout === 'grid';

  const badgeLabel = soldOut
    ? 'Agotado'
    : storeInactive
      ? (blockReason || 'Cerrado')
      : !canPurchase
        ? (blockReason || 'No disponible')
        : hasDeal
          ? 'Oferta'
          : null;

  const badgeOff = Boolean(soldOut || storeInactive || !canPurchase);

  const handleActivate = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    onAdd?.(product);
  };

  return (
    <article
      className={cn(
        CARD_SHELL,
        'store-product-card relative cursor-pointer',
        isGrid ? 'store-product-card--grid' : 'store-product-card--list p-3',
        featured && 'ring-1 ring-primary/15',
        justAdded && !purchaseBlocked && 'ring-2 ring-primary/40',
        purchaseBlocked && 'store-product-card--off opacity-90',
      )}
      role="button"
      tabIndex={0}
      aria-label={
        purchaseBlocked
          ? `${product.name}. ${badgeLabel || 'No disponible'}`
          : `Agregar ${product.name}`
      }
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleActivate(e);
        }
      }}
    >
      {isGrid ? (
        <>
          <div className="store-product-card__media">
            <CatalogImage
              src={image}
              emoji={icon}
              categoryFallback={business?.category}
              visualKey={visualKey}
              alt={product.name}
              size="lg"
              rounded="none"
              imgClassName="h-full w-full object-cover"
            />
            {badgeLabel ? (
              <span
                className={cn(
                  'store-product-card__badge',
                  badgeOff && 'store-product-card__badge--off',
                )}
              >
                {badgeLabel}
              </span>
            ) : null}
          </div>
          <div className="store-product-card__body">
            <h4 className="store-product-card__name">{product.name}</h4>
            {product.description ? (
              <p className="store-product-card__desc">{product.description}</p>
            ) : null}
            <div className="store-product-card__price-row">
              <div className="min-w-0">
                <p className={cn('store-product-card__price', purchaseBlocked && 'text-muted-foreground')}>
                  {formatCOP(product.price)}
                </p>
                <p className="store-product-card__currency">COP</p>
                {hasDeal ? (
                  <p className="store-product-card__compare">{formatCOP(product.compare_at_price)}</p>
                ) : null}
                {customizable ? (
                  <p className="store-product-card__customize">Personalizar</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={handleActivate}
                aria-label={`Agregar ${product.name}`}
                className={cn(
                  'store-product-card__add',
                  purchaseBlocked && 'store-product-card__add--off',
                  justAdded && !purchaseBlocked && 'store-product-card__add--done',
                )}
              >
                <AppIcon name={justAdded && !purchaseBlocked ? 'check' : 'plus'} size={18} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="store-product-card__list-row">
            <div className="min-w-0 flex-1">
              {featured ? (
                <p className="store-product-card__eyebrow">{featuredLabel}</p>
              ) : null}
              <h4 className="store-product-card__list-name">{product.name}</h4>
              {product.description ? (
                <p className="store-product-card__list-desc">{product.description}</p>
              ) : null}
              <div className="store-product-card__list-price-row">
                <p className={cn('store-product-card__price', purchaseBlocked && 'text-muted-foreground')}>
                  {formatCOP(product.price)}
                </p>
                <span className="store-product-card__currency">COP</span>
                {hasDeal ? (
                  <p className="store-product-card__compare">{formatCOP(product.compare_at_price)}</p>
                ) : null}
              </div>
              {customizable ? (
                <p className="store-product-card__customize">Personalizar</p>
              ) : null}
            </div>
            <div className="store-product-card__list-media">
              <CatalogImage
                src={image}
                emoji={icon}
                categoryFallback={business?.category}
                visualKey={visualKey}
                alt={product.name}
                size="lg"
                rounded="none"
                imgClassName="h-full w-full object-cover"
              />
              {badgeLabel && badgeOff ? (
                <span className="store-product-card__badge store-product-card__badge--off store-product-card__badge--list">
                  {badgeLabel}
                </span>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={handleActivate}
            aria-label={`Agregar ${product.name}`}
            className={cn(
              'store-product-card__add store-product-card__add--list',
              purchaseBlocked && 'store-product-card__add--off',
              justAdded && !purchaseBlocked && 'store-product-card__add--done',
            )}
          >
            <AppIcon name={justAdded && !purchaseBlocked ? 'check' : 'plus'} size={18} />
          </button>
        </>
      )}
    </article>
  );
}
