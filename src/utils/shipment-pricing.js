import { getMunicipalityDistanceKm } from '../data/shipment-catalog';

const DEFAULT_PRICING = {
  baseFee: 8000,
  minFee: 15000,
  perKm: 200,
  protectionFee: 1500,
  demandMultiplier: 1.0,
  weightFees: { '0-2': 0, '2-5': 2000, '5-10': 5000, '10-20': 10000 },
};

export function mergePricingConfig(dbConfig) {
  if (!dbConfig) return DEFAULT_PRICING;
  return {
    ...DEFAULT_PRICING,
    ...dbConfig,
    weightFees: { ...DEFAULT_PRICING.weightFees, ...(dbConfig.weightFees || {}) },
  };
}

/**
 * Cotizador dinámico — NO precio fijo global.
 * precio = max(mínimo, base + km×valor + peso + volumen + demanda)
 */
export function calculateShipmentQuote({
  originMunicipio,
  destMunicipio,
  distanceKm,
  weightTier = '0-2',
  volumeFactor = 1,
  demandFactor = 1,
  routeBaseFee = null,
  pricing = DEFAULT_PRICING,
}) {
  const cfg = mergePricingConfig(pricing);
  const km = distanceKm ?? getMunicipalityDistanceKm(originMunicipio, destMunicipio);
  const distanceFee = Math.round(km * cfg.perKm);
  const weightFee = cfg.weightFees[weightTier] ?? 0;
  const volumeFee = volumeFactor > 1 ? Math.round((volumeFactor - 1) * 3000) : 0;
  const demandFee = Math.round(cfg.baseFee * (demandFactor - 1));
  const subtotal = cfg.baseFee + distanceFee + weightFee + volumeFee + demandFee;
  let total = Math.max(cfg.minFee, subtotal);

  if (routeBaseFee != null && routeBaseFee > 0) {
    total = Math.max(cfg.minFee, routeBaseFee + weightFee + volumeFee + demandFee);
  }

  const protection = cfg.protectionFee;
  const etaHours = km <= 25 ? 3 : km <= 45 ? 4 : km <= 60 ? 5 : 6;

  return {
    distanceKm: km,
    etaHours,
    totalCop: total + protection,
    protectionFee: protection,
    breakdown: {
      baseFee: cfg.baseFee,
      distanceFee,
      weightFee,
      volumeFee,
      demandFee,
      protectionFee: protection,
      minApplied: total === cfg.minFee,
    },
    display: {
      fare: total,
      protection,
      total: total + protection,
    },
  };
}
