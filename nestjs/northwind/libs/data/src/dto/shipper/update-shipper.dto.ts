import { PartialType } from '@nestjs/mapped-types';
import { ShipperDto } from './shipper.dto';

export class UpdateShipperDto extends PartialType(ShipperDto) {}
