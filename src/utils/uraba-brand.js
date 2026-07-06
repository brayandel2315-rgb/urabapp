/** Identidad visual y copy regional — Urabá antioqueño */

import { MUNICIPALITIES } from './constants';

export {
  URABA_HERO_IMAGES,
  URABA_BANNER_IMAGES,
  MUNICIPIO_HERO,
  getMunicipioHeroProfile,
  getMunicipioHeroImage,
  getMunicipioHeroPlace,
  URABA_PHOTO_CREDITS,
} from './uraba-images';

const TRONCAL_HINTS = {
  Necoclí: 'Caribe urabaño',
  Turbo: 'Puerto y playas',
  Apartadó: 'Corazón del Urabá',
  Carepa: 'A orillas de la troncal',
  Chigorodó: 'Banano y comercio',
};

/** Orden Troncal del Urabá — entrando desde Medellín */
export const TRONCAL_MUNICIPALITIES = MUNICIPALITIES.map((name) => ({
  name,
  hint: TRONCAL_HINTS[name],
}));

export const TRONCAL_ROUTE_LABEL = MUNICIPALITIES.join(' → ');

export const URABA_IDENTITY_CHIPS = [
  { icon: 'banana', label: 'Banano urabaño' },
  { icon: 'store', label: 'Nuestro Urabá' },
  { icon: 'shrimp', label: 'Playas del Golfo' },
  { icon: 'headset', label: 'Vibra reggae' },
];

export const URABA_REGIONAL_TAGLINE =
  'De Necoclí a Chigorodó, la troncal nos conecta — comercio, playa y gente que trabaja duro.';

export function getRegionalSubline(municipio) {
  const lines = {
    Apartadó: 'Centro, Nuestro Urabá, Laureles — tu barrio, tu gente.',
    Turbo: 'Del puerto y las playas hasta tu puerta.',
    Carepa: 'A orilla de la carretera, con sabor de barrio.',
    Chigorodó: 'Entre banano y comercio, pedimos como familia.',
    Necoclí: 'Brisa caribeña y antojos de la costa urabaña.',
  };
  return lines[municipio] || 'Comercios reales, mensajeros de acá, pagas al recibir.';
}
