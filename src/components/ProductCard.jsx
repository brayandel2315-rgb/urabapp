import Button from './ui/Button';
import CatalogImage from './ui/CatalogImage';
import { formatCOP } from '../utils/currency';
import { resolveProductImage } from '../utils/catalog-images';

export default function ProductCard({ product, onAdd, disabled = false, businessCategory, businessSlug }) {
  const image = resolveProductImage(product, businessCategory, businessSlug);

  return (
    <article className="flex items-center gap-3 overflow-hidden rounded-2xl bg-card p-3 shadow-sm ring-1 ring-border/40">
      <div className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-muted/30 sm:h-[96px] sm:w-[96px]">
        <CatalogImage
          src={image}
          emoji={product.emoji || product.icon || 'food'}
          alt={product.name}
          size="lg"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-display text-[15px] font-bold leading-tight text-foreground">{product.name}</h4>
        {product.description && (
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        )}
        <p className="mt-1.5 text-base font-bold text-foreground">{formatCOP(product.price)}</p>
      </div>
      <Button
        size="sm"
        className="h-9 min-w-9 shrink-0 rounded-full px-3 text-sm font-bold"
        onClick={() => onAdd(product)}
        disabled={disabled}
        aria-label={`Agregar ${product.name}`}
      >
        Agregar
      </Button>
    </article>
  );
}
