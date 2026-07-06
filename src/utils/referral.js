const STORAGE_KEY = 'urabapp-ref';

const VALID_SOURCES = new Set(['pwa', 'whatsapp', 'wa', 'instagram', 'ig']);

export function normalizeReferralSource(ref) {
  if (!ref) return 'pwa';
  const key = ref.toLowerCase();
  if (key === 'wa') return 'whatsapp';
  if (key === 'ig') return 'instagram';
  return VALID_SOURCES.has(key) ? key : 'pwa';
}

export function captureReferralFromUrl() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref') || params.get('utm_source');
  if (ref) {
    localStorage.setItem(STORAGE_KEY, normalizeReferralSource(ref));
  }
}

export function getReferralSource() {
  if (typeof window === 'undefined') return 'pwa';
  return localStorage.getItem(STORAGE_KEY) || 'pwa';
}

export function setReferralSource(source) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, normalizeReferralSource(source));
}
