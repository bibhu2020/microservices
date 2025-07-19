import { Module } from '@nestjs/common';
import { ShipperService } from './shipper.service';
import { ShipperController } from './shipper.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipper } from '@bpm/data/models/shipper.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shipper])],
  controllers: [ShipperController],
  providers: [ShipperService],
})
export class ShipperModule {}
