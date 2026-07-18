/**
 * Títulos contextuales para el home (hora + municipio).
 * Sin dependencias de red — puro UX copy.
 */

export function getDaypart(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 11) return 'morning';
  if (h >= 11 && h < 15) return 'lunch';
  if (h >= 15 && h < 18) return 'afternoon';
  if (h >= 18 && h < 23) return 'dinner';
  return 'late';
}

const OPEN_TITLES = {
  morning: (m) => `Desayuno y mercado en ${m}`,
  lunch: (m) => `Almuerzo cerca en ${m}`,
  afternoon: (m) => `Algo rico esta tarde en ${m}`,
  dinner: (m) => `Cena a domicilio en ${m}`,
  late: (m) => `Abiertos ahora en ${m}`,
};

const OPEN_SUBTITLES = {
  morning: 'Café, panadería y lo que necesitas al empezar el día',
  lunch: 'Lo más pedido cerca de ti · entrega estimada visible',
  afternoon: 'Merienda, mercado o un antojo sin filas',
  dinner: 'Restaurantes y tiendas listos para entregar',
  late: 'Opciones disponibles a esta hora en tu zona',
};

export function getContextualOpenStoresCopy(municipio, date = new Date()) {
  const part = getDaypart(date);
  const m = municipio || 'Urabá';
  return {
    daypart: part,
    title: OPEN_TITLES[part](m),
    subtitle: OPEN_SUBTITLES[part],
  };
}

export function getContextualServicesSubtitle(date = new Date()) {
  const part = getDaypart(date);
  if (part === 'morning') return 'Empieza el día: mercado, farmacia o un mandado';
  if (part === 'lunch' || part === 'dinner') return 'Comida, envíos y lo que Urabá necesita ahora';
  if (part === 'late') return 'Mandados, farmacia y lo esencial a esta hora';
  return 'Todo lo que Urabá necesita, en un solo lugar';
}

/** Sugerencias de búsqueda “inteligentes” por franja (UI, sin backend AI). */
export function getContextualSearchHints(municipio, date = new Date()) {
  const part = getDaypart(date);
  const m = municipio || 'Urabá';
  const byPart = {
    morning: ['Desayuno', 'Café', 'Panadería', 'Mercado', 'Farmacia'],
    lunch: ['Almuerzo', 'Comida típica', 'Jugo', 'Restaurante', 'Menú del día'],
    afternoon: ['Merienda', 'Mercado', 'Farmacia', 'Snacks', 'Mandado'],
    dinner: ['Cena', 'Pizza', 'Pollo', 'Comida rápida', 'Domicilio'],
    late: ['Farmacia', 'Mandado', 'Tienda 24h', 'Agua', 'Algo rápido'],
  };
  return {
    daypart: part,
    title: part === 'late' ? `Útil ahora en ${m}` : `Sugerido para ti en ${m}`,
    hints: byPart[part],
  };
}

export function getContextualSearchHeadline(date = new Date()) {
  const part = getDaypart(date);
  if (part === 'morning') return '¿Qué necesitas esta mañana?';
  if (part === 'lunch') return '¿Qué almorzamos hoy?';
  if (part === 'afternoon') return '¿Qué se te antoja esta tarde?';
  if (part === 'dinner') return '¿Qué cenamos en Urabá?';
  return '¿Qué necesitas ahora?';
}
