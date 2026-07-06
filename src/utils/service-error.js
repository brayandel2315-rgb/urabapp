import { mapApiError } from './errors';

export class ServiceError extends Error {
  constructor(message, { code = 'unknown' } = {}) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
  }
}

export function assertNoError(error, fallback = 'No se pudo cargar la información') {
  if (error) throw new ServiceError(mapApiError(error) || fallback, { code: error.code });
}
