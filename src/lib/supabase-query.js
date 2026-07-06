import { withTimeout, API_TIMEOUT_MS } from '@/utils/async';
import { mapApiError } from '@/utils/errors';

/** Envuelve consultas Supabase con timeout para evitar spinners infinitos. */
export function sbQuery(promise, message, ms = API_TIMEOUT_MS) {
  return withTimeout(promise, ms, message);
}

/** SELECT/INSERT con timeout + error normalizado. */
export async function sbFetch(promise, message, ms = API_TIMEOUT_MS) {
  const { data, error } = await sbQuery(promise, message, ms);
  if (error) throw new Error(mapApiError(error));
  return data;
}

/** Mutaciones sin retorno de fila. */
export async function sbExec(promise, message, ms = API_TIMEOUT_MS) {
  const { error } = await sbQuery(promise, message, ms);
  if (error) throw new Error(mapApiError(error));
}
