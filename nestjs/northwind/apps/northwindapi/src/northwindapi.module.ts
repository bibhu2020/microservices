import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { NorthwindapiController } from './northwindapi.controller';
import { NorthwindapiService } from './northwindapi.service';
import { ThrottlerModule } from '@nestjs/throttler';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import AppDataSource from './config/typeorm.config'; // Adjust path as needed
import { ApploggerModule } from '@bpm/common';

import { CategoryModule } from './modules/category/category.module';
import { CustomerModule } from './modules/customer/customer.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { ShipperModule } from './modules/shipper/shipper.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { OrderDetailModule } from './modules/order-detail/order-detail.module';

import { LoggerMiddleware } from '@bpm/common/middlewares/logger/logger.middleware';

@Module({
  imports: [
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

    //Config module
    ConfigModule.forRoot({ isGlobal: true }),

    //Database connection
    TypeOrmModule.forRootAsync({
      useFactory: async () => AppDataSource.options,
    }),

    ApploggerModule,

    CategoryModule,

    CustomerModule,

    EmployeeModule,

    SupplierModule,

    ShipperModule,

    ProductModule,

    OrderModule,

    OrderDetailModule,
  ],
  controllers: [NorthwindapiController],
  providers: [NorthwindapiService],
})
export class NorthwindapiModule implements NestModule {
  // No need to bind manually if LoggerMiddleware is injectable
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // Apply LoggerMiddleware directly
      .forRoutes('*'); // Apply to all routes
  }
}