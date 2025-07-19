import { IsOptional, IsString, MaxLength, IsBase64 } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(15)
  CategoryName: string;

  @IsOptional()
  @IsString()
  Description?: string;

  // Picture is optional and expected as base64 encoded string (you can convert to Buffer later)
  @IsOptional()
  @IsBase64()
  Picture?: string;
}
