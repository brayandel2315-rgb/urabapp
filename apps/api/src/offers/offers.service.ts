import { Injectable } from '@nestjs/common';

@Injectable()
export class OffersService {
  private cache = new Map<string, { at: number; data: unknown }>();
  private TTL = 60_000;

  list({ municipio, barrio }: { municipio: string; barrio?: string }) {
    const key = `${municipio}|${barrio ?? ''}`;
    const hit = this.cache.get(key);
    if (hit && Date.now() - hit.at < this.TTL) return hit.data;

    const data = { featured: [], flash: [], meta: { municipio, barrio, cached: false } };
    this.cache.set(key, { at: Date.now(), data });
    return data;
  }
}
