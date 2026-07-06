export function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export function getFirstName(profile, user) {
  const raw = profile?.full_name || user?.user_metadata?.full_name || '';
  const first = raw.trim().split(/\s+/)[0];
  return first || null;
}

const MUNICIPAL_HEADLINES = {
  Apartadó: '¿Qué se te antoja en Apartadó?',
  Turbo: '¿Del puerto a tu casa qué te antoja?',
  Carepa: 'A orilla de la troncal — ¿qué necesitas?',
  Chigorodó: 'Entre banano y comercio, ¿qué te llevo?',
  Necoclí: 'Brisa de playa y antojo de costa — ¿qué pedimos?',
};

export function getHomeHeadline(municipio, barrio = null) {
  if (barrio) {
    return `¿Qué pedimos en ${barrio}?`;
  }
  return MUNICIPAL_HEADLINES[municipio] || `¿Qué se te antoja en ${municipio}?`;
}
