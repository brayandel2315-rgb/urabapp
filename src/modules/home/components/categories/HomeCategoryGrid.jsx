import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { HOME_MVP_CATEGORIES } from '../../constants/home-categories';
import { cn } from '@/lib/utils';
import { tween } from '@/design-system/motion/presets';
import AppIcon from '@/design-system/icons/AppIcon';

const CATEGORY_ETA = {
  comida: 28,
  mercado: 35,
  farmacia: 22,
  tiendas: 30,
  licoreria: 25,
};

export default function HomeCategoryGrid({ activeId, counts = {}, avgEta = {}, onSelect, onNavigate }) {
  return (
    <section aria-labelledby="home-categories-title" className="min-w-0">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 id="home-categories-title" className="font-display text-xl font-bold text-foreground">
            Categorías
          </h2>
          <p className="text-sm text-muted-foreground">Elige y compra al instante</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-8">
        {HOME_MVP_CATEGORIES.map((cat, i) => {
          const count = cat.filter ? counts[cat.filter] : null;
          const eta = cat.filter ? (avgEta[cat.filter] || CATEGORY_ETA[cat.filter]) : null;
          const isActive = cat.filter && activeId === cat.filter;
          const inner = (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...tween, delay: i * 0.04 }}
              className={cn(
                'flex h-full flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-center transition-all',
                'hover:border-primary/40 hover:bg-primary/5 hover:shadow-soft active:scale-[0.98]',
                isActive ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'border-border/60 bg-card'
              )}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <AppIcon name={cat.icon} size="md" className="text-primary" />
              </span>
              <span className="text-[10px] font-bold leading-tight text-foreground sm:text-xs">{cat.label}</span>
              {count > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold tabular-nums text-primary">
                  {count} negocio{count === 1 ? '' : 's'}
                </span>
              )}
              {eta && (
                <span className="text-[9px] font-semibold text-muted-foreground">~{eta} min</span>
              )}
            </motion.div>
          );

          if (cat.route) {
            return (
              <Link
                key={cat.id}
                to={cat.route}
                onClick={() => onNavigate?.(cat.id)}
                className="min-w-0"
                aria-label={cat.label}
              >
                {inner}
              </Link>
            );
          }

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect?.(cat.filter)}
              className="min-w-0 text-left"
              aria-label={cat.label}
              aria-pressed={isActive}
            >
              {inner}
            </button>
          );
        })}
      </div>
    </section>
  );
}
