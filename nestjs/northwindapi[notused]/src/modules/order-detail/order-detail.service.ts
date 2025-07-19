import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetail } from '../../models/orderdetail.entity';
import { CreateOrderDetailDto } from '@bpm/common/models/dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from '@bpm/common/models/dto/update-order-detail.dto';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly OrderDetailRepo: Repository<OrderDetail>,
  ) {}

  async findAll(): Promise<OrderDetail[]> {
    return this.OrderDetailRepo.find();
  }

  // async findOne(id: number): Promise<OrderDetail> {
  //   const OrderDetail = await this.OrderDetailRepo.findOne({ where: { OrderDetailID: id } });
  //   if (!OrderDetail) {
  //     throw new NotFoundException(`OrderDetail with ID ${id} not found`);
  //   }
  //   return OrderDetail;
  // }

  // async create(dto: CreateOrderDetailDto): Promise<OrderDetail> {
  //   const OrderDetail = this.OrderDetailRepo.create(dto);
  //   return this.OrderDetailRepo.save(OrderDetail);
  // }

  // async update(id: number, dto: UpdateOrderDetailDto): Promise<OrderDetail> {
  //   const OrderDetail = await this.findOne(id);
  //   const updated = { ...OrderDetail, ...dto };
  //   return this.OrderDetailRepo.save(updated);
  // }

  // async remove(id: number): Promise<void> {
  //   const OrderDetail = await this.findOne(id);
  //   await this.OrderDetailRepo.remove(OrderDetail);
  // }
}
