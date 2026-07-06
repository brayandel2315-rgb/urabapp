import { haversineKm } from '../utils/routing';

import { getDrivingRoute } from './map.service';
import { getMunicipioEtaBaseline } from './order-tracking.service';

const URBAN_KMH = 22;
const RURAL_KMH = 28;
const HIGHWAY_KMH = 35;
const PREP_BUFFER_MIN = 8;
const STORE_WAIT_MIN = 4;
const TRAFFIC_PEAK_MULT = 1.25;
const RAIN_MULT = 1.15;

const URBAN_MUNICIPIOS = new Set(['Apartadó', 'Turbo', 'Carepa', 'Chigorodó', 'Necoclí']);

function isPeakHour(date = new Date()) {
  const h = date.getHours();
  return (h >= 11 && h <= 14) || (h >= 18 && h <= 21);
}

function baseSpeedKmh(municipio) {
  if (!municipio) return URBAN_KMH;
  return URBAN_MUNICIPIOS.has(municipio) ? URBAN_KMH : RURAL_KMH;
}

/**
 * ETA inteligente — distancia + zona + hora + preparación + histórico simple.
 * @returns {{ seconds: number, label: string, factors: object }}
 */
export function computeSmartEta({
  riderLat,
  riderLng,
  destLat,
  destLng,
  municipio,
  orderStatus,
  prepMinutes = 0,
  waitAtStoreMin = 0,
  routeSeconds,
  isRaining = false,
  historicalAvgMin,
}) {
  let travelSec = routeSeconds;

  if (travelSec == null && riderLat != null && destLat != null) {
    const km = haversineKm(
      { latitude: riderLat, longitude: riderLng },
      { latitude: destLat, longitude: destLng },
    );
    let speed = baseSpeedKmh(municipio);
    if (km > 15) speed = HIGHWAY_KMH;
    travelSec = Math.round((km / speed) * 3600);
  }

  travelSec = travelSec ?? 900;

  let multiplier = 1;
  if (isPeakHour()) multiplier *= TRAFFIC_PEAK_MULT;
  if (isRaining) multiplier *= RAIN_MULT;
  travelSec = Math.round(travelSec * multiplier);

  let prepSec = 0;
  if (orderStatus === 'pending' || orderStatus === 'accepted') {
    prepSec = (prepMinutes || PREP_BUFFER_MIN) * 60;
  } else if (orderStatus === 'preparing') {
    prepSec = Math.max(0, (prepMinutes || 5) * 60);
    prepSec += (waitAtStoreMin || STORE_WAIT_MIN) * 60;
  }

  let totalSec = travelSec + prepSec;

  if (historicalAvgMin && historicalAvgMin > 0) {
    const histSec = historicalAvgMin * 60;
    totalSec = Math.round(totalSec * 0.65 + histSec * 0.35);
  }

  totalSec = Math.max(180, totalSec);

  const etaDate = new Date(Date.now() + totalSec * 1000);
  const label = etaDate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  return {
    seconds: totalSec,
    label,
    etaAt: etaDate.toISOString(),
    factors: {
      travelSec,
      prepSec,
      multiplier,
      municipio,
      peak: isPeakHour(),
    },
  };
}

export function formatEtaCountdown(seconds) {
  if (seconds == null || seconds < 0) return 'Calculando…';
  const m = Math.ceil(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm ? `${h}h ${rm}min` : `${h}h`;
}

/** ETA con ruta real OpenRoute + histórico municipal */
export async function computeSmartEtaAsync(params) {
  let historicalAvgMin = params.historicalAvgMin;
  if (historicalAvgMin == null && params.municipio) {
    historicalAvgMin = await getMunicipioEtaBaseline(params.municipio);
  }

  const enriched = { ...params, historicalAvgMin };
  const base = computeSmartEta(enriched);
  const { riderLat, riderLng, destLat, destLng } = params;
  if (riderLat == null || destLat == null) return base;

  try {
    const route = await getDrivingRoute(
      { latitude: riderLat, longitude: riderLng },
      { latitude: destLat, longitude: destLng },
    );
    const routeSeconds = route?.durationSeconds ?? route?.durationSec;
    if (routeSeconds) {
      return computeSmartEta({ ...enriched, routeSeconds });
    }
  } catch {
    /* fallback heurístico */
  }
  return base;
}
