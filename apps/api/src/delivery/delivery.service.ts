import { Injectable } from '@nestjs/common';
import type { DeliveryQuoteDto } from '../common/schemas';

@Injectable()
export class DeliveryService {
  quote(dto: DeliveryQuoteDto) {
    const base = 4000;
    const km = 2.5;
    return {
      pickup: { label: dto.pickup },
      dropoff: { label: dto.dropoff },
      distanceKm: km,
      estimatedMinutes: 25,
      fare: { base, distance: Math.round(km * 800), total: base + Math.round(km * 800) },
      municipio: dto.municipio,
    };
  }
}
