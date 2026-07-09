import { Link } from 'react-router-dom';
import { HOME_CATEGORY_TILES, HOME_CATEGORY_TILES_MOBILE } from '@/data/vertical-catalog';
import { cn } from '@/lib/utils';
import ServiceIconTile from '@/design-system/patterns/ServiceIconTile';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';

const CATEGORY_ICON_TONE = {
  restaurantes: 'green',
  mercado: 'green',
  farmacia: 'blue',
  mensajeria: 'blue',
  tiendas: 'green',
  envios: 'blue',
  locales: 'green',
  ofertas: 'green',
  more: 'green',
};

const ROUTE_OVERRIDES = {
  mensajeria: '/mandado',
  ofertas: '/ofertas',
};

export default function HomeCategoryRail({ onNavigate, className, variant = 'mobile' }) {
  const tiles = variant === 'desktop' ? HOME_CATEGORY_TILES : HOME_CATEGORY_TILES_MOBILE;

  return (
    <section aria-labelledby="home-services-title" className={cn('min-w-0', className)}>
      <HomeSectionHeader
        id="home-services-title"
        title="Categorías"
        subtitle="Elige qué necesitas"
        variant="brand"
      />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
        {tiles.map((cat) => {
          const to = ROUTE_OVERRIDES[cat.id] || cat.route;
          const tone = CATEGORY_ICON_TONE[cat.id] || 'green';
          return (
            <Link
              key={cat.id}
              to={to}
              onClick={() => onNavigate?.(cat.id)}
              className="service-grid-item group flex flex-col items-center gap-2 text-center"
            >
              <ServiceIconTile serviceId={cat.id} name={cat.icon || cat.id} tone={tone} />
              <p className="text-[11px] font-semibold leading-tight text-[#0D2B45] group-active:text-[#28B463]">
                {cat.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
