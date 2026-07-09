/** Loop de mejora continua para la guía de instalación móvil */

export const INSTALL_LOOP_VERSION = 1;

const FEEDBACK_KEY = 'urabapp-pwa-install-feedback-v1';
const VARIANT_KEY = 'urabapp-pwa-install-variant-v1';
const MOBILE_PROMPT_KEY = 'urabapp-pwa-mobile-prompted-v1';

function readFeedback() {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : { helpful: 0, notHelpful: 0, entries: [] };
  } catch {
    return { helpful: 0, notHelpful: 0, entries: [] };
  }
}

function writeFeedback(data) {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(data));
}

/** Variante visual del wizard — rota si hay muchos "no me funcionó" */
export function getInstallWizardVariant() {
  const stored = localStorage.getItem(VARIANT_KEY);
  if (stored === 'detailed' || stored === 'compact') return stored;

  const fb = readFeedback();
  if (fb.notHelpful > fb.helpful && fb.notHelpful >= 2) return 'detailed';
  return 'compact';
}

export function setInstallWizardVariant(variant) {
  localStorage.setItem(VARIANT_KEY, variant);
}

export function recordInstallFeedback({ helpful, platform, stepReached, wizardVersion = INSTALL_LOOP_VERSION }) {
  const fb = readFeedback();
  const entry = {
    helpful,
    platform,
    stepReached,
    wizardVersion,
    at: new Date().toISOString(),
  };
  fb.entries = [...(fb.entries || []), entry].slice(-40);
  if (helpful) fb.helpful += 1;
  else fb.notHelpful += 1;
  writeFeedback(fb);

  if (!helpful && fb.notHelpful >= 2) {
    setInstallWizardVariant('detailed');
  }
}

export function getInstallFeedbackStats() {
  return readFeedback();
}

export function wasMobilePromptShownThisSession() {
  return sessionStorage.getItem(MOBILE_PROMPT_KEY) === '1';
}

export function markMobilePromptShown() {
  sessionStorage.setItem(MOBILE_PROMPT_KEY, '1');
}

export function shouldAutoOpenMobileInstall({
  isStandalone,
  dismissed,
  visitCount,
  platform,
}) {
  if (isStandalone || dismissed) return false;
  if (wasMobilePromptShownThisSession()) return false;
  if (platform !== 'ios' && platform !== 'ios-other' && platform !== 'android') return false;
  return visitCount >= 2 && visitCount <= 6;
}

export function shouldShowMobileFab({
  isStandalone,
  dismissed,
  visitCount,
  platform,
}) {
  if (isStandalone || dismissed) return false;
  if (platform !== 'ios' && platform !== 'ios-other' && platform !== 'android') return false;
  return visitCount >= 2;
}

export function shouldShowMobileBanner({
  isStandalone,
  dismissed,
  visitCount,
  platform,
  sheetOpen,
}) {
  if (isStandalone || dismissed || sheetOpen) return false;
  if (platform !== 'ios' && platform !== 'ios-other' && platform !== 'android') return false;
  return visitCount >= 2 && visitCount <= 10;
}
