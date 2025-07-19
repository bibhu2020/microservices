import { IsString, IsOptional, MaxLength, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../base.dto';

export class CustomerDto extends BaseDto {
  @ApiProperty({
    description: 'Unique identifier for the customer',
    example: 'C1234',
  })
  @IsString()
  @MaxLength(5)
  CustomerID: string;

  @ApiProperty({
    description: 'Name of the company',
    example: 'Tech Solutions Inc.',
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
    description: 'Address of the company',
    example: '123 Tech Lane, Silicon Valley, CA',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  Address: string;

  @ApiProperty({
    description: 'City where the company is located',
    example: 'San Francisco',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  City: string;

  @ApiProperty({
    description: 'Region or state where the company is located',
    example: 'CA',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  Region: string;

  @ApiProperty({
    description: 'Postal code of the company',
    example: '94107',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  PostalCode: string;

  @ApiProperty({
    description: 'Country where the company is located',
    example: 'USA',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  Country: string;

  @ApiProperty({
    description: 'Phone number of the contact person',
    example: '+1 555-1234',
    required: false,
  })
  @IsOptional()
  //@IsPhoneNumber('US')
  @MaxLength(24)
  Phone: string;

  @ApiProperty({
    description: 'Fax number of the contact person',
    example: '+1 555-5678',
    required: false,
  })
  @IsOptional()
  //@IsPhoneNumber('US')
  @MaxLength(24)
  Fax: string;

  @ApiProperty({
    description: 'Address of the company',
    example: '123 Tech Lane, Silicon Valley, CA',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  PhotoURL: string;


}
