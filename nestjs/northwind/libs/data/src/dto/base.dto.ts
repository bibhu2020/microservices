import { IsString, IsOptional, MaxLength, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';

export class BaseDto {
  @ApiProperty({
    description: 'Timestamp when the customer was created',
    example: '1992-08-14',
    required: false,
  })
//   @Transform(({ value }) => {
//   if (!(value instanceof Date)) return value;
//   const pad = (n: number) => n.toString().padStart(2, '0');
//   const yyyy = value.getFullYear();
//   const mm = pad(value.getMonth() + 1);
//   const dd = pad(value.getDate());
//   const hh = pad(value.getHours());
//   const min = pad(value.getMinutes());
//   const ss = pad(value.getSeconds());
//   return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
// }, { toPlainOnly: true })
  @IsOptional()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the customer was created',
    example: '1992-08-14',
    required: false,
  })
//   @Transform(({ value }) => {
//   if (!(value instanceof Date)) return value;
//   const pad = (n: number) => n.toString().padStart(2, '0');
//   const yyyy = value.getFullYear();
//   const mm = pad(value.getMonth() + 1);
//   const dd = pad(value.getDate());
//   const hh = pad(value.getHours());
//   const min = pad(value.getMinutes());
//   const ss = pad(value.getSeconds());
//   return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
// }, { toPlainOnly: true })
  @IsOptional()
  updatedAt: Date;
}
