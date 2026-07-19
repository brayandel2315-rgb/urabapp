import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import homeNavIcon from '@/assets/nav/home.png';
import explorarNavIcon from '@/assets/nav/explorar.png';
import pedidosNavIcon from '@/assets/nav/pedidos.png';
import cuentaNavIcon from '@/assets/nav/cuenta.png';
import comidaIcon from '@/assets/services/comida.png';
import tiendasIcon from '@/assets/services/tiendas.png';

const NAV_ICON_KEYS = {
  home: 'home',
  search: 'search',
  explore: 'search',
  explorar: 'search',
  bag: 'pedidos',
  orders: 'pedidos',
  pedidos: 'pedidos',
  profile: 'profile',
  account: 'profile',
  cuenta: 'profile',
  menu: 'menu',
  food: 'menu',
  products: 'menu',
  tienda: 'tienda',
  tiendas: 'tienda',
  store: 'tienda',
  services: 'bolt',
  flash: 'bolt',
  more: 'more',
};

/** Iconos PNG brand: inactivo = gris, activo = color exacto */
const NAV_IMAGE_ICONS = {
  home: homeNavIcon,
  search: explorarNavIcon,
  explore: explorarNavIcon,
  explorar: explorarNavIcon,
  pedidos: pedidosNavIcon,
  bag: pedidosNavIcon,
  orders: pedidosNavIcon,
  profile: cuentaNavIcon,
  account: cuentaNavIcon,
  cuenta: cuentaNavIcon,
  menu: comidaIcon,
  food: comidaIcon,
  products: comidaIcon,
  tienda: tiendasIcon,
  tiendas: tiendasIcon,
  store: tiendasIcon,
};

/**
 * Icono del dock inferior (cliente / negocio).
 * Assets brand: gris inactivo · color exacto activo.
 */
export default function BottomNavIcon({
  name,
  size = 20,
  active = false,
  featured = false,
  className,
}) {
  const key = NAV_ICON_KEYS[name] || name || 'store';
  const imageSrc = NAV_IMAGE_ICONS[key] || NAV_IMAGE_ICONS[name];

  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt=""
        width={size}
        height={size}
        draggable={false}
        className={cn(
          'bottom-nav-brand-icon shrink-0 object-contain transition-[filter,opacity] duration-200',
          active ? 'bottom-nav-brand-icon--active' : 'bottom-nav-brand-icon--inactive',
          className,
        )}
      />
    );
  }

  return (
    <AppIcon
      name={key}
      size={size}
      strokeWidth={2}
      className={cn(
        'shrink-0 transition-colors duration-200',
        featured ? 'text-white' : active ? 'text-[var(--brand-primary)]' : 'text-[#6B7280]',
        className,
      )}
    />
  );
}
