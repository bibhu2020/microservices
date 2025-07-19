import { PartialType } from '@nestjs/mapped-types';
import { OrderDto } from './order.dto';

export class UpdateOrderDto extends PartialType(OrderDto) {}
