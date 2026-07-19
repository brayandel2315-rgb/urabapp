import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const VIEWPORT_CONTENT =
  'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, interactive-widget=resizes-content';

function unlockScrollLocks() {
  const html = document.documentElement;
  const body = document.body;

  html.style.removeProperty('overflow');
  html.style.removeProperty('position');
  html.style.removeProperty('width');
  html.style.removeProperty('height');
  html.style.removeProperty('top');
  html.style.removeProperty('left');
  body.style.removeProperty('overflow');
  body.style.removeProperty('position');
  body.style.removeProperty('width');
  body.style.removeProperty('height');
  body.style.removeProperty('top');
  body.style.removeProperty('left');
  body.style.removeProperty('padding-right');
  body.style.removeProperty('touch-action');
  body.removeAttribute('data-scroll-locked');
}

/** Reaplica el meta viewport si iOS lo alteró tras focus/zoom. */
function enforceViewportMeta() {
  const meta = document.querySelector('meta[name="viewport"]');
  if (!meta) return;
  if (meta.getAttribute('content') !== VIEWPORT_CONTENT) {
    meta.setAttribute('content', VIEWPORT_CONTENT);
  }
}

/**
 * Estabiliza viewport móvil al cambiar de ruta:
 * - quita locks de scroll de modales
 * - reafirma meta viewport (anti zoom residual)
 * - evita que la app quede “agrandada” tras inputs/focus
 */
export function useUnlockDocumentScroll() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    unlockScrollLocks();
    enforceViewportMeta();

    // Si no hay ancla, alinea scroll al tope de la página (layout estable).
    if (!hash) {
      window.scrollTo(0, 0);
    }

    // iOS: a veces el visualViewport queda desplazado tras teclado/zoom.
    const vv = window.visualViewport;
    if (vv && typeof vv.offsetTop === 'number' && vv.offsetTop > 0) {
      window.scrollTo(0, 0);
    }
  }, [pathname, search, hash]);

  useEffect(() => {
    enforceViewportMeta();

    const onFocusOut = () => {
      window.setTimeout(() => {
        unlockScrollLocks();
        enforceViewportMeta();
      }, 50);
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        unlockScrollLocks();
        enforceViewportMeta();
      }
    };

    document.addEventListener('focusout', onFocusOut, true);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', onVisibility);

    return () => {
      document.removeEventListener('focusout', onFocusOut, true);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', onVisibility);
    };
  }, []);
}
