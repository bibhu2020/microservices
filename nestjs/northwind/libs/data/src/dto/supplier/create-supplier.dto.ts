import { OmitType } from '@nestjs/mapped-types';
import { SupplierDto } from './supplier.dto';

// Omit CustomerID if it's auto-generated
export class CreateSupplierDto extends OmitType(SupplierDto, ['SupplierID'] as const) {}