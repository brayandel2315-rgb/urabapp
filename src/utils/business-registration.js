import { isValidColombianNit, isValidNaturalTaxId, formatNitDisplay } from './colombia-tax-id';

export const LEGAL_ENTITY_TYPES = {
  natural: {
    id: 'natural',
    label: 'Persona natural',
    hint: 'Emprendedor, tendero o independiente con RUT de la DIAN.',
  },
  juridica: {
    id: 'juridica',
    label: 'Persona jurídica',
    hint: 'Empresa constituida con NIT y matrícula en Cámara de Comercio.',
  },
};

/** Categorías que requieren permiso sanitario (Invima) */
export const SANITARY_CATEGORY_IDS = new Set(['comida', 'mercado', 'farmacia', 'licoreria']);

/** Especificaciones de medios — estandarizado para la app */
export const BUSINESS_MEDIA_SPECS = {
  logo: {
    id: 'logo',
    label: 'Logo de la tienda',
    required: true,
    aspect: 'square',
    accept: 'image/jpeg,image/png,image/webp',
    maxMb: 5,
    minPx: { w: 400, h: 400 },
    recommendedPx: { w: 512, h: 512 },
    ratio: '1:1',
    hint: 'JPG o PNG · cuadrado · mín. 400×400 px · máx. 5 MB',
    tips: [
      'Fondo sólido o transparente (PNG).',
      'Sin texto ilegible ni marcas de agua.',
      'Se muestra redondo en listados y cuadrado en tu tienda.',
    ],
  },
  cover: {
    id: 'cover',
    label: 'Foto de portada',
    required: false,
    aspect: 'banner',
    accept: 'image/jpeg,image/png,image/webp',
    maxMb: 5,
    minPx: { w: 1200, h: 600 },
    recommendedPx: { w: 1600, h: 800 },
    ratio: '2:1',
    hint: 'JPG o PNG · horizontal 2:1 · mín. 1200×600 px · máx. 5 MB',
    tips: [
      'Fachada del local, mostrador o plato estrella.',
      'Buena luz; evita fotos borrosas o muy oscuras.',
      'Aparece arriba de tu tienda en Urabapp.',
    ],
  },
  product: {
    id: 'product',
    label: 'Foto del producto',
    required: false,
    aspect: 'square',
    accept: 'image/jpeg,image/png,image/webp',
    maxMb: 5,
    minPx: { w: 600, h: 600 },
    recommendedPx: { w: 800, h: 800 },
    ratio: '1:1',
    hint: 'JPG o PNG · cuadrado · mín. 600×600 px · máx. 5 MB',
    tips: [
      'Producto centrado, fondo limpio.',
      'Misma proporción en todo el menú = catálogo más profesional.',
    ],
  },
};

export const LEGAL_DOC_SPECS = {
  rut: {
    label: 'RUT (DIAN)',
    description: 'Registro Único Tributario vigente. Puede ser captura del PDF oficial o foto legible.',
    accept: 'image/jpeg,image/png,image/webp,application/pdf',
    maxMb: 8,
    hint: 'PDF o imagen · máx. 8 MB · texto legible',
  },
  cedula_front: {
    label: 'Cédula — frente',
    description: 'Foto clara del lado frontal. Sin reflejos; bordes completos visibles.',
    accept: 'image/jpeg,image/png,image/webp',
    maxMb: 8,
    hint: 'JPG o PNG · máx. 8 MB',
  },
  cedula_back: {
    label: 'Cédula — reverso',
    description: 'Reverso de la cédula del representante o titular.',
    accept: 'image/jpeg,image/png,image/webp',
    maxMb: 8,
    hint: 'JPG o PNG · máx. 8 MB',
  },
  camara_comercio: {
    label: 'Certificado Cámara de Comercio',
    description: 'Certificado de existencia y representación legal, vigencia no mayor a 30 días.',
    accept: 'image/jpeg,image/png,image/webp,application/pdf',
    maxMb: 8,
    hint: 'PDF o imagen · máx. 8 MB',
  },
  invima: {
    label: 'Registro sanitario (Invima)',
    description: 'Requerido para comida, mercado, farmacia y licores. Resolución o notificación sanitaria vigente.',
    accept: 'image/jpeg,image/png,image/webp,application/pdf',
    maxMb: 8,
    hint: 'PDF o imagen · máx. 8 MB',
  },
  licencia_licores: {
    label: 'Licencia de licores',
    description: 'Permiso municipal o departamental de expendio de bebidas alcohólicas.',
    accept: 'image/jpeg,image/png,image/webp,application/pdf',
    maxMb: 8,
    hint: 'PDF o imagen · máx. 8 MB',
  },
};

