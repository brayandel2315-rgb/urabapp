export const BRAND = {
  name: 'Urabapp',
  tagline: 'Todo Urabá, a un toque.',
  shortTagline: 'Todo Urabá, a un toque.',
  homeHeroTagline: 'Todo Urabá, a un toque.',
  homeHeroLead: 'Comida, mercados, envíos y más. Entregado localmente.',
  motto: 'Más que envíos, creamos conexiones.',
};

/** URL canónica de producción (Vercel) */
export const PRODUCTION_APP_URL = 'https://urabapp.vercel.app';

/** Orden geográfico Troncal del Urabá — sentido Medellín → Urabá */
export const MUNICIPALITIES = ['Necoclí', 'Turbo', 'Apartadó', 'Carepa', 'Chigorodó', 'San Pedro', 'Arboletes'];

export const DEFAULT_MUNICIPALITY = 'Apartadó';

/** Barrios oficiales de Apartadó (52 en 4 comunas) */
export {
  APARTADO_ALL_BARRIOS as APARTADO_ZONES,
  APARTADO_POPULAR_BARRIOS,
  BARRIO_ALL_ID,
} from '../data/apartado-barrios';

/** Rutas intermunicipales diferenciadoras */
export const INTERMUNICIPAL_ROUTES = [
  { from: 'Turbo', to: 'Apartadó', fee: 15000, etaHours: 4 },
  { from: 'Carepa', to: 'Chigorodó', fee: 12000, etaHours: 3 },
  { from: 'Apartadó', to: 'Turbo', fee: 15000, etaHours: 4 },
  { from: 'Chigorodó', to: 'Carepa', fee: 12000, etaHours: 3 },
];

export const INTERMUNICIPAL_DELIVERY_FEE = 15000;
export const BUSINESS_IDS = {
  BANANERO: 'a0000001-0000-0000-0000-000000000001',
  MECATO: 'a0000001-0000-0000-0000-000000000002',
  FARMACIA: 'a0000001-0000-0000-0000-000000000003',
  SUPERMERCADO: 'a0000001-0000-0000-0000-000000000004',
};

export const DEFAULT_BUSINESS_ID = BUSINESS_IDS.BANANERO;

