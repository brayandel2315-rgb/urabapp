import { cn } from '@/lib/utils';

/**
 * Iconografía Urabapp — brandboard oficial.
 * Sin fondos: solo trazos/formas con currentColor.
 * viewBox 24×24, alineado a Principales / Categorías / Acciones.
 */
export const BRAND_ICON_KEYS = new Set([
  'home', 'orders', 'cart', 'profile', 'search', 'comida', 'mensajeria', 'mandado',
  'delivery', 'tiendas', 'envios', 'package', 'reparaciones', 'store', 'all',
  'pharmacy', 'market', 'beer', 'banana', 'fries', 'plate', 'food', 'bento',
  'star', 'tag', 'soup', 'shrimp', 'juice', 'hotdog', 'soda', 'rice', 'egg',
  'lotion', 'money', 'cash', 'bank', 'wallet', 'card', 'qr', 'building',
  'phone', 'mobile', 'chat', 'headset', 'link', 'check', 'lock',
  'checkboxOn', 'checkboxOff', 'medalGold', 'medalSilver', 'medalBronze',
  'pet', 'tools', 'empty', 'bolt', 'target', 'confetti', 'settings',
  'map', 'location', 'bell', 'chart', 'users', 'trend', 'alert', 'offline',
  'moon', 'sun', 'chevronDown', 'download', 'share', 'add', 'filter', 'edit',
  'delete', 'back', 'close', 'help', 'more', 'scan', 'favorite', 'moda',
  'belleza', 'hogar', 'educacion', 'deportes', 'ferreteria', 'otros',
  'express', 'scheduled', 'shop', 'courier', 'verified', 'promo', 'pending',
  'processing', 'delivered', 'urgent', 'nequi', 'pse', 'daviplata', 'corresponsal',
]);

function F({ d, ...rest }) {
  return <path d={d} {...rest} />;
}