export function getRequiredLegalDocuments({ legalEntityType, categoryId }) {
  const docs = [];

  if (legalEntityType === 'natural') {
    docs.push(
      { key: 'rut', ...LEGAL_DOC_SPECS.rut, required: true },
      { key: 'cedula_front', ...LEGAL_DOC_SPECS.cedula_front, required: true },
      { key: 'cedula_back', ...LEGAL_DOC_SPECS.cedula_back, required: true },
    );
  } else {
    docs.push(
      { key: 'camara_comercio', ...LEGAL_DOC_SPECS.camara_comercio, required: true },
      { key: 'rut', ...LEGAL_DOC_SPECS.rut, required: true },
      { key: 'cedula_front', ...LEGAL_DOC_SPECS.cedula_front, required: true },
    );
  }

  if (SANITARY_CATEGORY_IDS.has(categoryId)) {
    docs.push({ key: 'invima', ...LEGAL_DOC_SPECS.invima, required: categoryId === 'farmacia' });
  }
  if (categoryId === 'licoreria') {
    docs.push({ key: 'licencia_licores', ...LEGAL_DOC_SPECS.licencia_licores, required: true });
  }

  return docs;
}

export function validateBusinessTaxId({ legalEntityType, taxId }) {
  const trimmed = String(taxId || '').trim();
  if (!trimmed) return 'Ingresa NIT o cédula de la tienda';

  if (legalEntityType === 'juridica') {
    if (!isValidColombianNit(trimmed)) {
      return 'NIT inválido. Verifica el número y el dígito de verificación (ej. 900.123.456-7)';
    }
    return null;
  }

  if (!isValidNaturalTaxId(trimmed) && !isValidColombianNit(trimmed)) {
    return 'Ingresa una cédula (6–10 dígitos) o NIT válido';
  }
  return null;
}

export function formatTaxIdForDisplay({ legalEntityType, taxId }) {
  const digits = String(taxId || '').replace(/\D/g, '');
  if (legalEntityType === 'juridica' && digits.length >= 8) {
    return formatNitDisplay(digits);
  }
  return digits;
}

export const MERCHANT_LEGAL_CONSENTS = [
  {
    id: 'terms',
    docSlug: 'terminos',
    label: 'Acepto los Términos y condiciones de Urabapp',
  },
  {
    id: 'privacy',
    docSlug: 'privacidad',
    label: 'Autorizo el tratamiento de datos personales (Ley 1581 de 2012)',
  },
  {
    id: 'merchant',
    docSlug: 'comercio',
    label: 'Acepto el Acuerdo de comercio aliado y las condiciones del marketplace',
  },
  {
    id: 'truthful',
    docSlug: null,
    label: 'Declaro que la información y documentos son verídicos y me corresponden',
  },
];

export const ONBOARDING_STEPS = [
  { id: 1, label: 'Tu tienda', minutes: 3 },
  { id: 2, label: 'Imágenes', minutes: 2 },
  { id: 3, label: 'Legal Colombia', minutes: 4 },
  { id: 4, label: 'Catálogo', minutes: 3 },
];
