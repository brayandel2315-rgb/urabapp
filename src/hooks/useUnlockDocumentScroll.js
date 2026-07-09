import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Evita que modales dejen el documento sin scroll en móvil. */
export function useUnlockDocumentScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.style.removeProperty('overflow');
    html.style.removeProperty('position');
    body.style.removeProperty('overflow');
    body.style.removeProperty('position');
    body.style.removeProperty('padding-right');
    body.removeAttribute('data-scroll-locked');
  }, [pathname]);
}