const ICONS = {
  /* ── Navegación / tab bar ── */
  home: (
    <>
      <F d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" fill="currentColor" />
    </>
  ),
  orders: (
    <>
      <F d="M7 4h10a2 2 0 0 1 2 2v14l-7-3-7 3V6a2 2 0 0 1 2-2Z" fill="currentColor" opacity="0.2" />
      <F d="M7 4h10a2 2 0 0 1 2 2v14l-7-3-7 3V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 8h6M9 11h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  cart: (
    <>
      <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <F d="M6 8h12l-1.2 9H7.2L6 8Z" fill="currentColor" />
      <circle cx="9" cy="19" r="1.4" fill="currentColor" />
      <circle cx="15" cy="19" r="1.4" fill="currentColor" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8.5" r="3.5" fill="currentColor" />
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  favorite: (
    <path
      d="M12 20s-6.5-4.2-8.5-7.8C1.8 9.2 3.6 6 6.8 6c1.7 0 3.2.9 4 2.2.8-1.3 2.3-2.2 4-2.2 3.2 0 5 3.2 3.3 6.2C18.5 15.8 12 20 12 20Z"
      fill="currentColor"
    />
  ),

  /* ── Principales funcionalidades ── */
  mensajeria: (
    <>
      <circle cx="7.5" cy="17.5" r="2.2" fill="currentColor" />
      <circle cx="16.5" cy="17.5" r="2.2" fill="currentColor" />
      <path d="M5 17.5h3l2.2-5.5H14l1.8 3.5H19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M10.5 7.5 12 5h3l1 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="13" cy="5.5" r="2" fill="currentColor" />
    </>
  ),
  mandado: null, /* alias */
  delivery: null,
  envios: (
    <>
      <path d="M5 8.5 12 5l7 3.5v8L12 20l-7-3.5v-8Z" fill="currentColor" opacity="0.25" />
      <path d="M5 8.5 12 5l7 3.5v8L12 20l-7-3.5v-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 5v15M5 8.5 12 12l7-3.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 10v4l3 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  package: null,
  map: (
    <>
      <path d="M12 3.5c-3 0-5.5 2.4-5.5 5.4 0 4.1 5.5 10.6 5.5 10.6S17.5 13 17.5 8.9C17.5 5.9 15 3.5 12 3.5Z" fill="currentColor" />
      <circle cx="12" cy="8.8" r="2" fill="white" />
    </>
  ),
  location: null,
  lock: (
    <>
      <path d="M12 3.5 8 6v3H6.5A1.5 1.5 0 0 0 5 10.5v8A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 17.5 9H16V6l-4-2.5Z" fill="currentColor" opacity="0.2" />
      <path d="M8 9V6.8c0-2.2 1.8-4 4-4s4 1.8 4 4V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="6" y="9" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 13.5 11.5 15 14 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  wallet: (
    <>
      <rect x="4" y="7" width="16" height="11" rx="2.5" fill="currentColor" opacity="0.2" />
      <rect x="4" y="7" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 10h16" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="13.5" r="1.5" fill="currentColor" />
    </>
  ),
  headset: (
    <>
      <path d="M5 14v-2a7 7 0 0 1 14 0v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="4" y="13" width="3" height="5" rx="1.5" fill="currentColor" />
      <rect x="17" y="13" width="3" height="5" rx="1.5" fill="currentColor" />
      <path d="M7 18h2a2 2 0 0 0 2-2v-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  chat: (
    <>
      <path d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="currentColor" opacity="0.2" />
      <path d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="9" cy="11" r="1" fill="currentColor" />
      <circle cx="12" cy="11" r="1" fill="currentColor" />
      <circle cx="15" cy="11" r="1" fill="currentColor" />
    </>
  ),

  /* ── Categorías ── */
  comida: (
    <>
      <path d="M8 4v8M8 4c-1.2 0-2 .8-2 2v2c0 1.2.8 2 2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 4v16M16 4c1.5 0 2.5 1 2.5 2.5S17.5 9 16 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  food: null,
  plate: null,
  market: (
    <>
      <circle cx="9" cy="19" r="1.5" fill="currentColor" />
      <circle cx="17" cy="19" r="1.5" fill="currentColor" />
      <path d="M3 5h2l2.5 11h11L21 9H7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  pharmacy: (
    <>
      <rect x="6" y="4" width="12" height="16" rx="3" fill="currentColor" opacity="0.2" />
      <rect x="6" y="4" width="12" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  store: (
    <>
      <path d="M4 10 12 5l8 5v9H4v-9Z" fill="currentColor" opacity="0.2" />
      <path d="M4 10 12 5l8 5v9H4v-9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 10h16" stroke="currentColor" strokeWidth="1.6" />
      <rect x="9" y="14" width="6" height="5" rx="0.5" fill="currentColor" />
    </>
  ),
  tiendas: null,
  shop: null,
  mobile: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </>
  ),
  phone: null,
  hogar: (
    <path d="M4 11 12 5l8 6v8H4v-8Z" fill="currentColor" />
  ),
  moda: (
    <path d="M8 6h8l2 4-6 10-6-10 2-4Z" fill="currentColor" />
  ),
  belleza: (
    <>
      <rect x="9" y="4" width="3" height="10" rx="1.5" fill="currentColor" />
      <path d="M7 14h10l-1 6H8l-1-6Z" fill="currentColor" opacity="0.35" />
      <path d="M7 14h10l-1 6H8l-1-6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </>
  ),
  pet: (
    <>
      <circle cx="8" cy="9" r="2" fill="currentColor" />
      <circle cx="16" cy="9" r="2" fill="currentColor" />
      <circle cx="6" cy="14" r="1.8" fill="currentColor" />
      <circle cx="18" cy="14" r="1.8" fill="currentColor" />
      <ellipse cx="12" cy="15.5" rx="4" ry="3.5" fill="currentColor" />
    </>
  ),
  tools: (
    <>
      <path d="m5 19 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 8l5-3 3 3-3 5-5-5Z" fill="currentColor" />
      <path d="M14 5l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  ferreteria: null,
  reparaciones: null,
  deportes: (
    <>
      <rect x="5" y="9" width="3" height="8" rx="1.5" fill="currentColor" />
      <rect x="16" y="9" width="3" height="8" rx="1.5" fill="currentColor" />
      <path d="M8 13h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  educacion: (
    <>
      <path d="M4 10 12 6l8 4-8 4-8-4Z" fill="currentColor" />
      <path d="M6 12v4c0 1 2.7 2 6 2s6-1 6-2v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  beer: (
    <>
      <path d="M9 4h6v3H9V4Z" fill="currentColor" />
      <path d="M8 7h8v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V7Z" fill="currentColor" opacity="0.35" />
      <path d="M8 7h8v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 9h1.5a1.5 1.5 0 0 1 0 3H16" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  all: (
    <>
      <rect x="5" y="5" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="13" y="5" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.55" />
      <rect x="5" y="13" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.55" />
      <rect x="13" y="13" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.35" />
    </>
  ),
  otros: null,

  /* ── Acciones UI ── */
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 15 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  filter: (
    <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  ),
  add: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  edit: (
    <>
      <path d="M5 19h3l9.5-9.5a1.5 1.5 0 0 0 0-2.1l-1.4-1.4a1.5 1.5 0 0 0-2.1 0L5 15.5V19Z" fill="currentColor" opacity="0.25" />
      <path d="M13 6.5 17.5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  delete: (
    <>
      <path d="M6 7h12M9 7V5h6v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 7l.8 12h6.4L16 7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="6" r="2" fill="currentColor" />
      <circle cx="6" cy="12" r="2" fill="currentColor" />
      <circle cx="18" cy="18" r="2" fill="currentColor" />
      <path d="M8 11l8-4M8 13l8 4" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  more: (
    <>
      <circle cx="6" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="18" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
  scan: (
    <>
      <path d="M5 5h4v4H5V5ZM15 5h4v4h-4V5ZM5 15h4v4H5v-4ZM15 15h2M17 17h2M15 17v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  bell: (
    <>
      <path d="M12 4a5 5 0 0 0-5 5v3l-1.5 2.5H18.5L17 12V9a5 5 0 0 0-5-5Z" fill="currentColor" opacity="0.2" />
      <path d="M12 4a5 5 0 0 0-5 5v3l-1.5 2.5H18.5L17 12V9a5 5 0 0 0-5-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 18a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 9.2a2 2 0 1 1 3.4 1.4c-.8.7-1.4 1.2-1.4 2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
    </>
  ),
  close: (
    <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  ),
  back: (
    <path d="M14 6 8 12l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  chevronDown: (
    <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  check: (
    <path d="M6 12.5 10 16.5 18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  checkboxOn: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="3" fill="currentColor" />
      <path d="M8 12.5 11 15.5 16 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  checkboxOff: (
    <rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
  ),
  link: (
    <>
      <path d="M9 15a4 4 0 0 0 5.7 0l2-2a4 4 0 0 0-5.7-5.7l-1 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 9a4 4 0 0 0-5.7 0l-2 2a4 4 0 0 0 5.7 5.7l1-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v10M8.5 10.5 12 14l3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 18h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),

  /* ── Estados ── */
  delivered: (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      <path d="M8 12.5 11 15.5 16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  processing: (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.85" />
      <path d="M12 7v5l3 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  pending: (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.85" />
      <circle cx="9" cy="12" r="1.2" fill="white" />
      <circle cx="12" cy="12" r="1.2" fill="white" />
      <circle cx="15" cy="12" r="1.2" fill="white" />
    </>
  ),
  promo: (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      <text x="12" y="15.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="white">%</text>
    </>
  ),
  verified: null,
  urgent: (
    <path d="M12 4l1.8 6H20l-5.2 3.8L17 21 12 16.8 7 21l2.2-7.2L4 10h6.2L12 4Z" fill="currentColor" />
  ),
  express: (
    <path d="M13 3 5 14h6l-1 7 8-12h-6l1-6Z" fill="currentColor" />
  ),
  scheduled: (
    <>
      <rect x="5" y="6" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 4v4M16 4v4M5 10h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),

  /* ── Pagos / otros ── */
  money: (
    <rect x="5" y="7" width="14" height="9" rx="2" fill="currentColor" />
  ),
  cash: null,
  card: (
    <>
      <rect x="4" y="6" width="16" height="12" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 10h16" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  bank: (
    <>
      <path d="M4 10h16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 10v7M10 10v7M14 10v7M18 10v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 5 4 10h16L12 5Z" fill="currentColor" />
    </>
  ),
  building: (
    <>
      <rect x="6" y="4" width="12" height="16" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  qr: (
    <>
      <rect x="5" y="5" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="5" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5" y="13" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 13h2v2h-2v-2ZM17 17h2v2h-2v-2Z" fill="currentColor" />
    </>
  ),
  star: (
    <path d="M12 4l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 9.2l5-.7L12 4Z" fill="currentColor" />
  ),
  tag: (
    <>
      <path d="M5 5h7l7 7-7 7-7-7V5Z" fill="currentColor" opacity="0.25" />
      <path d="M5 5h7l7 7-7 7-7-7V5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
    </>
  ),
  bolt: (
    <path d="M13 3 5 14h6l-1 7 8-12h-6l1-6Z" fill="currentColor" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 3 19h18L12 4Z" fill="currentColor" opacity="0.2" />
      <path d="M12 4 3 19h18L12 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 10v4M12 16.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  chart: (
    <>
      <path d="M5 19V9M10 19V5M15 19v-7M20 19v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="9" r="3" fill="currentColor" />
      <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="10" r="2.5" fill="currentColor" opacity="0.5" />
    </>
  ),
  trend: (
    <path d="M5 16 10 11l4 4 5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  confetti: (
    <>
      <path d="M7 7l3 3M17 7l-3 3M12 4v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="6" cy="14" r="1.5" fill="currentColor" />
      <circle cx="18" cy="13" r="1.5" fill="currentColor" />
      <rect x="11" y="15" width="2" height="2" rx="0.3" fill="currentColor" transform="rotate(20 12 16)" />
    </>
  ),
  moon: (
    <path d="M18 14.5A6.5 6.5 0 0 1 9.5 6 7 7 0 1 0 18 14.5Z" fill="currentColor" />
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  offline: (
    <>
      <path d="M3 10.5A9 9 0 0 1 12 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.5 14A5.5 5.5 0 0 1 12 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.2" fill="currentColor" />
      <path d="M4 4 20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  empty: (
    <path d="M6 8h12v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  ),
  courier: null,
  corresponsal: null,
  nequi: null,
  pse: null,
  daviplata: null,
  medalGold: (
    <circle cx="12" cy="14" r="5" fill="currentColor" opacity="0.3" />
  ),
  medalSilver: null,
  medalBronze: null,
  banana: null,
  fries: null,
  bento: null,
  soup: null,
  shrimp: null,
  juice: null,
  hotdog: null,
  soda: null,
  rice: null,
  egg: null,
  lotion: null,
};

/* Aliases → icono canónico */
const ALIASES = {
  mandado: 'mensajeria',
  delivery: 'mensajeria',
  package: 'envios',
  location: 'map',
  food: 'comida',
  plate: 'comida',
  tiendas: 'store',
  shop: 'store',
  phone: 'mobile',
  ferreteria: 'tools',
  reparaciones: 'tools',
  otros: 'all',
  cash: 'money',
  courier: 'mensajeria',
  corresponsal: 'store',
  nequi: 'mobile',
  pse: 'bank',
  daviplata: 'wallet',
  verified: 'delivered',
  medalSilver: 'medalGold',
  medalBronze: 'medalGold',
  banana: 'market',
  fries: 'comida',
  bento: 'comida',
  soup: 'comida',
  shrimp: 'comida',
  juice: 'comida',
  hotdog: 'comida',
  soda: 'comida',
  rice: 'comida',
  egg: 'comida',
  lotion: 'belleza',
};

function resolveBrandIcon(name) {
  const key = ALIASES[name] || name;
  if (ICONS[key]) return ICONS[key];
  return ICONS.store;
}

export function hasBrandIcon(name) {
  const key = ALIASES[name] || name;
  return Boolean(ICONS[key] || ALIASES[name]);
}

export default function UrabappBrandIcon({ name, size = 24, className }) {
  const content = resolveBrandIcon(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      {content}
    </svg>
  );
}
