/**
 * LOOP 24 — Rate limit simple en cliente (debounce por acción).
 */
const buckets = new Map();

export function checkRateLimit(key, maxCalls = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = buckets.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  buckets.set(key, entry);
  return entry.count <= maxCalls;
}

export function rateLimitedAction(key, fn, options) {
  if (!checkRateLimit(key, options?.maxCalls, options?.windowMs)) {
    throw new Error('Demasiados intentos. Espera un momento.');
  }
  return fn();
}
