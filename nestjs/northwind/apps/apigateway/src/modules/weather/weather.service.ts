// apps/apigateway/src/weather/weather.service.ts
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import * as opossum from 'opossum';

interface WeatherServiceClient {
  GetCurrentWeather(data: { city: string; country: string }): Observable<any>;
  GetForecast(data: { city: string; country: string; days: number }): Observable<any>;
}

@Injectable()
export class WeatherService implements OnModuleInit {
  private weatherService: WeatherServiceClient;

  private currentWeatherBreaker: opossum<any, any>;
  private forecastBreaker: opossum<any, any>;

  constructor(@Inject('WEATHER_API_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.weatherService = this.client.getService<WeatherServiceClient>('WeatherApiService');

    // Circuit breaker for GetCurrentWeather
    this.currentWeatherBreaker = new opossum(
      (data: { city: string; country: string }) =>
        lastValueFrom(this.weatherService.GetCurrentWeather(data)),
      {
        timeout: 5000, // 5 seconds timeout
        errorThresholdPercentage: 50,
        resetTimeout: 10000, // 10 seconds before retry
      }
    );

    // Circuit breaker for GetForecast
    this.forecastBreaker = new opossum(
      (data: { city: string; country: string; days: number }) =>
        lastValueFrom(this.weatherService.GetForecast(data)),
      {
        timeout: 5000,
        errorThresholdPercentage: 50,
        resetTimeout: 10000,
      }
    );

    this.currentWeatherBreaker.on('open', () => console.warn('⚠️ GetCurrentWeather breaker opened'));
    this.currentWeatherBreaker.on('close', () => console.log('✅ GetCurrentWeather breaker closed'));

    this.forecastBreaker.on('open', () => console.warn('⚠️ GetForecast breaker opened'));
    this.forecastBreaker.on('close', () => console.log('✅ GetForecast breaker closed'));
    
  }

  async getCurrentWeather(city: string, country: string) {
    return this.currentWeatherBreaker.fire({ city, country });
  }

  async getForecast(city: string, country: string, days: number) {
    return this.forecastBreaker.fire({ city, country, days });
  }
}
