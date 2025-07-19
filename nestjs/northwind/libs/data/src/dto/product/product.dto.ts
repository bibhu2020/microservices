import { IsString, IsOptional, IsDecimal, IsInt, IsBoolean, Min, MaxLength, IsPositive, IsNotEmpty, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../base.dto';


export class ProductDto extends BaseDto {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  ProductID: number;

  @ApiProperty({
    description: 'Product name for the product being created',
    example: 'Apple Juice',
  })
  @IsString()
  @IsNotEmpty()
  ProductName: string;

  @ApiProperty({
    description: 'Supplier ID for the product',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  SupplierID: number;

  @ApiProperty({
    description: 'Category ID to which the product belongs',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  CategoryID: number;

  @ApiProperty({
    description: 'Quantity per unit of the product',
    example: '10 bottles per box',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  QuantityPerUnit: string;

  @ApiProperty({
    description: 'Unit price of the product',
    example: 5.99,
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  @Min(0)
  UnitPrice: number;

  @ApiProperty({
    description: 'Units in stock for the product',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  UnitsInStock: number;

  @ApiProperty({
    description: 'Units on order for the product',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  UnitsOnOrder: number;

  @ApiProperty({
    description: 'Reorder level for the product',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  ReorderLevel: number;

  @ApiProperty({
    description: 'Indicates whether the product is discontinued',
    example: false,
  })
  @IsBoolean()
  Discontinued: boolean;

}
