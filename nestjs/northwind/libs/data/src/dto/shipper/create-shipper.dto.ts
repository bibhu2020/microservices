import { OmitType } from '@nestjs/mapped-types';
import { ShipperDto } from './shipper.dto';

// Omit CustomerID if it's auto-generated
export class CreateShipperDto extends OmitType(ShipperDto, ['ShipperID'] as const) {}