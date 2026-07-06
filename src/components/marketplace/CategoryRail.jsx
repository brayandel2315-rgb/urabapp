import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { spring, tween } from '@/design-system/motion/presets';
import { STORE } from '@/utils/marketplace-copy';

const TILE_WRAP =
  'flex flex-col items-center gap-1.5 sm:gap-2 max-md:shrink-0 max-md:snap-start md:w-full';

const GRID_LIST = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.03 },
  },
};

const GRID_TILE = {
  hidden: { opacity: 0, y: 10, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: tween },
};

function formatCount(count) {
  if (!count || count <= 0) return null;
  return count > 99 ? '99+' : String(count);
}

function CategoryEmoji({ cat, iconClassName }) {
  const stickerName = cat.sticker || cat.icon;
  if (stickerName) {
    return <AppIcon name={stickerName} size="lg" className={iconClassName || 'text-primary'} />;
  }
  return <AppIcon name={cat.icon || 'comercio'} size="lg" className={iconClassName} />;
}

function ScrollCategoryTile({ cat, active, count, onSelect }) {
  const theme = cat.theme;
  const isActive = active && !cat.serviceOnly;
  const countLabel = formatCount(count);

  const tile = (
    <>
      <motion.div
        layout
        transition={spring}
        className={cn(
          'relative flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-2xl sm:h-14 sm:w-14 md:mx-auto',
          isActive
            ? cn(theme.active, 'shadow-md ring-2 ring-primary/35 ring-offset-2 ring-offset-card')
            : cn(theme.light, 'ring-1', theme.ring)
        )}
        animate={{ scale: isActive ? 1.04 : 1 }}
        whileHover={isActive ? undefined : { scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <CategoryEmoji cat={cat} className="text-[1.5rem] sm:text-[1.65rem]" iconClassName={theme.text} />
      </motion.div>
      <div className="flex max-w-[4.5rem] flex-col items-center gap-0.5 md:max-w-none">
        <span
          className={cn(
            'text-center text-[10px] font-semibold leading-tight sm:text-[11px]',
            isActive ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {cat.shortName || cat.name}
        </span>
        {countLabel && (
          <span className="text-[9px] font-medium tabular-nums text-muted-foreground/75 sm:text-[10px]">
            {countLabel}
          </span>
        )}
      </div>
    </>
  );

  if (cat.route) {
    return (
      <motion.div variants={GRID_TILE} className={TILE_WRAP}>
        <Link to={cat.route} className="flex w-full flex-col items-center gap-1.5 sm:gap-2">
          {tile}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(cat.id)}
      className={TILE_WRAP}
      aria-pressed={isActive}
      aria-label={`${cat.name}${countLabel ? `, ${countLabel} ${STORE.manyLower}` : ''}`}
      variants={GRID_TILE}
    >
      {tile}
    </motion.button>
  );
}

function SidebarCategoryRow({ cat, active, count, onSelect }) {
  const theme = cat.theme;
  const isActive = active && !cat.serviceOnly;
  const countLabel = formatCount(count);

  const rowClass = cn(
    'group relative flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition-colors duration-200',
    isActive ? 'bg-primary/[0.08] shadow-sm ring-1 ring-primary/20' : 'hover:bg-muted/45'
  );

  const content = (
    <>
      {isActive && (
        <motion.span
          layoutId="category-sidebar-active"
          className="absolute bottom-2 left-0 top-2 w-1 rounded-full bg-primary"
          transition={spring}
          aria-hidden
        />
      )}
      <motion.div
        layout
        transition={spring}
        className={cn(
          'ml-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          isActive ? theme.active : cn(theme.light, theme.text)
        )}
        animate={{ scale: isActive ? 1.05 : 1 }}
      >
        <CategoryEmoji cat={cat} className="text-xl" />
      </motion.div>
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-sm font-semibold', isActive ? 'text-foreground' : 'text-foreground/90')}>
          {cat.name}
        </p>
        {cat.plural && <p className="truncate text-[11px] text-muted-foreground">{cat.plural}</p>}
      </div>
      {countLabel && (
        <motion.span
          layout
          className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums',
            isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}
        >
          {countLabel}
        </motion.span>
      )}
    </>
  );

  if (cat.route) {
    return (
      <Link to={cat.route} className={rowClass}>
        {content}
      </Link>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(cat.id)}
      className={rowClass}
      aria-pressed={isActive}
      whileTap={{ scale: 0.99 }}
    >
      {content}
    </motion.button>
  );
}

function ServiceShortcutCard({ cat, compact = false }) {
  const theme = cat.theme;

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={spring}>
      <Link
        to={cat.route}
        className={cn(
          'group relative flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden rounded-2xl p-2.5 ring-1 transition-shadow duration-200 sm:gap-3 sm:p-3',
          'hover:shadow-md',
          theme.light,
          theme.ring
        )}
      >
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-xl shadow-sm',
            compact ? 'h-10 w-10' : 'h-11 w-11',
            theme.active
          )}
        >
          <CategoryEmoji cat={cat} className="text-lg text-white sm:text-xl" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn('truncate text-xs font-bold sm:text-sm', theme.text)}>{cat.name}</p>
          <p className="truncate text-[10px] text-muted-foreground sm:text-[11px]">{cat.plural}</p>
        </div>
        <span
          className="shrink-0 text-sm text-muted-foreground/50 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        >
          →
        </span>
      </Link>
    </motion.div>
  );
}

