import { STORE } from '@/utils/marketplace-copy';

/** Enlaces del pie de página home — compartido móvil y escritorio. */
export const HOME_FOOTER_COLUMNS = [
  {
    id: 'empresa',
    title: 'Empresa',
    links: [
      { label: 'Quiénes somos', to: '/quienes-somos' },
      { label: 'Cómo funciona', to: '/info/como-funciona' },
    ],
  },
  {
    id: 'ayuda',
    title: 'Ayuda',
    links: [
      { label: 'Centro de ayuda', to: '/soporte' },
      { label: 'FAQ', to: '/info/faq' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal',
    links: [
      { label: 'Privacidad', to: '/legal/privacidad' },
      { label: 'Términos', to: '/legal/terminos' },
      { label: 'Cookies', to: '/legal/cookies' },
      { label: 'Seguridad', to: '/info/seguridad' },
    ],
  },
  {
    id: 'partners',
    title: 'Únete',
    links: [
      { label: STORE.register, to: '/info/registrar-comercio' },
      { label: 'Ser domiciliario', to: '/domiciliario/registro' },
    ],
  },
];

export const HOME_FOOTER_LINKS = Object.fromEntries(
  HOME_FOOTER_COLUMNS.map((col) => [col.id, col.links]),
);

export const HOME_FOOTER_GROUP_LABELS = Object.fromEntries(
  HOME_FOOTER_COLUMNS.map((col) => [col.id, col.title]),
);
