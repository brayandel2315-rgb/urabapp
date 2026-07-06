import { Controller, Get, Query } from '@nestjs/common';
import { OffersQuerySchema } from '../common/schemas';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offers: OffersService) {}

  @Get()
  list(@Query() raw: Record<string, string>) {
    const query = OffersQuerySchema.parse(raw);
    return this.offers.list(query);
  }
}
