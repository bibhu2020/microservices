import { OmitType } from '@nestjs/mapped-types';
import { OrderDetailDto } from './order-detail.dto';

// Omit EmployeeID if it's auto-generated
export class CreateOrderDetailDto extends OmitType(OrderDetailDto, ['OrderDetailID'] as const) {}