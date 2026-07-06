import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { HOME_CATEGORY_TILES } from '@/data/vertical-catalog';
import { cn } from '@/lib/utils';
import ServiceIconTile from '@/design-system/patterns/ServiceIconTile';

export default function HomeDiscoveryCategoryGrid({ onNavigate }) {
  return (
    <section aria-labelledby="home-categories-title" className="min-w-0">
      <div className="mb-4">
        <h2 id="home-categories-title" className="font-display text-xl font-bold text-foreground">
          Categorías
        </h2>
        <p className="text-sm text-muted-foreground">Elige qué quieres hacer hoy</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3.5 lg:grid-cols-8">
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
                whileTap={{ scale: 0.9, y: 4 }}
                transition={{ type: 'spring', stiffness: 520, damping: 18 }}
                className={cn(
                  'flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-border/50 bg-card/90 p-3.5 text-center shadow-soft',
                  'hover:border-primary/35 hover:shadow-lift active:shadow-card',
                )}
              >
                <ServiceIconTile serviceId={cat.id} name={cat.icon || cat.id} size="lg" />
                <span className="text-xs font-bold leading-tight text-foreground">{cat.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
