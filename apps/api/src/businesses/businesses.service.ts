import { Injectable } from '@nestjs/common';

@Injectable()
export class BusinessesService {
  near(_query: { municipio: string; barrio?: string; lat?: number; lng?: number; limit: number }) {
    return { items: [], meta: { lazy: true } };
  }
}
