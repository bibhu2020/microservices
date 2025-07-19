import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';  // Adjust the import path accordingly

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

