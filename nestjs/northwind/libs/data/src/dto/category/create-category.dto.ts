import { OmitType } from '@nestjs/mapped-types';
import { CategoryDto } from './category.dto';

// Omit CustomerID if it's auto-generated
export class CreateCategoryDto extends OmitType(CategoryDto, ['CategoryID'] as const) {}