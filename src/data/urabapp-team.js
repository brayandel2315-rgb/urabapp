/**
 * Fundadores y equipo de Urabapp.
 * Agrega miembros en URABAPP_FOUNDERS o URABAPP_TEAM.
 */

export const URABAPP_FOUNDER = {
  id: 'founder-sebrayan',
  name: 'Sebrayan Gulfo Carrascal',
  role: 'Fundador & producto',
  municipio: 'Apartadó',
  region: 'Urabá antioqueño',
  bio: 'Creció en el Urabá viendo de cerca cómo la gente pedía por WhatsApp, confiaba en el tendero del barrio y esperaba al mensajero que conocía cada calle. Pero cada pedido era un hilo suelto: sin registro, sin seguimiento y con comercios pequeños invisibles frente a las grandes cadenas. Urabapp nació de esa realidad — de la mamá que no alcanza a salir, del negocio de la esquina que no aparece en internet y del repartidor que ya domina la troncal pero necesita pedidos organizados.',
  quote: 'El Urabá no necesita copiar a nadie — necesita su propia forma de pedir, vender y entregar.',
  initials: 'SG',
  photo: '/team/sebrayan-founder.png',
};

export const URABAPP_FOUNDERS = [URABAPP_FOUNDER];

export const URABAPP_TEAM = [
  {
    id: 'team-comercios',
    name: 'Comercios aliados',
    role: 'Red de negocios locales',
    municipio: '5 municipios',
    bio: 'Restaurantes, farmacias, mercados y tiendas de Apartadó, Turbo, Carepa, Chigorodó y Necoclí. Cada uno con catálogo, horarios y reseñas reales de vecinos.',
    initials: 'CA',
    collective: true,
  },
  {
    id: 'team-mensajeros',
    name: 'Mensajeros del Urabá',
    role: 'Red de entregas',
    municipio: 'Troncal del Urabá',
    bio: 'Repartidores de la región que conocen barrios, callejones y rutas intermunicipales. No son de otra ciudad — son de acá, con la troncal en la cabeza.',
    initials: 'MU',
    collective: true,
  },
  {
    id: 'team-soporte',
    name: 'Soporte Urabapp',
    role: 'Atención en la app',
    municipio: 'Urabá',
    bio: 'Resuelve novedades de pedidos, acompaña a comercios y clientes, y mantiene todo registrado dentro de la plataforma — sin chats perdidos.',
    initials: 'SU',
    collective: true,
  },
];

export const URABAPP_TEAM_INTRO = `Detrás de ${URABAPP_FOUNDER.name.split(' ')[0]} y el equipo que crece cada día, Urabapp une comercios, clientes y mensajeros en toda la región.`;

export const URABAPP_ORIGIN_BY_FOUNDER = {
  headline: 'Una idea que nació en el barrio',
  text: `${URABAPP_FOUNDER.name} vio en el día a día del Urabá antioqueño un problema sencillo de decir y difícil de resolver: pedir comida, mercado o un mandado dependía de chats sueltos, llamadas perdidas y comercios que no tenían cómo mostrarse en línea. Urabapp nació para ordenar eso — con registro, seguimiento y mensajeros de la zona — sin perder la confianza de barrio que ya existía.`,
};
