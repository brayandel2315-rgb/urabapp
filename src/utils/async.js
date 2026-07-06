export const API_TIMEOUT_MS = 8_000;

export function withTimeout(promise, ms = API_TIMEOUT_MS, message = 'La operación tardó demasiado') {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}
