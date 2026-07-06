import {
  isValidColombianPhone,
  isValidAddress,
  sanitizeText,
  normalizePhoneColombia,
  formatPhoneDisplay,
} from '@/utils/validate';
import { isWithinUraba } from '@/utils/geo-bounds';
import { BARRIO_ALL_ID, isValidBarrio } from '@/utils/barrio';
import { CHECKOUT_LIMITS } from '../constants';

const FAKE_NAME_RE = /^[\d\s\-.]+$/;
const EMOJI_ONLY_RE = /^[\p{Emoji}\s]+$/u;

export function isValidCheckoutName(name) {
  const trimmed = String(name || '').trim();
  if (trimmed.length < CHECKOUT_LIMITS.nameMin) return false;
  if (trimmed.length > CHECKOUT_LIMITS.nameMax) return false;
  if (FAKE_NAME_RE.test(trimmed)) return false;
  if (EMOJI_ONLY_RE.test(trimmed)) return false;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 1 && words[0].length < 4) return false;
  return true;
}

export function isValidDeliveryReference(reference) {
  const trimmed = String(reference || '').trim();
  return trimmed.length >= CHECKOUT_LIMITS.referenceMin
    && trimmed.length <= CHECKOUT_LIMITS.referenceMax;
}

export function isValidDeliveryCoordinates(lat, lng) {
  return isWithinUraba(lat, lng);
}

export function validateCheckoutStep(step, form) {
  const errors = {};

  if (step === 'delivery' || step === 'review') {
    if (!isValidCheckoutName(form.fullName)) {
      errors.fullName = 'Ingresa tu nombre real (mínimo 3 caracteres, sin números solos).';
    }
    if (!isValidColombianPhone(form.phone)) {
      errors.phone = 'Celular inválido. Usa 10 dígitos que empiecen en 3 (ej: 300 123 4567).';
    }
    if (!isValidAddress(form.address) || form.address.trim().length < CHECKOUT_LIMITS.addressMin) {
      errors.address = 'Dirección muy corta. Incluye calle, número y barrio.';
    }
    if (!isValidDeliveryReference(form.reference)) {
      errors.reference = 'Agrega referencia clara para el repartidor (mín. 8 caracteres): color de casa, piso, punto de referencia.';
    }
    if (!form.barrio?.trim() || form.barrio === BARRIO_ALL_ID) {
      errors.barrio = 'Elige el barrio exacto donde recibir el pedido.';
    } else if (form.municipio && !isValidBarrio(form.municipio, form.barrio)) {
      errors.barrio = 'Selecciona un barrio válido de la lista.';
    }
    if (!isValidDeliveryCoordinates(form.mapLat ?? form.latitude, form.mapLng ?? form.longitude)) {
      errors.location = 'Marca el punto exacto en el mapa dentro de Urabá. Es obligatorio para la entrega.';
    }
  }

  if (step === 'payment' || step === 'review') {
    if (form.paymentMethod === 'cash' && form.cashChange) {
      const digits = String(form.cashChange).replace(/\D/g, '');
      if (digits && Number(digits) < form.total) {
        errors.cashChange = 'El valor para cambio debe ser mayor al total del pedido.';
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function normalizeCheckoutContact({ fullName, phone }) {
  return {
    fullName: sanitizeText(fullName, CHECKOUT_LIMITS.nameMax),
    phone: normalizePhoneColombia(phone),
    phoneDisplay: formatPhoneDisplay(phone),
  };
}

export function buildCheckoutAuditNotes({ reference, cashChange, barrio, fullName, phone }) {
  const parts = [];
  if (reference?.trim()) parts.push(sanitizeText(reference, CHECKOUT_LIMITS.referenceMax));
  if (cashChange?.trim()) parts.push(`Cambio: ${sanitizeText(cashChange, CHECKOUT_LIMITS.cashChangeMax)}`);
  if (barrio) parts.push(`Barrio: ${sanitizeText(barrio, 80)}`);
  parts.push(`Contacto verificado: ${sanitizeText(fullName, 60)} · ${normalizePhoneColombia(phone)}`);
  return parts.join(' | ');
}
