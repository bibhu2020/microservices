import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@bpm/data/models/order.entity';
import { Customer } from '@bpm/data/models';
import { Employee } from '@bpm/data/models';
import { Shipper } from '@bpm/data/models';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), 
            TypeOrmModule.forFeature([Customer]),
            TypeOrmModule.forFeature([Employee]),
            TypeOrmModule.forFeature([Shipper])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
