/** Límites geográficos aproximados — región Urabá, Antioquia */
export const URABA_BOUNDS = {
  minLat: 7.2,
  maxLat: 8.6,
  minLng: -77.15,
  maxLng: -75.55,
};

export function isWithinUraba(lat, lng) {
  if (lat == null || lng == null) return false;
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return false;
  return la >= URABA_BOUNDS.minLat
    && la <= URABA_BOUNDS.maxLat
    && ln >= URABA_BOUNDS.minLng
    && ln <= URABA_BOUNDS.maxLng;
}
