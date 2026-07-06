/** Pasos del checkout — patrón Rappi / Uber Eats */
export const CHECKOUT_STEPS = [
  { id: 'delivery', label: 'Entrega', icon: 'map' },
  { id: 'payment', label: 'Pago', icon: 'card' },
  { id: 'review', label: 'Confirmar', icon: 'check' },
];

/** Límites geográficos aproximados — región Urabá, Antioquia */
export { URABA_BOUNDS } from '@/utils/geo-bounds';

export const CHECKOUT_LIMITS = {
  nameMin: 3,
  nameMax: 80,
  addressMin: 12,
  addressMax: 300,
  referenceMin: 8,
  referenceMax: 200,
  cashChangeMax: 12,
};
