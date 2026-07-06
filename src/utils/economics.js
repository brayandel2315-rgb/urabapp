import { ECONOMICS } from './constants';

/**
 * Desglose por pedido según modelo Fase 4.
 * Ejemplo $35.000: comisión 12% + domicilio → margen plataforma ~$3.000.
 */
export function calculateOrderEconomics({
  subtotal = 0,
  deliveryFee = 0,
  discount = 0,
  deliverySubsidy = 0,
  commissionPct = ECONOMICS.commissionPct,
  hasBusiness = true,
}) {
  const netSubtotal = Math.max(0, subtotal - discount);
  const commissionAmount = hasBusiness
    ? Math.round(netSubtotal * (Number(commissionPct) / 100))
    : 0;
  const businessNet = hasBusiness ? netSubtotal - commissionAmount : 0;
  const riderPayout = ECONOMICS.riderPayout;
  const platformGross = commissionAmount + deliveryFee;
  const platformMargin = platformGross
    - riderPayout
    - ECONOMICS.infraCostPerOrder
    - ECONOMICS.marketingCostPerOrder
    - Math.max(0, deliverySubsidy);

  return {
    commissionPct: hasBusiness ? Number(commissionPct) : 0,
    commissionAmount,
    businessNet,
    riderPayout,
    platformGross,
    platformMargin,
    deliverySubsidy: Math.max(0, deliverySubsidy),
  };
}

export function getMonthStart(date = new Date()) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function aggregateEconomics(orders) {
  const valid = (orders ?? []).filter((o) => o.status !== 'cancelled');
  const delivered = valid.filter((o) => o.status === 'delivered');

  const sum = (key) => delivered.reduce((s, o) => s + (o[key] || 0), 0);

  return {
    orderCount: delivered.length,
    gmv: valid.reduce((s, o) => s + (o.total || 0), 0),
    commissionTotal: sum('commission_amount'),
    deliveryFees: sum('delivery_fee'),
    platformGross: sum('platform_gross'),
    platformMargin: sum('platform_margin'),
    riderPayouts: sum('rider_payout'),
    businessNetTotal: sum('business_net'),
  };
}
