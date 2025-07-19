import { IsString, IsOptional, MaxLength, IsPhoneNumber, IsDate, IsInt, IsPositive } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../base.dto';

export class EmployeeDto extends BaseDto {
  @ApiProperty({
    description: 'Unique identifier for the employee',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  EmployeeID: number;

  @ApiProperty({
    description: 'Last name of the employee',
    example: 'Doe',
  })
  @IsString()
  @MaxLength(20)
  LastName: string;

  @ApiProperty({
    description: 'First name of the employee',
    example: 'John',
  })
  @IsString()
  @MaxLength(10)
  FirstName: string;

  @ApiProperty({
    description: 'Job title of the employee',
    example: 'Software Developer',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  Title: string;

  @ApiProperty({
    description: 'Title of courtesy for the employee',
    example: 'Mr.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  TitleOfCourtesy: string;

  @ApiProperty({
    description: 'Date of birth of the employee',
    example: '1990-01-01T00:00:00Z',
    required: false,
  })
  @Transform(({ value }) => new Date(value), { toClassOnly: true }) //when deserializing (plain → instance)
  @Transform(({ value }) => value instanceof Date ? value.toISOString().split('T')[0] : value, { toPlainOnly: true }) //only when serializing (instance → plain).
  @IsOptional()
  @IsDate()
  BirthDate: Date;

  @ApiProperty({
    description: 'Date the employee was hired',
    example: '2020-05-01T00:00:00Z',
    required: false,
  })
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @Transform(({ value }) => value instanceof Date ? value.toISOString().split('T')[0] : value, { toPlainOnly: true })
  @IsOptional()
  @IsDate()
  HireDate: Date;

  @ApiProperty({
    description: 'Address of the employee',
    example: '123 Main St, Springfield, IL',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  Address: string;

  @ApiProperty({
    description: 'City where the employee lives',
    example: 'Springfield',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  City: string;

  @ApiProperty({
    description: 'Region or state where the employee lives',
    example: 'IL',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  Region: string;

  @ApiProperty({
    description: 'Postal code of the employee\'s location',
    example: '62701',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  PostalCode: string;

  @ApiProperty({
    description: 'Country where the employee resides',
    example: 'USA',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  Country: string;

  @ApiProperty({
    description: 'Home phone number of the employee',
    example: '+1 555-1234',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('US')
  @MaxLength(24)
  HomePhone: string;

  @ApiProperty({
    description: 'Extension number for the employee',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  Extension: string;

  @ApiProperty({
    description: 'Additional notes for the employee',
    example: 'Has been with the company for 5 years.',
    required: false,
  })
  @IsOptional()
  @IsString()
  Notes: string;

  @ApiProperty({
    description: 'Employee this person reports to',
    example: 2,
    required: false,
  })
  @IsOptional()
  @Type(() => EmployeeDto)
  ReportsTo?: EmployeeDto;
  // @IsInt()
  // ReportsTo: number;
}
