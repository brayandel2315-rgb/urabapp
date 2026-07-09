import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import PopularProductCard from './PopularProductCard';

const MIN_VISIBLE = 10;

function PopularProductsSkeleton() {
  return (
    <div className="home-popular-carousel">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="home-popular-carousel__item">
          <div className="h-[260px] animate-pulse rounded-2xl bg-[#E6F4FF]/60" />
        </div>
      ))}
    </div>
  );
}

export default function HomePopularProductsRow({
  products = [],
  isLoading = false,
  municipio = 'tu zona',
  onProductClick,
}) {
  const visible = products.slice(0, 12);

  if (isLoading && visible.length === 0) {
    return (
      <section aria-labelledby="home-popular-products-title" className="min-w-0">
        <HomeSectionHeader
          id="home-popular-products-title"
          title="Populares en tu zona"
          subtitle="Lo más pedido por clientes reales"
          variant="brand"
        />
        <PopularProductsSkeleton />
      </section>
    );
  }

  if (visible.length < MIN_VISIBLE) return null;

  return (
    <section aria-labelledby="home-popular-products-title" className="min-w-0">
      <HomeSectionHeader
        id="home-popular-products-title"
        title="Populares en tu zona"
        subtitle={`Los productos que más piden en ${municipio}`}
        variant="brand"
      />
      <div className="home-popular-carousel">
        {visible.map((product, index) => (
          <div key={product.id} className="home-popular-carousel__item">
            <PopularProductCard
              product={product}
              rank={index + 1}
              onClick={() => onProductClick?.(product)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
