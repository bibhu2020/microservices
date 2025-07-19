// src/weather.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WeatherApiService {
  private readonly apiKey: string;
  private readonly baseUrl1 = 'https://api.openweathermap.org/data/2.5/forecast';
  private readonly baseUrl2 = 'https://api.openweathermap.org/data/2.5/weather';

  constructor() {
    this.apiKey = process.env.WEATHER_SERVICE_API_KEY || 'default'; 
    //console.log('WEATHER_SERVICE_API_KEY:', this.apiKey);  
  }

  async getCurrentWeather({ city, country }) {

    const weatherApiUrl = `${this.baseUrl2}?q=${city}&appid=${this.apiKey}&units=metric`;
    try {
        const response = await axios.get(weatherApiUrl);
        const data = response.data;
         return {
          city,
          country,
          temperature: data.main.temp,
          condition: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error('Failed to fetch weather data: ' + error.message);
    }
  }

  async getForecast({city, country, days}): Promise<any> {
    const url = `${this.baseUrl1}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;

    try {
      console.log(`Fetching weather forecast for city: ${city}`);
      const response = await axios.get(url);
      const forecasts = Array.from({ length: days }, (_, i) => ({
          date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
          temperature: `${20 + i}°C`,
          condition: i % 2 === 0 ? 'Sunny' : 'Cloudy',
        }));
      return { forecasts };
    } catch (error) {
      console.log(`Failed to fetch weather forecast: ${error.message}`, error.stack);
      throw error;
    }
  }
}
