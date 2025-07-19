import { PartialType } from '@nestjs/mapped-types';
import { OrderDetailDto } from './order-detail.dto';

export class UpdateOrderDetailDto extends PartialType(OrderDetailDto) {}
