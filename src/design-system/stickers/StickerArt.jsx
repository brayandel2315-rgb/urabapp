/**
 * UrabApp IA Stickers — colección vectorial premium (soft 3D, minimal).
 * PROHIBIDO usar emojis en UI; usar StickerIcon o ActionButton.
 */
import { useId } from 'react';
import { cn } from '@/lib/utils';

function StickerShell({ children, className, size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      {children}
    </svg>
  );
}

function useGrad() {
  const id = useId().replace(/:/g, '');
  const main = `sg-${id}`;
  const shine = `sh-${id}`;
  return { main, shine };
}

export function StickerSearch({ size, className }) {
  const { main, shine } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" /><stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id={shine} x1="14" y1="12" x2="28" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.45" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="12" fill={`url(#${main})`} />
      <circle cx="22" cy="22" r="12" fill={`url(#${shine})`} />
      <path d="M30 30L38 38" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
      <circle cx="22" cy="22" r="7" stroke="#ECFDF5" strokeWidth="2" fill="none" />
    </StickerShell>
  );
}

export function StickerRestaurant({ size, className }) {
  const { main, shine } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" /><stop offset="1" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id={shine} x1="14" y1="10" x2="30" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.5" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="10" y="18" width="28" height="20" rx="6" fill={`url(#${main})`} />
      <rect x="10" y="18" width="28" height="20" rx="6" fill={`url(#${shine})`} />
      <path d="M16 18V12a2 2 0 014 0v6M22 18V10a2 2 0 014 0v8M28 18V12a2 2 0 014 0v6" stroke="#FFF7ED" strokeWidth="2" strokeLinecap="round" />
    </StickerShell>
  );
}

export function StickerMarket({ size, className }) {
  const { main, shine } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="8" y1="10" x2="40" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ADE80" /><stop offset="1" stopColor="#16A34A" />
        </linearGradient>
        <linearGradient id={shine} x1="12" y1="12" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.45" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M10 16h28l-3 22H13L10 16z" fill={`url(#${main})`} />
      <path d="M10 16h28l-3 22H13L10 16z" fill={`url(#${shine})`} />
      <path d="M16 16c0-4 2-6 4-6s4 2 4 6M24 16c0-4 2-6 4-6s4 2 4 6" stroke="#DCFCE7" strokeWidth="2" strokeLinecap="round" />
    </StickerShell>
  );
}

export function StickerPharmacy({ size, className }) {
  const { main, shine } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" /><stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id={shine} x1="14" y1="10" x2="30" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.45" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="12" y="10" width="24" height="28" rx="6" fill={`url(#${main})`} />
      <rect x="12" y="10" width="24" height="28" rx="6" fill={`url(#${shine})`} />
      <path d="M24 16v16M16 24h16" stroke="#EFF6FF" strokeWidth="3" strokeLinecap="round" />
    </StickerShell>
  );
}

export function StickerCourier({ size, className }) {
  const { main, shine } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="6" y1="12" x2="42" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" /><stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id={shine} x1="10" y1="14" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.4" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="32" r="5" fill="#0C4A6E" />
      <circle cx="34" cy="32" r="5" fill="#0C4A6E" />
      <path d="M8 28h32l-4-14H12L8 28z" fill={`url(#${main})`} />
      <path d="M8 28h32l-4-14H12L8 28z" fill={`url(#${shine})`} />
    </StickerShell>
  );
}

export function StickerShipment({ size, className }) {
  const { main, shine } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A78BFA" /><stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id={shine} x1="14" y1="12" x2="28" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.45" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="12" y="16" width="24" height="20" rx="4" fill={`url(#${main})`} />
      <rect x="12" y="16" width="24" height="20" rx="4" fill={`url(#${shine})`} />
      <path d="M12 22h24" stroke="#EDE9FE" strokeWidth="2" />
      <path d="M20 12v8M28 12v8" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
    </StickerShell>
  );
}

export function StickerStore({ size, className }) {
  const { main, shine } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="8" y1="10" x2="40" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F472B6" /><stop offset="1" stopColor="#DB2777" />
        </linearGradient>
        <linearGradient id={shine} x1="12" y1="12" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.45" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M10 20h28v16H10V20z" fill={`url(#${main})`} />
      <path d="M10 20h28v16H10V20z" fill={`url(#${shine})`} />
      <path d="M10 20l4-10h20l4 10" fill="#BE185D" />
      <rect x="20" y="26" width="8" height="10" rx="1" fill="#FCE7F3" />
    </StickerShell>
  );
}

export function StickerOrder({ size, className }) {
  const { main, shine } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2DD4BF" /><stop offset="1" stopColor="#0D9488" />
        </linearGradient>
        <linearGradient id={shine} x1="14" y1="10" x2="30" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.45" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="12" y="8" width="24" height="32" rx="4" fill={`url(#${main})`} />
      <rect x="12" y="8" width="24" height="32" rx="4" fill={`url(#${shine})`} />
      <path d="M18 18h12M18 24h12M18 30h8" stroke="#CCFBF1" strokeWidth="2" strokeLinecap="round" />
    </StickerShell>
  );
}

export function StickerProfile({ size, className }) {
  const { main, shine } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818CF8" /><stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id={shine} x1="14" y1="10" x2="30" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.45" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="18" r="8" fill={`url(#${main})`} />
      <circle cx="24" cy="18" r="8" fill={`url(#${shine})`} />
      <path d="M10 38c2-8 8-12 14-12s12 4 14 12" fill={`url(#${main})`} />
    </StickerShell>
  );
}

