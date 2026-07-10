import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { HOME_CATEGORY_TILES } from '@/data/vertical-catalog';
import { cn } from '@/lib/utils';
import ServiceIconTile from '@/design-system/patterns/ServiceIconTile';

const CATEGORY_HINTS = {
  restaurantes: 'Restaurantes',
  mercado: 'Mercado',
  farmacia: 'Farmacia',
  mensajeria: 'Mandados',
  tiendas: 'Comercios',
  envios: 'Envíos',
  locales: 'Locales',
  more: 'Explorar',
};

export default function HomeDiscoveryCategoryGrid({ onNavigate }) {
  return (
    <section aria-labelledby="home-categories-title" className="min-w-0">
      <div className="mb-5">
        <h2 id="home-categories-title" className="font-display text-2xl font-black text-[#111111]">
          Servicios rápidos
        </h2>
        <p className="mt-1 text-sm font-medium text-[#4B5563]">
          Comida, mercado, farmacia, mandados, envíos y más
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
        {HOME_CATEGORY_TILES.map((cat) => {
          return (
            <Link
              key={cat.id}
              to={cat.route}
              onClick={() => onNavigate?.(cat.id)}
              aria-label={cat.label}
              className="min-w-0"
            >
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'home-service-card h-full !gap-2.5 !p-3',
                )}
              >
                <ServiceIconTile serviceId={cat.id} name={cat.icon || cat.id} size="lg" />
                <div>
                  <span className="home-service-card__label block">{cat.label}</span>
                  <span className="home-service-card__hint block">
                    {CATEGORY_HINTS[cat.id] || 'Explorar'}
                  </span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
