import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { CreateOrderDetailDto } from '@bpm/data/dto/order/create-order-detail.dto';
import { UpdateOrderDetailDto } from '@bpm/data/dto/order/update-order-detail.dto';

@Controller(['order-detail', 'order-details', 'orderdetail', 'orderdetails'])
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  // @Post()
  // create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
  //   return this.orderDetailService.create(createOrderDetailDto);
  // }

  @Get()
  findAll() {
    return this.orderDetailService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.orderDetailService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDetailDto: UpdateOrderDetailDto) {
  //   return this.orderDetailService.update(+id, updateOrderDetailDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.orderDetailService.remove(+id);
  // }
}
