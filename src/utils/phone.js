/** Normaliza celular colombiano a 10 dígitos (sin indicativo). */
export function normalizeColombianPhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

export function phonesMatch(a, b) {
  const na = normalizeColombianPhone(a);
  const nb = normalizeColombianPhone(b);
  return na.length >= 10 && na === nb;
}
