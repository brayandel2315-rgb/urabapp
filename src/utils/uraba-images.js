/**
 * Fotos del Urabá — Wikimedia Commons (CC BY-SA 4.0).
 * Solo URLs verificadas (sin collages). Ver URABA_PHOTO_CREDITS.
 */

import { DEFAULT_MUNICIPALITY } from './constants';

const W = 'https://upload.wikimedia.org/wikipedia/commons/thumb';

const WIKI = {
  bananerasApartado: `${W}/1/1e/Apartad%C3%B3_bananeras.jpg/1280px-Apartad%C3%B3_bananeras.jpg`,
  playaTurbo: `${W}/d/d2/Amanecer_Playa_Simona-Turbo_Antioquia.jpg/1280px-Amanecer_Playa_Simona-Turbo_Antioquia.jpg`,
  turboCosta: `${W}/b/bb/Turbouraba1.jpg/1280px-Turbouraba1.jpg`,
  camaraComercio: `${W}/7/7e/Camara_de_Comercio_de_Urab%C3%A1.jpg/1280px-Camara_de_Comercio_de_Urab%C3%A1.jpg`,
  bananoCultivo: `${W}/d/dc/Colbanana09.jpg/1280px-Colbanana09.jpg`,
  golfoUraba: `${W}/4/4a/Golfo_de_Urab%C3%A1_y_delta_del_Atrato.JPG/1280px-Golfo_de_Urab%C3%A1_y_delta_del_Atrato.JPG`,
  /** Mapa regional satelital — NASA, dominio público (local UHD en public/uraba) */
  mapaUrabaUhd: '/uraba/mapa-uraba-uhd.jpg',
  carepaAeropuerto: `${W}/3/3d/Carepa_Aeropuerto.JPG/1280px-Carepa_Aeropuerto.JPG`,
};

/** Perfil visual por municipio — una foto icónica + encuadre */
export const MUNICIPIO_HERO = [
  {
    name: 'Necoclí',
    hint: 'Caribe urabaño',
    place: 'Golfo de Urabá',
    image: WIKI.golfoUraba,
    objectPosition: 'center center',
  },
  {
    name: 'Turbo',
    hint: 'Puerto y playas',
    place: 'Playa Simona',
    image: WIKI.playaTurbo,
    objectPosition: 'center bottom',
  },
  {
    name: 'Apartadó',
    hint: 'Corazón del Urabá',
    place: 'Bananera del Urabá',
    image: WIKI.bananerasApartado,
    objectPosition: 'center 40%',
  },
  {
    name: 'Carepa',
    hint: 'A orillas de la troncal',
    place: 'Aeropuerto Antonio Roldán Betancourt',
    image: WIKI.carepaAeropuerto,
    objectPosition: 'center center',
  },
  {
    name: 'Chigorodó',
    hint: 'Banano y comercio',
    place: 'Cultivo bananero',
    image: WIKI.bananoCultivo,
    objectPosition: 'center 35%',
  },
];

const HERO_BY_NAME = Object.fromEntries(MUNICIPIO_HERO.map((m) => [m.name, m]));

export const URABA_HERO_IMAGES = {
  primary: WIKI.bananerasApartado,
  commerce: WIKI.camaraComercio,
  workers: WIKI.camaraComercio,
  street: WIKI.bananerasApartado,
  banana: WIKI.bananerasApartado,
  coast: WIKI.golfoUraba,
  turboBeach: WIKI.playaTurbo,
  turbo: WIKI.turboCosta,
  bananoFarm: WIKI.bananoCultivo,
  golfo: WIKI.golfoUraba,
  regionMap: WIKI.mapaUrabaUhd,
  troncal: WIKI.turboCosta,
  nuestroUraba: WIKI.camaraComercio,
};

export const URABA_BANNER_IMAGES = MUNICIPIO_HERO.map((m) => m.image);

export function getMunicipioHeroProfile(municipio) {
  return HERO_BY_NAME[municipio] || HERO_BY_NAME[DEFAULT_MUNICIPALITY] || MUNICIPIO_HERO[0];
}

export function getMunicipioHeroImage(municipio) {
  return getMunicipioHeroProfile(municipio).image;
}

export function getMunicipioHeroPlace(municipio) {
  return getMunicipioHeroProfile(municipio).place;
}

export const URABA_PHOTO_CREDITS = [
  { file: 'Apartadó bananeras.jpg', author: 'Moterocolombia', license: 'CC BY-SA 4.0', place: 'Bananeras, Apartadó' },
  { file: 'Amanecer Playa Simona-Turbo Antioquia.jpg', author: 'BEIBY FERNANDEZ', license: 'CC BY-SA 4.0', place: 'Playa Simona, Turbo' },
  { file: 'Carepa Aeropuerto.JPG', author: 'Wikimedia Commons', license: 'CC BY-SA 4.0', place: 'Aeropuerto, Carepa' },
  { file: 'Colbanana09.jpg', author: 'Wikimedia Commons', license: 'CC BY-SA 4.0', place: 'Cultivo banano, Colombia' },
  { file: 'Golfo de Urabá y delta del Atrato.JPG', author: 'NASA/Expedition 16', license: 'Public Domain', place: 'Golfo de Urabá' },
  { file: 'Camara de Comercio de Urabá.jpg', author: 'Wikimedia Commons', license: 'CC BY-SA 4.0', place: 'Cámara de Comercio, Urabá' },
  { file: 'Turbouraba1.jpg', author: 'Wikimedia Commons', license: 'CC BY-SA 4.0', place: 'Turbo' },
];
