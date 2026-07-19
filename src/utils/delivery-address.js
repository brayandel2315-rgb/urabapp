import { isValidAddress } from '@/utils/validate';
import { BARRIO_ALL_ID, isSpecificBarrio, isValidBarrio } from '@/utils/barrio';
import { CHECKOUT_LIMITS } from '@/modules/checkout/constants';

/** Dirección de casa lista para usar en un pedido. */
export function isCompleteDeliveryAddress(addr) {
  if (!addr) return false;
  const address = String(addr.address || '').trim();
  const reference = String(addr.reference || '').trim();
  const barrio = String(addr.barrio || '').trim();
  if (!isValidAddress(address) || address.length < CHECKOUT_LIMITS.addressMin) return false;
  if (reference.length < CHECKOUT_LIMITS.referenceMin) return false;
  if (!barrio || barrio === BARRIO_ALL_ID || !isSpecificBarrio(barrio)) return false;
  if (addr.municipio && !isValidBarrio(addr.municipio, barrio)) return false;
  return true;
}

export function pickDefaultDeliveryAddress(addresses = []) {
  const complete = addresses.filter(isCompleteDeliveryAddress);
  return complete.find((a) => a.is_default) || complete[0] || null;
}

export function validateAddressForm({ label, barrio, address, reference, municipio }) {
  const errors = {};
  if (!String(label || '').trim()) errors.label = 'Elige el tipo (Casa, Trabajo u Otro).';
  if (!isSpecificBarrio(barrio)) {
    errors.barrio = 'Elige un barrio válido de la lista.';
  } else if (municipio && !isValidBarrio(municipio, barrio)) {
    errors.barrio = `Selecciona un barrio válido de ${municipio}.`;
  }
  if (!isValidAddress(address) || String(address).trim().length < CHECKOUT_LIMITS.addressMin) {
    errors.address = 'Dirección incompleta. Incluye calle, número y detalles.';
  }
  if (String(reference || '').trim().length < CHECKOUT_LIMITS.referenceMin) {
    errors.reference = 'Referencia obligatoria (mín. 8 caracteres): color, piso, punto cercano.';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
