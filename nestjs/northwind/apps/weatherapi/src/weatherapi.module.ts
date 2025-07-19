import { Module } from '@nestjs/common';
import { WeatherApiController } from './weatherapi.controller';
import { WeatherApiService } from './weatherapi.service';

@Module({
  imports: [],
  controllers: [WeatherApiController],
  providers: [WeatherApiService],
})
export class WeatherApiModule {}
