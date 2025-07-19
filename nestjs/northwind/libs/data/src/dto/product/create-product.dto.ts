import { OmitType } from '@nestjs/mapped-types';
import { ProductDto } from './product.dto';

// Omit EmployeeID if it's auto-generated
export class CreateProductDto extends OmitType(ProductDto, ['ProductID'] as const) {}