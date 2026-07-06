/**
 * Barrios oficiales de Apartadó (cabecera municipal) — 4 comunas.
 * Fuente: división político-administrativa del municipio.
 */

export const BARRIO_ALL_ID = '';

export const APARTADO_COMUNAS = [
  {
    id: 'c1',
    name: 'Comuna 1',
    subtitle: 'Bernardo Jaramillo Ossa',
    barrios: [
      'Policarpa',
      'Antonio Roldán',
      'La Paz',
      'Diana Cardona',
      'La Alborada',
      'Fondo Obrero',
      'Santa María',
      'Alfonso López',
      'San Fernando',
      'El Concejo',
      'Pardo Leal',
    ],
  },
  {
    id: 'c2',
    name: 'Comuna 2',
    subtitle: 'Ocho de Febrero',
    barrios: ['Obrero', 'Las Brisas', 'Primero de Mayo'],
  },
  {
    id: 'c3',
    name: 'Comuna 3',
    subtitle: 'Pueblo Nuevo',
    barrios: [
      'Pueblo Nuevo',
      'La Esperanza',
      'Nueve de Octubre',
      'La Cadena',
      'Las Playas',
      'Parroquial',
      'Manzanares',
      'La Navarra',
      'La Esmeralda',
      'San Judas',
      'El Paraíso',
    ],
  },
  {
    id: 'c4',
    name: 'Comuna 4',
    subtitle: 'José Joaquín Vélez',
    barrios: [
      'Vélez',
      'El Estadio',
      'Laureles',
      'Nueva Civilización',
      'Simón Bolívar',
      'La Libertad',
      'Chinita',
      'Los Pinos',
      'Ortiz',
      'Los Almendros',
      'El Amparo',
      'Villa del Río',
      'Pueblo Quemao',
      'El Darién',
      'La Serranía',
      'Fundadores',
    ],
  },
];

/** Barrios con más pedidos — acceso rápido en el picker */
export const APARTADO_POPULAR_BARRIOS = [
  'Pueblo Nuevo',
  'Laureles',
  'Ortiz',
  'Vélez',
  'Las Brisas',
  'El Estadio',
  'Parroquial',
  'La Esperanza',
  'Los Pinos',
  'Fundadores',
];

export const APARTADO_ALL_BARRIOS = APARTADO_COMUNAS.flatMap((c) => c.barrios);

/** Compatibilidad con datos legacy en BD (zone simplificada) */
export const LEGACY_ZONE_TO_BARRIOS = {
  Centro: ['Pueblo Nuevo', 'Parroquial', 'La Cadena', 'El Paraíso', 'La Esperanza'],
  Ortiz: ['Ortiz'],
  Laureles: ['Laureles'],
  Vélez: ['Vélez'],
};

/** @deprecated Usar APARTADO_ALL_BARRIOS */
export const APARTADO_ZONES = APARTADO_ALL_BARRIOS;

export function getComunaForBarrio(barrio) {
  if (!barrio) return null;
  return APARTADO_COMUNAS.find((c) => c.barrios.includes(barrio)) ?? null;
}

export function searchBarrios(query) {
  const q = query.trim().toLowerCase();
  if (!q) return APARTADO_COMUNAS;
  return APARTADO_COMUNAS.map((comuna) => ({
    ...comuna,
    barrios: comuna.barrios.filter((b) => b.toLowerCase().includes(q)),
  })).filter((c) => c.barrios.length > 0);
}
