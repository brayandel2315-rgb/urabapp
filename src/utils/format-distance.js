/** Formato seguro de distancia — evita crash si viene como string desde la API */
export function formatDistanceKm(km) {
  const n = Number(km);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n < 1) return `${Math.round(n * 1000)} m`;
  return `${n.toFixed(1)} km`;
}
