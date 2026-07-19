import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Navegación de categorías del menú — chips profesionales, sticky, snap-scroll.
 */
export default function StoreMenuNav({
  sections = [],
  activeId,
  onSelect,
  storeActive = true,
  className,
}) {
  const trackRef = useRef(null);

  useEffect(() => {
    if (!activeId || !trackRef.current) return;
    const chip = trackRef.current.querySelector(`[data-cat-id="${activeId}"]`);
    chip?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeId]);

  if (!sections.length) return null;

  return (
    <div
      className={cn('store-menu-nav', className)}
      role="tablist"
      aria-label="Categorías del menú"
    >
      <div ref={trackRef} className="store-menu-nav__track hide-scrollbar">
        {sections.map((section) => {
          const selected = activeId === section.id;
          return (
            <button
              key={section.id}
              type="button"
              role="tab"
              data-cat-id={section.id}
              aria-selected={selected}
              onClick={() => onSelect?.(section.id)}
              className={cn(
                'store-menu-nav__chip',
                selected && (storeActive ? 'store-menu-nav__chip--active' : 'store-menu-nav__chip--muted'),
              )}
            >
              <span className="store-menu-nav__label">{section.label}</span>
              {typeof section.count === 'number' ? (
                <span className="store-menu-nav__count">{section.count}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
