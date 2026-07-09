import { Link } from 'react-router-dom';
import CatalogImage from '@/components/ui/CatalogImage';
import { formatCOP } from '@/utils/currency';
import { resolveProductImage } from '@/utils/catalog-images';
import { iconForCategory } from '@/design-system/icons/icon-map';
import { cn } from '@/lib/utils';

const RANK_STYLES = {
  1: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md',
  2: 'bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-md',
  3: 'bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-md',
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
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-[#D5E3EF]/80 bg-white shadow-soft transition-all duration-300',
        'hover:-translate-y-0.5 hover:border-[#28B463]/35 hover:shadow-md active:scale-[0.99]',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#E6F4FF]/40">
        <CatalogImage
          src={image}
          emoji={icon}
          categoryFallback={product.businessCategory}
          alt={product.name}
          rounded="none"
          size="3xl"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D2B45]/55 via-transparent to-transparent" />
        {rank <= 3 && (
          <span
            className={cn(
              'absolute left-2.5 top-2.5 flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-[11px] font-black',
              RANK_STYLES[rank],
            )}
          >
            #{rank}
          </span>
        )}
        {proof && (
          <span className="absolute bottom-2 left-2 right-2 truncate rounded-full bg-white/92 px-2.5 py-1 text-center text-[10px] font-bold text-[#0D2B45] backdrop-blur-sm">
            {proof}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 font-display text-[15px] font-bold leading-snug text-[#0D2B45] group-hover:text-primary">
          {product.name}
        </p>
        <p className="truncate text-xs font-medium text-[#4A6278]">
          {product.businessName}
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="font-display text-base font-black text-primary">
            {formatCOP(product.price)}
          </p>
          {product.businessRating > 0 && (
            <span className="shrink-0 rounded-full bg-[#E8F9EE] px-2 py-0.5 text-[10px] font-bold text-[#1C8238]">
              ★ {Number(product.businessRating).toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
