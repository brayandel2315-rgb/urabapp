import urabappLogoMaster from './urabapp-logo.png';
import urabappLogoLegacy from './urabapp-logo-transparent.png';
import urabappLogoBrand from './urabapp-logo-brand.png';

/** Original con fondo — solo para regenerar assets (`npm run process:brand-logo`). */
export const BRAND_LOGO_MASTER_SRC = urabappLogoMaster;

/** Logo oficial Urabapp — U + wordmark + tagline (identidad 2026) */
export const BRAND_LOGO_SRC = urabappLogoBrand;
export const BRAND_LOGO_TRANSPARENT_SRC = urabappLogoBrand;

/** Legacy transparente (compat / fallbacks) */
export const BRAND_LOGO_LEGACY_SRC = urabappLogoLegacy;

/** Rutas públicas (PWA, push, meta) */
export const BRAND_LOGO_PUBLIC = '/urabapp-logo-brand.png';
export const BRAND_LOGO_TRANSPARENT_PUBLIC = '/urabapp-logo-brand.png';
export const APP_ICON_PUBLIC = '/app-icon.png';

export default urabappLogoBrand;
