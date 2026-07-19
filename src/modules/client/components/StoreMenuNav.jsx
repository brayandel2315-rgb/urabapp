import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Centra un chip en el track horizontal SIN usar scrollIntoView
 * (scrollIntoView mueve también la página y pelea con el scroll del usuario).
 */
function scrollChipIntoTrack(track, chip, behavior = 'smooth') {
  if (!track || !chip) return;
  const trackRect = track.getBoundingClientRect();
  const chipRect = chip.getBoundingClientRect();
  const delta =
    chipRect.left - trackRect.left - (trackRect.width - chipRect.width) / 2;
  const nextLeft = Math.max(0, Math.min(
    track.scrollLeft + delta,
    track.scrollWidth - track.clientWidth,
  ));
  if (typeof track.scrollTo === 'function') {
    track.scrollTo({ left: nextLeft, behavior });
  } else {
    track.scrollLeft = nextLeft;
  }
}

/**
 * Navegación de categorías del menú — chips sticky con scroll horizontal.
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
    const track = trackRef.current;
    if (!activeId || !track) return;
    const safeId = typeof CSS !== 'undefined' && CSS.escape
      ? CSS.escape(activeId)
      : activeId.replace(/"/g, '\\"');
    const chip = track.querySelector(`[data-cat-id="${safeId}"]`);
    scrollChipIntoTrack(track, chip, 'smooth');
  }, [activeId]);

  if (!sections.length) return null;

  return (
    <div
      className={cn('store-menu-nav', className)}
      role="tablist"
      aria-label="Categorías del catálogo"
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
