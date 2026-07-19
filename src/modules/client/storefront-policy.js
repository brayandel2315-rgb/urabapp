/**
 * Políticas de experiencia de tienda (UrabApp Storefront).
 * Guía de producto para diseño, administración y cumplimiento — no es texto legal.
 *
 * Referencias legales en app: /legal/privacidad, /legal/terminos, /legal/datos (Ley 1581).
 */

export const STOREFRONT_POLICY = {
  version: '1.0',
  brand: {
    primary: '#1E6F43',
    secondary: '#7AC943',
    surface: '#F7F8FA',
  },
  navigation: {
    /** Mismo dock global del cliente; Explorar activo en /tienda/:slug */
    bottomDock: 'client-global',
    categoryChips: 'sticky-scroll-snap',
  },
  catalog: {
    featuredLayout: 'list',
    menuLayout: 'grid-2-mobile-3-desktop',
    currency: 'COP',
    showCompareAt: true,
  },
  trust: {
    showLey1581: true,
    showPriceTransparency: true,
    legalLinks: ['/legal/privacidad', '/legal/terminos', '/legal/datos'],
  },
  qualityBar: {
    /** Superar clones de delivery: claridad > ruido, confianza > urgencia falsa */
    noNeonUrgency: true,
    noFakeScarcity: true,
    oneJobPerSection: true,
  },
};

export const STOREFRONT_IMPROVEMENT_LOOP = {
  purpose: 'storefront-polish',
  focus: [
    'Jerarquía tipográfica del menú y chips',
    'Cards de producto (grid/list) vs Didi/Rappi',
    'Dock inferior + sticky cart sin solaparse',
    'Bloque de confianza Ley 1581 visible al final',
    'Velocidad percibida: sticky cats, scroll-mt, densidades',
  ],
};
