import { Body, Controller, Post } from '@nestjs/common';
import { DeliveryQuoteSchema } from '../common/schemas';
import { DeliveryService } from './delivery.service';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly delivery: DeliveryService) {}

  @Post('quote')
  quote(@Body() body: unknown) {
    const dto = DeliveryQuoteSchema.parse(body);
    return this.delivery.quote(dto);
  }
}
