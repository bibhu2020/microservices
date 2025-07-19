import { IsString, IsOptional, IsPhoneNumber, MaxLength, IsInt, IsPositive, IsDate, IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseDto } from '../base.dto';

export class SupplierDto extends BaseDto {
  @ApiProperty({
    description: 'Unique identifier for the supplier',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  SupplierID: number;

  @ApiProperty({
    description: 'Name of the company of the supplier',
    example: 'BestSupplier Inc.',
  })
  @IsString()
  @MaxLength(40)
  CompanyName: string;

  @ApiProperty({
    description: 'Name of the contact person',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  ContactName: string;

  @ApiProperty({
    description: 'Title of the contact person',
    example: 'Manager',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  ContactTitle: string;

  @ApiProperty({
    description: 'Address of the supplier',
    example: '1234 Supplier Street, City, Country',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  Address: string;

  @ApiProperty({
    description: 'City of the supplier',
    example: 'New York',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  City: string;

  @ApiProperty({
    description: 'Region of the supplier',
    example: 'NY',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  Region: string;

  @ApiProperty({
    description: 'Postal code of the supplier',
    example: '10001',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  PostalCode: string;

  @ApiProperty({
    description: 'Country of the supplier',
    example: 'USA',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  Country: string;

  @ApiProperty({
    description: 'Phone number of the supplier',
    example: '+1-800-555-1234',
    required: false,
  })
  @IsOptional()
  //@IsPhoneNumber('US',{ message: 'Invalid phone number format' })
  @MaxLength(24)
  Phone: string;

  @ApiProperty({
    description: 'Fax number of the supplier',
    example: '+1-800-555-4321',
    required: false,
  })
  @IsOptional()
  //@IsPhoneNumber('US', { message: 'Invalid fax number format' })
  @MaxLength(24)
  Fax: string;

  @ApiProperty({
    description: 'Homepage URL of the supplier',
    example: 'https://www.supplierwebsite.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  HomePage: string;
}