function AllCategoryTile({ active, onSelect, variant }) {
  if (variant === 'sidebar') {
    return (
      <motion.button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          'relative flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition-colors duration-200',
          active ? 'bg-primary/[0.08] shadow-sm ring-1 ring-primary/20' : 'hover:bg-muted/45'
        )}
        aria-pressed={active}
        whileTap={{ scale: 0.99 }}
      >
        {active && (
          <motion.span
            layoutId="category-sidebar-active"
            className="absolute bottom-2 left-0 top-2 w-1 rounded-full bg-primary"
            transition={spring}
            aria-hidden
          />
        )}
        <motion.div
          layout
          transition={spring}
          className={cn(
            'ml-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}
          animate={{ scale: active ? 1.05 : 1 }}
        >
          <AppIcon name="all" size="md" />
        </motion.div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Todas las {STORE.manyLower}</p>
          <p className="text-[11px] text-muted-foreground">Sin filtro de categoría</p>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(null)}
      className={TILE_WRAP}
      aria-pressed={active}
      aria-label={`Ver todas las ${STORE.manyLower}`}
      variants={GRID_TILE}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        layout
        transition={spring}
        className={cn(
          'flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-2xl sm:h-14 sm:w-14 md:mx-auto',
          active
            ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/35 ring-offset-2 ring-offset-card'
            : 'bg-muted/55 text-muted-foreground ring-1 ring-border/55'
        )}
        animate={{ scale: active ? 1.04 : 1 }}
        whileHover={active ? undefined : { scale: 1.03, y: -2 }}
      >
        <AppIcon name="all" size="lg" className={active ? 'text-white' : undefined} />
      </motion.div>
      <span
        className={cn(
          'max-w-[4.5rem] text-center text-[10px] font-semibold sm:text-[11px] md:max-w-none',
          active ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        Todo
      </span>
    </motion.button>
  );
}

function CategoryRailPanel({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={tween}
      className={cn(
        'overflow-hidden rounded-3xl border border-border/45 bg-gradient-to-b from-card via-card to-muted/20 p-3 shadow-card sm:p-4',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export default function CategoryRail({
  categories = [],
  activeId = null,
  counts = {},
  onSelect,
  variant = 'scroll',
  className,
}) {
  const browseCats = categories.filter((c) => !c.serviceOnly);
  const serviceCats = categories.filter((c) => c.serviceOnly);
  const isSidebar = variant === 'sidebar';

  if (isSidebar) {
    return (
      <nav aria-label={`Categorías de ${STORE.manyLower}`} className={cn('space-y-0.5', className)}>
        <AllCategoryTile active={!activeId} onSelect={onSelect} variant="sidebar" />
        {browseCats.map((cat) => (
          <SidebarCategoryRow
            key={cat.id}
            cat={cat}
            active={activeId === cat.id}
            count={counts[cat.id] ?? 0}
            onSelect={onSelect}
          />
        ))}
        {serviceCats.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-border/45 pt-3">
            <p className="px-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Servicios
            </p>
            {serviceCats.map((cat) => (
              <ServiceShortcutCard key={cat.id} cat={cat} compact />
            ))}
          </div>
        )}
      </nav>
    );
  }

  return (
    <CategoryRailPanel className={className}>
      <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {STORE.many}
        </p>
        {activeId && (
          <motion.button
            type="button"
            onClick={() => onSelect(null)}
            className="text-[10px] font-semibold text-primary transition-colors hover:text-primary/80"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={tween}
          >
            Ver todos
          </motion.button>
        )}
      </div>

      <div className="relative -mx-1 md:mx-0">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-card to-transparent max-md:block md:hidden sm:w-5"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 bg-gradient-to-l from-card to-transparent max-md:block md:hidden sm:w-5"
          aria-hidden
        />

        <motion.div
          className={cn(
            'flex gap-2 overflow-x-auto hide-scrollbar px-1 pb-0.5 pt-0.5 snap-x snap-mandatory sm:gap-2.5',
            'md:grid md:grid-cols-4 md:gap-2.5 md:overflow-visible md:px-0 md:pb-0 md:pt-0 md:snap-none'
          )}
          role="tablist"
          aria-label="Filtrar por categoría"
          variants={GRID_LIST}
          initial="hidden"
          animate="show"
        >
          <AllCategoryTile active={!activeId} onSelect={onSelect} variant="scroll" />
          {browseCats.map((cat) => (
            <ScrollCategoryTile
              key={cat.id}
              cat={cat}
              active={activeId === cat.id}
              count={counts[cat.id] ?? 0}
              onSelect={onSelect}
            />
          ))}
        </motion.div>
      </div>

      {serviceCats.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-border/40 pt-3">
          <p className="px-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            También puedes
          </p>
          <div className="flex gap-2 sm:gap-2.5 md:grid md:grid-cols-2 md:gap-2.5">
            {serviceCats.map((cat) => (
              <ServiceShortcutCard key={cat.id} cat={cat} />
            ))}
          </div>
        </div>
      )}
    </CategoryRailPanel>
  );
}
