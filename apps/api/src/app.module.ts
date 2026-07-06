import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from './search/search.module';
import { OffersModule } from './offers/offers.module';
import { BusinessesModule } from './businesses/businesses.module';
import { DeliveryModule } from './delivery/delivery.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SearchModule,
    OffersModule,
    BusinessesModule,
    DeliveryModule,
  ],
})
export class AppModule {}
