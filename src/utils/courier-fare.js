/**
 * Motor de tarifas mensajería UrabApp — Colombia / Urabá
 * Gasolina solo cálculo interno; cliente ve desglose comercial.
 */

const DEFAULT_FARE_CONFIG = {
  base: 8000,
  minFare: 15000,
  perKm: 850,
  expressMultiplier: 1.25,
  peakMultiplier: 1.15,
  demandMultiplier: 1.0,
  fuelPriceCop: 13500,
  fuelEfficiencyKmPerLiter: 35,
  riderSharePct: 72,
};

/** Hora pico: 11–14 y 18–21 */
function isPeakHour(date = new Date()) {
  const h = date.getHours();
  return (h >= 11 && h < 14) || (h >= 18 && h < 21);
}

/** Demanda simulada por día/hora (extensible con analytics) */
function getDemandMultiplier(date = new Date()) {
  const day = date.getDay();
  const h = date.getHours();
  if (day === 0 || day === 6) return 1.05;
  if (h >= 12 && h < 14) return 1.12;
  if (h >= 19 && h < 21) return 1.08;
  return 1.0;
}

function roundTo500(n) {
  return Math.ceil(n / 500) * 500;
}

/** Distancia Haversine fallback (km) */
export function haversineKm(from, to) {
  if (!from?.latitude || !to?.latitude) return 0;
  const R = 6371;
  const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
  const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from.latitude * Math.PI) / 180) *
      Math.cos((to.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * @param {object} params
 * @param {number} params.distanceKm
 * @param {'normal'|'express'} [params.priority]
 * @param {object} [params.config] — desde courier_settings
 * @param {Date} [params.at]
 */
export function calculateCourierFare({
  distanceKm,
  priority = 'normal',
  config = {},
  at = new Date(),
}) {
  const cfg = { ...DEFAULT_FARE_CONFIG, ...config };
  const km = Math.max(0.5, Number(distanceKm) || 0.5);

  const distanceCharge = Math.round(km * cfg.perKm);
  const peakCharge = isPeakHour(at) ? Math.round(cfg.base * (cfg.peakMultiplier - 1)) : 0;
  const demandMult = getDemandMultiplier(at);
  const demandCharge = demandMult > 1 ? Math.round(cfg.base * (demandMult - 1)) : 0;

  let subtotal = cfg.base + distanceCharge + peakCharge + demandCharge;

  if (priority === 'express') {
    subtotal = Math.round(subtotal * cfg.expressMultiplier);
  }

  const total = roundTo500(Math.max(cfg.minFare, subtotal));

  // Gasolina interna (no visible al cliente)
  const fuelLiters = km / cfg.fuelEfficiencyKmPerLiter;
  const fuelCostInternal = Math.round(fuelLiters * cfg.fuelPriceCop);

  const riderPayout = Math.round(total * (cfg.riderSharePct / 100));
  const platformMargin = total - riderPayout - fuelCostInternal;

  const breakdown = {
    base: cfg.base,
    distance: distanceCharge,
    peak: peakCharge,
    demand: demandCharge,
    express: priority === 'express' ? Math.round((subtotal / cfg.expressMultiplier) * (cfg.expressMultiplier - 1)) : 0,
    total,
    distanceKm: Math.round(km * 10) / 10,
    riderPayout,
    fuelCostInternal,
    platformMargin,
    estimatedMinutes: Math.max(15, Math.round(km * 4 + 10)),
  };

  return breakdown;
}

export function formatFareLines(breakdown) {
  const lines = [
    { label: 'Base', amount: breakdown.base },
    { label: 'Distancia', amount: breakdown.distance },
  ];
  if (breakdown.peak > 0) lines.push({ label: 'Hora pico', amount: breakdown.peak });
  if (breakdown.demand > 0) lines.push({ label: 'Demanda', amount: breakdown.demand });
  if (breakdown.express > 0) lines.push({ label: 'Express', amount: breakdown.express });
  lines.push({ label: 'TOTAL', amount: breakdown.total, highlight: true });
  return lines;
}

export async function loadFareConfigFromSettings(supabase) {
  if (!supabase) return DEFAULT_FARE_CONFIG;
  try {
    const { data } = await supabase
      .from('courier_settings')
      .select('value')
      .eq('key', 'fare_config')
      .maybeSingle();
    return data?.value ? { ...DEFAULT_FARE_CONFIG, ...data.value } : DEFAULT_FARE_CONFIG;
  } catch {
    return DEFAULT_FARE_CONFIG;
  }
}
