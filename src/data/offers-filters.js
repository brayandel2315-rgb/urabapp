/** Filtros del hub de ofertas */
export const OFFERS_FILTERS = [
  { id: 'all', label: 'Todos', icon: 'all' },
  { id: 'delivery', label: 'Delivery', icon: 'delivery', categories: ['comida', 'mercado', 'farmacia', 'licoreria', 'tiendas'] },
  { id: 'mensajeria', label: 'Mensajería', icon: 'mensajeria', route: '/mandado' },
  { id: 'mercado', label: 'Mercado', icon: 'market', categories: ['mercado'] },
  { id: 'tecnologia', label: 'Tecnología', icon: 'mobile', categories: ['tecnologia'] },
  { id: 'belleza', label: 'Belleza', icon: 'lotion', categories: ['belleza'] },
  { id: 'restaurantes', label: 'Restaurantes', icon: 'comida', categories: ['comida'] },
  { id: 'express', label: 'Express', icon: 'bolt', expressOnly: true },
  { id: 'premium', label: 'Premium', icon: 'star', minRating: 4.5 },
];

export const OFFER_BADGES = {
  TOP: { label: 'TOP', className: 'bg-amber-400 text-amber-950' },
  NUEVO: { label: 'NUEVO', className: 'bg-sky-500 text-white' },
  HOT: { label: 'HOT', className: 'bg-rose-500 text-white' },
  EXPIRA_HOY: { label: 'EXPIRA HOY', className: 'bg-orange-600 text-white' },
};

export const PROMO_TYPES = {
  percent: 'Porcentaje',
  fixed: 'Monto fijo',
  bogo: '2x1',
  free_delivery: 'Envío gratis',
  combo: 'Combo',
  tiered: 'Escalonada',
  cashback: 'Cashback',
  flash: 'Flash',
  personalized: 'Personalizada',
};

export const DEFAULT_MISSION = {
  mission_type: 'orders_count',
  title: 'Compra 3 veces',
  description: 'Haz 3 pedidos esta semana y recibe envío gratis en el siguiente.',
  target_count: 3,
  reward_type: 'free_delivery',
};
