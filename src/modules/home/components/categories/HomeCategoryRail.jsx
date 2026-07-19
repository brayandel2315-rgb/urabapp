import { Link } from 'react-router-dom';
import { HOME_CATEGORY_TILES, HOME_CATEGORY_TILES_MOBILE } from '@/data/vertical-catalog';
import { cn } from '@/lib/utils';
import ServiceIconTile from '@/design-system/patterns/ServiceIconTile';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import { getContextualServicesSubtitle } from '@/modules/home/utils/home-context';

const CATEGORY_ICON_TONE = {
  restaurantes: 'green',
  mercado: 'green',
  farmacia: 'blue',
  mensajeria: 'blue',
  tiendas: 'green',
  envios: 'blue',
  locales: 'green',
  ofertas: 'orange',
  more: 'green',
};

const CATEGORY_HINTS = {
  restaurantes: 'Restaurantes',
  mercado: 'Súper y tiendas',
  farmacia: 'Salud y bienestar',
  mensajeria: 'Envíos y entregas',
  tiendas: 'Comercios',
  envios: 'Intermunicipales',
  ofertas: 'Descuentos',
  more: 'Buscar y descubrir',
};

const ROUTE_OVERRIDES = {
  mensajeria: '/mandado',
  ofertas: '/ofertas',
};

export default function HomeCategoryRail({ onNavigate, className, variant = 'mobile' }) {
  const tiles = variant === 'desktop' ? HOME_CATEGORY_TILES : HOME_CATEGORY_TILES_MOBILE;
  const subtitle = getContextualServicesSubtitle();

  return (
    <section aria-labelledby="home-services-title" className={cn('min-w-0', className)}>
      <HomeSectionHeader
        id="home-services-title"
        title="Servicios rápidos"
        subtitle={subtitle}
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
              className="home-service-card group"
            >
              <ServiceIconTile serviceId={cat.id} name={cat.icon || cat.id} tone={tone} />
              <div>
                <p className="home-service-card__label group-hover:text-primary">
                  {cat.label}
                </p>
                <p className="home-service-card__hint">
                  {CATEGORY_HINTS[cat.id] || 'Explorar'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
