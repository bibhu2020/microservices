import { OmitType } from '@nestjs/mapped-types';
import { CustomerDto } from './customer.dto';

// Omit CustomerID if it's auto-generated
export class CreateCustomerDto extends OmitType(CustomerDto, ['CustomerID'] as const) {}