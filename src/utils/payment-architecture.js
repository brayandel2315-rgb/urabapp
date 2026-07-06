/**
 * Modelo de cobro recomendado para Urabapp — marketplace local Urabá.
 *
 * Fase actual (MVP): plataforma como merchant of record.
 * Fase siguiente: split Wompi / liquidación automática por comercio.
 */

export const PAYOUT_MODES = {
  platform_settlement: {
    id: 'platform_settlement',
    label: 'Liquidación por Urabapp',
    summary: 'El cliente paga a Urabapp. La plataforma liquida al comercio menos comisión.',
    recommended: true,
  },
  direct_wompi: {
    id: 'direct_wompi',
    label: 'Cobro directo Wompi',
    summary: 'Cada comercio con recipient_id propio. Urabapp cobra comisión vía split.',
    recommended: false,
  },
  hybrid: {
    id: 'hybrid',
    label: 'Híbrido',
    summary: 'Digital al comercio, efectivo contra entrega sin pasar por plataforma.',
    recommended: false,
  },
};

/** Referencias de mercado (Colombia / delivery) */
export const MARKET_COMMISSION_BENCHMARKS = {
  globalAggregators: { min: 15, max: 30, note: 'Rappi, Uber Eats en ciudades grandes' },
  localMarketplaceStart: { min: 8, max: 12, note: 'Recomendado para lanzar en Urabá' },
  matureLocalMarketplace: { min: 12, max: 18, note: 'Cuando hay recurrencia y volumen' },
  urabappDefault: 12,
};

export const PAYMENT_FLOW = {
  cash: {
    customerPays: 'Al recibir el pedido',
    platformFee: 'Se descuenta en liquidación al comercio',
    riderPayout: 'Urabapp paga al mensajero (o comercio coordina en MVP)',
  },
  digital: {
    customerPays: 'Wompi (Nequi, tarjeta, PSE, Daviplata)',
    settlement: 'Fondo en Urabapp → business_net al comercio en ciclo semanal',
    platformKeeps: 'commission_amount + margen de delivery_fee - rider_payout - costos',
  },
};

export function describeOrderSettlement({ subtotal, deliveryFee, commissionPct = 12, tip = 0 }) {
  const commissionAmount = Math.round(subtotal * (commissionPct / 100));
  const businessNet = subtotal - commissionAmount;
  const riderPayout = 4000;
  const platformGross = commissionAmount + deliveryFee;
  const platformNet = platformGross - riderPayout;

  return {
    commissionPct,
    commissionAmount,
    businessNet,
    riderPayout,
    tipToRider: tip,
    platformGross,
    platformNet,
    customerTotal: subtotal + deliveryFee + tip,
  };
}
