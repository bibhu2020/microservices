import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpModule } from '@nestjs/axios';

import { ApigatewayController } from './apigateway.controller';
import { ApploggerModule } from '@bpm/common';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware';


import { NorthwindModule } from './modules/northwind/northwind.module';
import { AzureModule } from './modules/azure/azure.module';
import { WeatherModule } from './modules/weather/weather.module';


@Module({
  imports: [
    // ✅ Correct usage of ThrottlerModule (Rate Limiting)
    // The limit is the maximum number of requests allowed within the ttl
    // This configuration allows for 3 requests per 1 second (short limit)
    // and 100 requests per 1 minute (long limit)
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 3 requests per 1 seconds (short limit)
        limit: 1,
      },
      {
        name: 'long',
        ttl: 60000, // 100 requests per 1 minute (long limit)
        limit: 100,
      }
    ]),

    //ConfigModule should be imported with isGlobal: true
    // This makes the configuration available globally in the application
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ HttpModule should not be passed directly like a class
    // It provides a simple and easy-to-use interface for making HTTP requests
    HttpModule,

    ApploggerModule,

    NorthwindModule,

    AzureModule,

    WeatherModule,

  ],
  controllers: [ApigatewayController],
  providers: [LoggerMiddleware],
})
export class ApigatewayModule implements NestModule {
  // No need to bind manually if LoggerMiddleware is injectable
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // Apply LoggerMiddleware directly
      .forRoutes('*'); // Apply to all routes
  }
}
