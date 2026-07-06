import { Controller, Get, Query } from '@nestjs/common';
import { NearQuerySchema } from '../common/schemas';
import { BusinessesService } from './businesses.service';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businesses: BusinessesService) {}

  @Get('near')
  near(@Query() raw: Record<string, string>) {
    const query = NearQuerySchema.parse(raw);
    return this.businesses.near(query);
  }
}
