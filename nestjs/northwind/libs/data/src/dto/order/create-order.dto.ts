import { OmitType } from '@nestjs/mapped-types';
import { OrderDto } from './order.dto';

// Omit EmployeeID if it's auto-generated
export class CreateOrderDto extends OmitType(OrderDto, ['OrderID'] as const) {}