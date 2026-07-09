import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SCROLL_DELTA = 12;
const TOP_ZONE = 48;

/**
 * Oculta la barra inferior al bajar y la muestra al subir o al tocar "Menú".
 * Solo afecta layout móvil vía data-bottom-nav-hidden en <html>.
 */
export function useAutoHideBottomNav() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const location = useLocation();

  const reveal = useCallback(() => setVisible(true), []);

  useEffect(() => {
    setVisible(true);
    lastY.current = window.scrollY;
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        if (y <= TOP_ZONE) {
          setVisible(true);
        } else if (delta > SCROLL_DELTA) {
          setVisible(false);
        } else if (delta < -SCROLL_DELTA) {
          setVisible(true);
        }

        lastY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.bottomNavHidden = visible ? 'false' : 'true';
    return () => {
      delete document.documentElement.dataset.bottomNavHidden;
    };
  }, [visible]);

  return { visible, reveal };
}
