/** Detección de plataforma para instalación PWA */

export function isStandaloneMode() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches
    || window.matchMedia('(display-mode: fullscreen)').matches
    || window.matchMedia('(display-mode: minimal-ui)').matches
    || window.navigator.standalone === true
  );
}

export function isIOSDevice() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return (
    /iPad|iPhone|iPod/.test(ua)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function isIOSSafari() {
  if (!isIOSDevice()) return false;
  const ua = navigator.userAgent || '';
  return /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
}

export function isIOSNonSafari() {
  return isIOSDevice() && !isIOSSafari();
}

export function isAndroid() {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '');
}

export function isDesktopChromium() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return !isAndroid() && !isIOSDevice() && /Chrome|Edg|Chromium|Brave/i.test(ua);
}

export function detectInstallPlatform() {
  if (isStandaloneMode()) return 'installed';
  if (isIOSSafari()) return 'ios';
  if (isIOSNonSafari()) return 'ios-other';
  if (isAndroid()) return 'android';
  if (isDesktopChromium()) return 'desktop';
  return 'other';
}

export function canShowInstallUi(platform, hasDeferredPrompt) {
  if (platform === 'installed') return false;
  if (hasDeferredPrompt) return true;
  if (platform === 'ios' || platform === 'ios-other') return true;
  return platform === 'android' || platform === 'desktop';
}

/** Ruta pública del icono de la app (manifest + apple-touch-icon) */
export const APP_ICON_URL = '/app-icon.svg';

export const IOS_WIZARD_STEPS = [
  {
    id: 'welcome',
    title: 'Urabapp en tu iPhone',
    subtitle: 'Quedará con el icono verde en tu pantalla de inicio — como una app nativa.',
    cta: 'Empezar',
    showHomePreview: true,
  },
  {
    id: 'share',
    title: 'Paso 1 · Compartir',
    subtitle: 'Toca el botón Compartir en la barra inferior de Safari.',
    cta: 'Ya toqué Compartir',
    coach: 'share',
    hint: 'El ícono es un cuadrado con una flecha hacia arriba',
  },
  {
    id: 'add-home',
    title: 'Paso 2 · Agregar a inicio',
    subtitle: 'Desliza el menú y elige «Agregar a inicio».',
    cta: 'Ya la encontré',
    mock: 'share-sheet',
    hint: 'Puede estar un poco abajo en la lista',
  },
  {
    id: 'confirm',
    title: 'Paso 3 · Confirmar',
    subtitle: 'Verifica que diga Urabapp y toca Agregar arriba a la derecha.',
    cta: 'Ya la agregué',
    mock: 'confirm-sheet',
    hint: 'Verás el icono verde de Urabapp antes de confirmar',
  },
  {
    id: 'done',
    title: '¡Listo!',
    subtitle: 'Busca el icono Urabapp en tu pantalla de inicio y ábrelo desde ahí.',
    cta: 'Entendido',
    showHomePreview: true,
    success: true,
  },
];

export const IOS_OTHER_STEP = {
  id: 'open-safari',
  title: 'Abre en Safari',
  subtitle: 'Para instalar con icono en inicio, abre esta página en Safari (no en Chrome).',
  cta: 'Copiar enlace',
};

export const INSTALL_COPY = {
  ios: {
    title: 'Agregar Urabapp a tu inicio',
    subtitle: 'Te guiamos paso a paso — quedará con el icono de la app',
    cta: 'Ver guía paso a paso',
  },
  'ios-other': {
    title: 'Instalar en iPhone',
    subtitle: 'Abre urabapp.vercel.app en Safari para agregar a inicio con icono',
    cta: 'Ver cómo',
  },
  android: {
    title: 'Instalar Urabapp',
    subtitle: 'Acceso directo con icono en tu pantalla de inicio',
    cta: 'Instalar ahora',
  },
  desktop: {
    title: 'Instalar Urabapp en tu PC',
    subtitle: 'Se creará un acceso directo con el logo de Urabapp en el escritorio o menú inicio',
    cta: 'Instalar app',
  },
  other: {
    title: 'Usa Urabapp como app',
    subtitle: 'En Chrome o Edge busca «Instalar» en la barra de dirección, o agrega a inicio desde el menú del navegador',
    cta: 'Entendido',
  },
};
