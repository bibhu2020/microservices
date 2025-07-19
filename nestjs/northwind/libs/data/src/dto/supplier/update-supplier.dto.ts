import { PartialType } from '@nestjs/mapped-types';
import { SupplierDto } from './supplier.dto';  // Adjust the import path accordingly

// this ensures that not all properties are required
export class UpdateSupplierDto extends PartialType(SupplierDto) {}
