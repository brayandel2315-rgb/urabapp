import { useEffect } from 'react';

/** Mantiene el canvas de MapLibre al tamaño del contenedor (evita mapa gris). */
export function useMapResize(containerRef, mapApiRef, ready) {
  useEffect(() => {
    const el = containerRef.current;
    const api = mapApiRef.current;
    if (!el || !api?.resize || !ready) return undefined;

    const resize = () => {
      try {
        api.resize();
      } catch {
        /* map destroyed */
      }
    };

    resize();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => resize());
      ro.observe(el);
      return () => ro.disconnect();
    }

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [containerRef, mapApiRef, ready]);
}