export function StickerPayment({ size, className }) {
  const { main, shine } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="8" y1="12" x2="40" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCD34D" /><stop offset="1" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id={shine} x1="12" y1="14" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.5" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="8" y="14" width="32" height="22" rx="5" fill={`url(#${main})`} />
      <rect x="8" y="14" width="32" height="22" rx="5" fill={`url(#${shine})`} />
      <rect x="8" y="20" width="32" height="5" fill="#92400E" opacity="0.35" />
      <rect x="12" y="28" width="10" height="4" rx="1" fill="#FFFBEB" />
    </StickerShell>
  );
}

export function StickerCoupons({ size, className }) {
  const { main, shine } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB7185" /><stop offset="1" stopColor="#E11D48" />
        </linearGradient>
        <linearGradient id={shine} x1="14" y1="12" x2="28" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.45" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M12 14h24a2 2 0 012 2v4a3 3 0 100 6v4a2 2 0 01-2 2H12a2 2 0 01-2-2v-4a3 3 0 000-6v-4a2 2 0 012-2z" fill={`url(#${main})`} />
      <path d="M12 14h24a2 2 0 012 2v4a3 3 0 100 6v4a2 2 0 01-2 2H12a2 2 0 01-2-2v-4a3 3 0 000-6v-4a2 2 0 012-2z" fill={`url(#${shine})`} />
      <path d="M24 16v16" stroke="#FFE4E6" strokeWidth="2" strokeDasharray="3 3" />
    </StickerShell>
  );
}

export function StickerFavorites({ size, className }) {
  const { main, shine } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F87171" /><stop offset="1" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id={shine} x1="16" y1="12" x2="30" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.45" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M24 36l-2.2-2C14.4 27.2 10 23.2 10 18.2 10 14.4 13 12 16.4 12c2 0 3.9 1 5.6 2.6C23.7 13 25.6 12 27.6 12 31 12 34 14.4 34 18.2c0 5-4.4 9-11.8 15.8L24 36z" fill={`url(#${main})`} />
      <path d="M24 36l-2.2-2C14.4 27.2 10 23.2 10 18.2 10 14.4 13 12 16.4 12c2 0 3.9 1 5.6 2.6C23.7 13 25.6 12 27.6 12 31 12 34 14.4 34 18.2c0 5-4.4 9-11.8 15.8L24 36z" fill={`url(#${shine})`} />
    </StickerShell>
  );
}

export function StickerNotifications({ size, className }) {
  const { main, shine } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" /><stop offset="1" stopColor="#CA8A04" />
        </linearGradient>
        <linearGradient id={shine} x1="14" y1="10" x2="30" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.45" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M24 8c-6 0-10 4-10 10v6l-3 4h26l-3-4v-6c0-6-4-10-10-10z" fill={`url(#${main})`} />
      <path d="M24 8c-6 0-10 4-10 10v6l-3 4h26l-3-4v-6c0-6-4-10-10-10z" fill={`url(#${shine})`} />
      <path d="M20 38a4 4 0 008 0" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
    </StickerShell>
  );
}

export function StickerSettings({ size, className }) {
  const { main, shine } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#94A3B8" /><stop offset="1" stopColor="#475569" />
        </linearGradient>
        <linearGradient id={shine} x1="14" y1="12" x2="28" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.4" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="10" fill={`url(#${main})`} />
      <circle cx="24" cy="24" r="10" fill={`url(#${shine})`} />
      <circle cx="24" cy="24" r="4" fill="#F8FAFC" />
      <path d="M24 10v4M24 34v4M10 24h4M34 24h4M14.9 14.9l2.8 2.8M30.3 30.3l2.8 2.8M33.1 14.9l-2.8 2.8M17.7 30.3l-2.8 2.8" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    </StickerShell>
  );
}

export function StickerMore({ size, className }) {
  const { main } = useGrad();
  return (
    <StickerShell size={size} className={className}>
      <defs>
        <linearGradient id={main} x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CBD5E1" /><stop offset="1" stopColor="#64748B" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="24" r="3" fill={`url(#${main})`} />
      <circle cx="24" cy="24" r="3" fill={`url(#${main})`} />
      <circle cx="32" cy="24" r="3" fill={`url(#${main})`} />
    </StickerShell>
  );
}

export const STICKER_COMPONENTS = {
  search: StickerSearch,
  restaurantes: StickerRestaurant,
  comida: StickerRestaurant,
  mercado: StickerMarket,
  farmacia: StickerPharmacy,
  mensajeria: StickerCourier,
  mandado: StickerCourier,
  domiciliario: StickerCourier,
  envios: StickerShipment,
  envio: StickerShipment,
  tiendas: StickerStore,
  locales: StickerStore,
  comercio: StickerStore,
  store: StickerStore,
  pedido: StickerOrder,
  orders: StickerOrder,
  cart: StickerOrder,
  perfil: StickerProfile,
  profile: StickerProfile,
  pago: StickerPayment,
  payment: StickerPayment,
  money: StickerPayment,
  cupones: StickerCoupons,
  coupons: StickerCoupons,
  tag: StickerCoupons,
  favoritos: StickerFavorites,
  favorites: StickerFavorites,
  star: StickerFavorites,
  notificaciones: StickerNotifications,
  notifications: StickerNotifications,
  bell: StickerNotifications,
  configuracion: StickerSettings,
  settings: StickerSettings,
  more: StickerMore,
};
