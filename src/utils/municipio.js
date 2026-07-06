import { DEFAULT_MUNICIPALITY, MUNICIPALITIES } from './constants';

const stripAccents = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const BY_KEY = Object.fromEntries(
  MUNICIPALITIES.map((name) => [stripAccents(name), name])
);

/** Normaliza municipio guardado en localStorage o URL */
export function normalizeMunicipio(value) {
  if (!value) return DEFAULT_MUNICIPALITY;
  if (MUNICIPALITIES.includes(value)) return value;
  return BY_KEY[stripAccents(value)] || DEFAULT_MUNICIPALITY;
}

/** Devuelve municipio Urabá o null si no coincide */
export function tryNormalizeMunicipio(value) {
  if (!value) return null;
  if (MUNICIPALITIES.includes(value)) return value;
  return BY_KEY[stripAccents(value)] || null;
}

export function isUrabaMunicipio(value) {
  return Boolean(tryNormalizeMunicipio(value));
}
