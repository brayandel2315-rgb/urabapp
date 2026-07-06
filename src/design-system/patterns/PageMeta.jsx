import { useEffect } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { STORE } from '@/utils/marketplace-copy';
import { BRAND } from '@/utils/constants';
import { getAppBaseUrl } from '@/utils/app';

const DEFAULT_DESCRIPTION = BRAND.tagline;
const OG_IMAGE = '/og-image.png';
const OG_IMAGE_WIDTH = '1200';
const OG_IMAGE_HEIGHT = '630';

const ROUTE_META = [
  { path: '/', title: 'Todo Urabá, más cerca de ti', description: 'Compra, envía y descubre tiendas disponibles para tu zona en Urabá.' },
  { path: '/restaurantes', title: 'Restaurantes', description: 'Sabores cerca de ti — pide comida a domicilio en Urabá.' },
  { path: '/mercado', title: 'Mercado', description: 'Compra mercado sin salir de casa en Urabá.' },
  { path: '/farmacia', title: 'Farmacia', description: 'Salud y bienestar con entrega segura.' },
  { path: '/mensajeria', title: 'Mensajería', description: 'Mandados y entregas locales en Urabá.' },
  { path: '/tiendas', title: 'Tiendas', description: 'Descubre tiendas locales en Urabá.' },
  { path: '/search', title: 'Buscar', description: 'Encuentra restaurantes, farmacias y tiendas en Urabá.' },
  { path: '/business/:id', title: 'Tienda', description: 'Catálogo y pedidos en Urabapp.' },
  { path: '/tienda/:id', title: 'Tienda', description: 'Catálogo y pedidos en Urabapp.' },
  { path: '/carrito', title: 'Carrito', description: 'Revisa tu pedido antes de confirmar.' },
  { path: '/checkout', title: 'Confirmar pedido', description: 'Finaliza tu pedido con pago contra entrega.' },
  { path: '/pedidos', title: 'Mis pedidos', description: 'Seguimiento de tus pedidos en Urabapp.' },
  { path: '/pedidos/:id', title: 'Detalle del pedido', description: 'Estado y resumen de tu pedido.' },
  { path: '/mandado', title: 'Mensajería', description: 'Solicita un mandado personalizado en Urabá.' },
  { path: '/envios', title: 'Envíos intermunicipales', description: 'Envíos entre municipios del Urabá.' },
  { path: '/cuenta/perfil', title: 'Mi cuenta', description: 'Tu cuenta, direcciones y preferencias.' },
  { path: '/login', title: 'Entrar', description: 'Inicia sesión en Urabapp.' },
  { path: '/negocio', title: STORE.panel, description: 'Gestiona pedidos y catálogo de tu tienda.' },
  { path: '/negocio/onboarding', title: 'Nueva tienda', description: 'Abre tu tienda en Urabapp en minutos.' },
  { path: '/domiciliario', title: 'Panel mensajero', description: 'Entregas y ganancias como repartidor Urabapp.' },
  { path: '/domiciliario/registro', title: 'Registro mensajero', description: 'Únete a la red de repartidores de Urabapp.' },
  { path: '/admin', title: 'Administración', description: 'Operación y métricas de Urabapp.' },
  { path: '/informe', title: 'Informe', description: 'Estado del proyecto Urabapp.' },
];

function setMetaTag(attr, key, value) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function resolveMeta(pathname) {
  const match = ROUTE_META.find((route) => matchPath({ path: route.path, end: true }, pathname));
  if (match) return match;

  if (pathname.startsWith('/tienda/') || pathname.startsWith('/business/')) {
    return ROUTE_META.find((r) => r.path === '/tienda/:id' || r.path === '/business/:id');
  }
  if (pathname.startsWith('/pedidos/')) {
    return ROUTE_META.find((r) => r.path === '/pedidos/:id');
  }

  return { title: 'Página no encontrada', description: DEFAULT_DESCRIPTION };
}

export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = resolveMeta(pathname);
    const pageTitle = meta.title === BRAND.name
      ? `${BRAND.name} — ${BRAND.shortTagline}`
      : `${meta.title} · ${BRAND.name}`;
    const description = meta.description || DEFAULT_DESCRIPTION;
    const baseUrl = getAppBaseUrl();
    const canonical = `${baseUrl}${pathname}`;
    const image = `${baseUrl}${OG_IMAGE}`;

    document.title = pageTitle;
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonical);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:image:width', OG_IMAGE_WIDTH);
    setMetaTag('property', 'og:image:height', OG_IMAGE_HEIGHT);
    setMetaTag('property', 'og:image:alt', `${BRAND.name} — ${BRAND.tagline}`);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);
  }, [pathname]);

  return null;
}
