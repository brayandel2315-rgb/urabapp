let posthog = null;
let initialized = false;

export function isAnalyticsEnabled() {
  return Boolean(import.meta.env.VITE_POSTHOG_KEY);
}

export async function initAnalytics() {
  if (initialized || typeof window === 'undefined') return;
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (!key) return;

  try {
    const mod = await import('posthog-js');
    posthog = mod.default;
    posthog.init(key, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
      capture_pageview: true,
      capture_pageleave: true,
      persistence: 'localStorage',
    });
    initialized = true;
  } catch {
    /* opcional */
  }
}

export function identifyUser(user) {
  if (!posthog || !user?.id) return;
  posthog.identify(user.id, {
    email: user.email,
    role: user.role,
  });
}

export function trackEvent(name, properties = {}) {
  if (!posthog) return;
  posthog.capture(name, properties);
}

/** PostHog + tabla analytics_events (embudo en admin ejecutivo) */
export async function trackProductEvent(name, properties = {}, userId = null) {
  trackEvent(name, properties);
  if (typeof window === 'undefined') return;
  try {
    const { trackAnalyticsEvent } = await import('./marketplace.service');
    await trackAnalyticsEvent(name, properties, userId);
  } catch {
    /* no bloquear UX */
  }
}

export function resetAnalytics() {
  if (!posthog) return;
  posthog.reset();
}
