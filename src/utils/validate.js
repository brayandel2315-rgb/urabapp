const PHONE_RE = /^3\d{9}$/;

export function normalizePhoneColombia(input) {
  const digits = String(input || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('57')) return digits.slice(2);
  if (digits.length === 10 && digits.startsWith('3')) return digits;
  if (digits.length === 9 && digits.startsWith('3')) return digits;
  return digits;
}

export function isValidColombianPhone(input) {
  return PHONE_RE.test(normalizePhoneColombia(input));
}

export function formatPhoneDisplay(input) {
  const d = normalizePhoneColombia(input);
  if (d.length !== 10) return input;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

export function toE164Colombia(input) {
  const d = normalizePhoneColombia(input);
  return d.length === 10 ? `+57${d}` : null;
}

export function isValidName(name) {
  return String(name || '').trim().length >= 2;
}

export function isValidAddress(address) {
  return String(address || '').trim().length >= 8;
}

export function sanitizeText(text, maxLen = 500) {
  return String(text || '')
    .replace(/<[^>]*>/g, '')
    .replace(/[^\S\r\n]+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

/** Escapa comodines de ILIKE/LIKE en Postgres (% y _). */
export function escapeIlikePattern(term) {
  return String(term || '')
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
}

/**
 * Evita open redirect: solo rutas relativas internas (sin //, http, javascript).
 * @param {string|null|undefined} raw
 * @param {string} [fallback='/']
 */
export function safeRedirectPath(raw, fallback = '/') {
  if (!raw || typeof raw !== 'string') return fallback;

  let path = raw.trim();
  try {
    path = decodeURIComponent(path);
  } catch {
    return fallback;
  }

  if (!path.startsWith('/') || path.startsWith('//')) return fallback;
  if (/^\/\\/.test(path)) return fallback;
  if (/^(https?:|javascript:|data:|vbscript:)/i.test(path)) return fallback;
  if (path.includes('\\')) return fallback;

  const base = path.split('?')[0].split('#')[0];
  if (!base || base === '/') return fallback;

  return path.slice(0, 512);
}

/** Cédula de ciudadanía colombiana — solo dígitos, 6 a 10 caracteres */
export function normalizeDocumentNumber(input) {
  return String(input || '').replace(/\D/g, '');
}

export function isValidColombianDocument(input) {
  const digits = normalizeDocumentNumber(input);
  return digits.length >= 6 && digits.length <= 10;
}
