// src/weather.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { WeatherApiService } from './weatherapi.service';

@Controller()
export class WeatherApiController {
  constructor(private readonly weatherService: WeatherApiService) {}

  @GrpcMethod('WeatherApiService', 'GetCurrentWeather')
  getCurrentWeather(data) {
    return this.weatherService.getCurrentWeather(data);
  }

  @GrpcMethod('WeatherApiService', 'GetForecast')
  getForecast(data) {
    return this.weatherService.getForecast(data);
  }
}
