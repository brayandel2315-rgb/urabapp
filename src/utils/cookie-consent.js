const STORAGE_KEY = 'urabapp_cookie_consent_v1';

/** @typedef {'pending' | 'essential' | 'all'} CookieConsentLevel */

export function getCookieConsent() {
  if (typeof window === 'undefined') return 'pending';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'essential' || raw === 'all') return raw;
    return 'pending';
  } catch {
    return 'pending';
  }
}

export function setCookieConsent(level) {
  if (typeof window === 'undefined') return;
  if (level !== 'essential' && level !== 'all') return;
  localStorage.setItem(STORAGE_KEY, level);
  window.dispatchEvent(new CustomEvent('urabapp:cookie-consent', { detail: { level } }));
}

export function hasAnalyticsConsent() {
  return getCookieConsent() === 'all';
}

export function hasResolvedCookieConsent() {
  return getCookieConsent() !== 'pending';
}
