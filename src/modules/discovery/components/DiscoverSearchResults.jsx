import { Link } from 'react-router-dom';
import BusinessCard from '@/components/BusinessCard';
import AppIcon from '@/design-system/icons/AppIcon';
import { formatCOP } from '@/utils/currency';
import { cn } from '@/lib/utils';
import {
  VERTICAL_CATALOG_GRID,
  VERTICAL_CATALOG_LIST,
} from '@/modules/discovery/components/VerticalSectionRow';

function ProductHit({ product }) {
  return (
    <Link
      to={product.to}
      className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border/50 transition-colors hover:ring-primary/25"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-lg">
        <AppIcon name={product.emoji || 'package'} size="md" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-foreground">{product.name}</span>
        <span className="block truncate text-xs text-muted-foreground">{product.businessName}</span>
      </span>
      <span className="shrink-0 text-sm font-bold text-primary">{formatCOP(product.price)}</span>
    </Link>
  );
}

export default function DiscoverSearchResults({
  query,
  businesses = [],
  products = [],
  total = 0,
  className,
}) {
  const bizCount = businesses.length;
  const prodCount = products.length;

  return (
    <div className={cn('space-y-8', className)}>
      <p className="text-sm font-semibold text-muted-foreground">
        {total || bizCount + prodCount} resultado{(total || bizCount + prodCount) === 1 ? '' : 's'} para
        {' '}
        <span className="text-foreground">“{query}”</span>
      </p>

      {products.length > 0 && (
        <section aria-labelledby="search-products-title">
          <h2 id="search-products-title" className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
            <AppIcon name="package" size="sm" className="text-primary" />
            Productos
          </h2>
          <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
            {products.map((p) => (
              <ProductHit key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {businesses.length > 0 && (
        <section aria-labelledby="search-stores-title">
          <h2 id="search-stores-title" className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
            <AppIcon name="store" size="sm" className="text-primary" />
            Tiendas
          </h2>
          <div className={VERTICAL_CATALOG_LIST}>
            {businesses.map((b, i) => (
              <BusinessCard key={b.id} business={b} layout="list" imageLoading={i < 3 ? 'eager' : 'lazy'} />
            ))}
          </div>
          <div className={VERTICAL_CATALOG_GRID}>
            {businesses.map((b, i) => (
              <BusinessCard key={`${b.id}-grid`} business={b} layout="grid" imageLoading={i < 3 ? 'eager' : 'lazy'} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
