import { IsString, IsOptional, IsDate, IsInt, IsDecimal, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { CreateOrderDetailDto } from './create-order-detail.dto';
import { BaseDto } from '../base.dto';

export class OrderDto extends BaseDto {
  @ApiProperty({
    description: 'Unique identifier for the order',
    example: 1,
  })
  @IsInt()
  OrderID: number;

  @ApiProperty({
    description: 'Customer ID associated with the order',
    example: 1,
  })
  // @IsInt()
  CustomerID: string;

  @ApiProperty({
    description: 'Employee ID handling the order',
    example: 1,
  })
  @IsInt()
  EmployeeID: number;

  @ApiProperty({
    description: 'Order details associated with the order',
    example: [
      {
        OrderDetailID: 1,
        ProductID: 5,
        Quantity: 10,
        UnitPrice: 19.99
      },
    ],
    required: false,
  })
  @IsOptional()
  OrderDetails: CreateOrderDetailDto[];

  @ApiProperty({
    description: 'The date when the order was placed',
    example: '2023-05-22T13:45:00Z',
    required: false,
  })
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  OrderDate: Date;

  @ApiProperty({
    description: 'The required date for delivery',
    example: '2023-06-01T00:00:00Z',
    required: false,
  })
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  RequiredDate: Date;

  @ApiProperty({
    description: 'The actual shipping date',
    example: '2023-05-25T00:00:00Z',
    required: false,
  })
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ShippedDate: Date;

  @ApiProperty({
    description: 'Shipper ID used for the order',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  ShipVia: number;

  @ApiProperty({
    description: 'Freight charges for shipping',
    example: 45.99,
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  Freight: number;

  @ApiProperty({
    description: 'Name of the recipient for shipping',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  ShipName: string;

  @ApiProperty({
    description: 'Address to which the order should be shipped',
    example: '123 Tech St, Silicon Valley, CA',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  ShipAddress: string;

  @ApiProperty({
    description: 'City where the order should be shipped',
    example: 'San Francisco',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  ShipCity: string;

  @ApiProperty({
    description: 'Region where the order should be shipped',
    example: 'CA',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  ShipRegion: string;

  @ApiProperty({
    description: 'Postal code for shipping destination',
    example: '94107',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  ShipPostalCode: string;

  @ApiProperty({
    description: 'Country where the order should be shipped',
    example: 'USA',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  ShipCountry: string;
}
