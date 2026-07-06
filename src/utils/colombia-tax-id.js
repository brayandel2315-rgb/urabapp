/** Normaliza NIT / cédula — solo dígitos */
export function normalizeTaxId(input) {
  return String(input || '').replace(/\D/g, '');
}

/** Dígito de verificación DIAN (NIT colombiano) */
export function calcNitCheckDigit(nitWithoutDv) {
  const primes = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  const digits = normalizeTaxId(nitWithoutDv).split('').map(Number).reverse();
  let sum = 0;
  for (let i = 0; i < digits.length; i += 1) {
    sum += digits[i] * (primes[i] ?? 1);
  }
  const rem = sum % 11;
  if (rem < 2) return String(rem);
  return String(11 - rem);
}

export function formatNitDisplay(input) {
  const digits = normalizeTaxId(input);
  if (digits.length <= 1) return digits;
  const dv = digits.slice(-1);
  const base = digits.slice(0, -1);
  const grouped = base.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${grouped}-${dv}`;
}

/** Valida NIT con dígito de verificación (persona jurídica o natural con NIT) */
export function isValidColombianNit(input) {
  const digits = normalizeTaxId(input);
  if (digits.length < 8 || digits.length > 11) return false;
  const base = digits.slice(0, -1);
  const dv = digits.slice(-1);
  return calcNitCheckDigit(base) === dv;
}

/** Persona natural puede usar cédula (6–10 dígitos) como identificación tributaria */
export function isValidNaturalTaxId(input) {
  const digits = normalizeTaxId(input);
  return digits.length >= 6 && digits.length <= 10;
}
