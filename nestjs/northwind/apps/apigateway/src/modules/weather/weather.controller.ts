// apps/apigateway/src/weather/weather.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('current')
  getCurrentWeather(@Query('city') city: string, @Query('country') country: string) {
    return this.weatherService.getCurrentWeather(city, country);
  }

  @Get('forecast')
  getForecast(
    @Query('city') city: string,
    @Query('country') country: string,
    @Query('days') days: string,
  ) {
    return this.weatherService.getForecast(city, country, parseInt(days));
  }
}
