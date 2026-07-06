/** Enmascara identificadores tributarios para pantallas de solo lectura */
export function maskSensitiveId(value) {
  const raw = String(value || '').replace(/\D/g, '');
  if (raw.length < 4) return '••••';
  return `${'•'.repeat(Math.min(raw.length - 4, 8))}${raw.slice(-4)}`;
}
