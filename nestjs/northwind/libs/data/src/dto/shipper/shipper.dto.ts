import { IsString, IsOptional, IsPhoneNumber, MaxLength, IsInt, IsPositive, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../base.dto';

export class ShipperDto extends BaseDto {
  @ApiProperty({
    description: 'Unique identifier for the shipper',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  ShipperID: number;

  @ApiProperty({
    description: 'Name of the company handling the shipping',
    example: 'FastShip Logistics',
  })
  @IsString()
  @MaxLength(40)
  CompanyName: string;

  @ApiProperty({
    description: 'Phone number for the shipper',
    example: '+1-800-555-1234',
    required: false,
  })
  @IsOptional()
  //@IsPhoneNumber('US', { message: 'Invalid phone number format' })  // Validates phone number for US format
  @MaxLength(24)
  Phone: string;
}
