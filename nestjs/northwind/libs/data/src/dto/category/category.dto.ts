import { IsString, IsOptional, IsInt, IsNotEmpty, MaxLength, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../base.dto';

export class CategoryDto extends BaseDto {
  @ApiProperty({
    description: 'Unique identifier for the customer',
    example: 'C1234',
  })
  @IsInt()
  @IsOptional()
  CategoryID: number;

  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  CategoryName: string;

  @ApiProperty({
    description: 'Description of the category',
    example: 'All kinds of electronic gadgets',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  Description: string;

  @ApiProperty({
    description: 'Category image in buffer format',
    example: null,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString() // You can adjust this to buffer validation if needed
  Picture: Buffer;
}
