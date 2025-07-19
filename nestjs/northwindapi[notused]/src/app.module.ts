import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApploggerModule } from './libs/applogger/src';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import AppDataSource from 'src/config/typeorm.config'; // Adjust path as needed
import { CategoryModule } from './modules/category/category.module';
import { CustomerModule } from './modules/customer/customer.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { ShipperModule } from './modules/shipper/shipper.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { OrderDetailModule } from './modules/order-detail/order-detail.module';

@Module({
  imports: [
    //Throttling settings
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 3 requests per 1 seconds (short limit)
        limit: 3,
      },
      {
        name: 'long',
        ttl: 60000, // 100 requests per 1 minute (long limit)
        limit: 100,
      },
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

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