export const ROLES = {
  CLIENT: 'CLIENT',
  BUSINESS: 'BUSINESS',
  RIDER: 'RIDER',
  ADMIN: 'ADMIN',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PREPARING: 'preparing',
  ON_THE_WAY: 'on_the_way',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  pending: 'Pendiente',
  accepted: 'Aceptado',
  preparing: 'Preparando',
  on_the_way: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

/** Servicios — copy humano y local */
export const VERTICALS_INTRO = {
  title: '¿Qué necesitas hoy?',
  subtitle:
    'Vamos sumando opciones poco a poco: primero lo del barrio, después lo que cruza municipios. Así nos aseguramos de que todo llegue bien y con gente de acá.',
  subtitleShort: 'Paso a paso, con tiendas y mensajeros del Urabá.',
};

export {
  NAV_VERTICALS as CATEGORIES,
  CATEGORY_GROUPS,
  BUSINESS_CATEGORIES,
  getCategoryLabel,
  getCategoryPlural,
  resolveCategoryFilter,
  getOnboardingCategories,
  VERTICAL_CARD_THEMES,
} from '../data/category-catalog';

export const PAYMENT_METHOD_LABELS = [
  { id: 'cash', name: 'Efectivo contra entrega' },
];

/** Fase 6 — post-MVP (sin Wompi) */
export const PHASE_6_KPIS = {
  reviews: 100,
  ordersWithGps: 200,
  digitalPaymentsReady: 0,
};

/** Modelo económico Fase 4 — referencia operativa */
export const ECONOMICS = {
  defaultDeliveryFee: 5000,
  commissionPct: 12,
  riderPayout: 4000,
  infraCostPerOrder: 700,
  marketingCostPerOrder: 1500,
  targetOrdersPerMonth: 1500,
  exampleTicket: 35000,
};

/** Beneficio único: primera entrega gratis al registrar cédula (Urabapp subsidia al mensajero) */
export const WELCOME_BENEFIT = {
  minOrder: 20000,
  title: 'Primera entrega gratis',
  subtitle: 'Registra tu cédula una vez · el mensajero cobra con bono de Urabapp',
};

/** Descuento en domicilio para suscriptores UrabApp Pro (50% del fee base) */
export const PRO_DELIVERY_DISCOUNT_PCT = 50;

export const PHASE_1_KPIS = {
  businesses: 20,
  riders: 10,
  users: 100,
  orders: 100,
};

export const PHASE_2_KPIS = {
  businesses: 50,
  riders: 30,
  users: 1000,
  orders: 500,
};

/** Fase 3 — producto mínimo real (operación estable) */
export const PHASE_3_KPIS = {
  orders: 1500,
  monthlyRevenue: 52500000,
  repeatRate: 25,
  activeBusinesses: 40,
};

/** Fase 4 — modelo económico (1.500 pedidos/mes) */
export const PHASE_4_KPIS = {
  monthlyOrders: 1500,
  monthlyPlatformGross: 13800000,
  monthlyMargin: 4500000,
  avgMarginPerOrder: 3000,
  commissionPct: 12,
};

/** Fase 5 — diferenciadores */
export const PHASE_5_KPIS = {
  expressBusinesses: 20,
  intermunicipalOrders: 50,
  whatsappOrders: 200,
  activeRiders: 25,
};

/** Bonos red de repartidores */
export const RIDER_BONUSES = {
  weeklyDeliveryTarget: 5,
  weeklyBonus: 500,
  topRiderBonuses: [2000, 1500, 1000],
};

/** Plantillas rápidas Comercio Express */
export const EXPRESS_PRODUCT_TEMPLATES = {
  comida: [
    { name: 'Menú del día', price: 15000, icon: 'plate' },
    { name: 'Combo ejecutivo', price: 18000, icon: 'bento' },
  ],
  mercado: [
    { name: 'Canasta básica', price: 25000, icon: 'market' },
    { name: 'Oferta del día', price: 12000, icon: 'tag' },
  ],
  farmacia: [
    { name: 'Consulta básica', price: 8000, icon: 'pharmacy' },
    { name: 'Kit de aseo', price: 15000, icon: 'lotion' },
  ],
  licoreria: [
    { name: 'Sixpack cerveza', price: 28000, icon: 'beer' },
    { name: 'Combo licores', price: 45000, icon: 'beer' },
  ],
  tiendas: [
    { name: 'Producto estrella', price: 12000, icon: 'star' },
    { name: 'Oferta del día', price: 8000, icon: 'tag' },
  ],
  mascotas: [
    { name: 'Alimento mascota 1kg', price: 22000, icon: 'pet' },
    { name: 'Accesorio básico', price: 15000, icon: 'package' },
  ],
  tecnologia: [
    { name: 'Cable USB-C', price: 18000, icon: 'mobile' },
    { name: 'Funda celular', price: 25000, icon: 'mobile' },
  ],
  mensajeria: [
    { name: 'Servicio local', price: 10000, icon: 'mensajeria' },
  ],
  default: [
    { name: 'Producto 1', price: 10000, icon: 'package' },
    { name: 'Producto 2', price: 15000, icon: 'package' },
  ],
};

export const WHATSAPP_FUNNEL = [
  { step: 1, channel: 'Instagram', icon: 'instagram', text: 'Publicación o historia con link' },
  { step: 2, channel: 'WhatsApp', icon: 'chat', text: 'Cliente escribe o recibe menú' },
  { step: 3, channel: 'Link Urabapp', icon: 'link', text: 'Abre tienda o pedido en PWA' },
  { step: 4, channel: 'Entrega', icon: 'check', text: 'Seguimiento y pago contra entrega' },
];

/** Flujo de comunicación dentro de la app (landing / marketing) */
export const IN_APP_COMMUNICATION_FLOW = [
  { step: 1, channel: 'Exploras', icon: 'mobile', text: 'Pides desde la PWA — sin instalar otra app' },
  { step: 2, channel: 'Chat del pedido', icon: 'chat', text: 'Hablas con la tienda y soporte aquí mismo' },
  { step: 3, channel: 'Notificaciones', icon: 'bell', text: 'Estado del pedido y novedades en tiempo real' },
  { step: 4, channel: 'Entrega', icon: 'check', text: 'Mapa, mensajero y seguimiento en Urabapp' },
];
