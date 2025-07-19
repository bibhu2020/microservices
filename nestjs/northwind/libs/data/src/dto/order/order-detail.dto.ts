import { IsInt, IsDecimal, IsOptional, Min, Max, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseDto } from '../base.dto';

export class OrderDetailDto extends BaseDto {
  @ApiProperty({
    description: 'Unique identifier for the order detail',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  OrderDetailID: number;

  @ApiProperty({
    description: 'Order ID that this detail belongs to',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  OrderID: number;

  @ApiProperty({
    description: 'Product ID for the product being ordered',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  ProductID: number;

  @ApiProperty({
    description: 'Unit price of the product in the order detail',
    example: 19.99,
  })
  @IsDecimal()
  @Min(0)
  UnitPrice: number;

  @ApiProperty({
    description: 'Quantity of the product in the order detail',
    example: 10,
  })
  @IsInt()
  @Min(1)
  @Max(1000)
  Quantity: number;

  @ApiProperty({
    description: 'Discount applied to the product in the order detail',
    example: 0.1, // 10% discount
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  @Min(0)
  @Max(1)
  Discount: number;
}
