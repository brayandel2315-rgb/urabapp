import { cn } from '@/lib/utils';

/**
 * Iconografía exclusiva del dock inferior — line-art cohesivo (Rappi / Uber Eats / ML).
 * Pedidos = bolsa de compras (historial de pedidos), nunca carrito de checkout.
 */
const ICONS = {
  home: (
    <path
      d="M5 10.2 12 5l7 5.2V19a1 1 0 0 1-1 1h-4.2v-5.4H10.2V20H6a1 1 0 0 1-1-1v-8.8Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  homeActive: (
    <path
      d="M5 10.2 12 5l7 5.2V19a1 1 0 0 1-1 1h-4.2v-5.4H10.2V20H6a1 1 0 0 1-1-1v-8.8Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
  ),
  search: (
    <>
      <circle cx="10.75" cy="10.75" r="5.25" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <path d="m15.2 15.2 4.3 4.3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </>
  ),
  services: (
    <path
      d="M13.2 3.5 6.2 14h5.3l-.9 6.5 7.4-10.2H12.4l.8-6.8Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
  ),
  servicesFeatured: (
    <path
      d="M13.5 2.75 5.5 14.5h6.1l-1 7.25 8.4-11.6H13l1-7.35Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.35"
      strokeLinejoin="round"
    />
  ),
  pedidos: (
    <>
      <path
        d="M8.75 9.25V8.25a3.25 3.25 0 0 1 6.5 0v1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M7.75 9.25h8.5l-.9 10.1a1.35 1.35 0 0 1-1.34 1.23H9.98a1.35 1.35 0 0 1-1.34-1.23l-.9-10.1Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  pedidosActive: (
    <>
      <path
        d="M8.75 9.25V8.25a3.25 3.25 0 0 1 6.5 0v1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M7.75 9.25h8.5l-.9 10.1a1.35 1.35 0 0 1-1.34 1.23H9.98a1.35 1.35 0 0 1-1.34-1.23l-.9-10.1Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8.75" r="3.25" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <path
        d="M5.75 19.25c0-3.15 2.8-5.5 6.25-5.5s6.25 2.35 6.25 5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
  profileActive: (
    <>
      <circle cx="12" cy="8.75" r="3.25" fill="currentColor" />
      <path
        d="M5.75 19.25c0-3.15 2.8-5.5 6.25-5.5s6.25 2.35 6.25 5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
};

const ALIASES = {
  bolt: 'services',
  bag: 'pedidos',
  orders: 'pedidos',
  cart: 'pedidos',
  profile: 'profile',
};

function resolveKey(name) {
  return ALIASES[name] || name;
}

function resolveIcon(key, active, featured) {
  if (featured && key === 'services' && ICONS.servicesFeatured) {
    return ICONS.servicesFeatured;
  }
  if (active && !['services'].includes(key)) {
    const activeKey = `${key}Active`;
    if (ICONS[activeKey]) return ICONS[activeKey];
  }
  return ICONS[key] || ICONS.home;
}

export default function BottomNavIcon({
  name,
  size = 24,
  active = false,
  featured = false,
  className,
}) {
  const key = resolveKey(name);
  const icon = resolveIcon(key, active && !featured, featured);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'shrink-0 transition-colors duration-200',
        featured ? 'text-white' : active ? 'text-[#1B5E20]' : 'text-[#4B5563]',
        className,
      )}
      aria-hidden
    >
      {icon}
    </svg>
  );
}
