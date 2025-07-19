import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../models/order.entity';
import { CreateOrderDto } from '@bpm/common/models/dto/create-order.dto';
import { UpdateOrderDto } from '@bpm/common/models/dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly OrderRepo: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.OrderRepo.find({
      relations: ['Customer', 'Employee', 'ShipVia'],
    });
  }

  async findOrdersWithDetails(): Promise<Order[]> {
    return this.OrderRepo.createQueryBuilder('Orders')
      .leftJoinAndSelect('Orders.OrderDetails', 'OrderDetail') // LEFT JOIN
      .leftJoinAndSelect('Orders.Customer', 'Customer')
      .leftJoinAndSelect('Orders.Employee', 'Employee')
      .leftJoinAndSelect('Orders.ShipVia', 'Shipper')
      .getMany();
  }

  async findOne(id: number): Promise<Order> {
    const Order = await this.OrderRepo.findOne({
      where: { OrderID: id },
      relations: ['Customer', 'Employee', 'ShipVia'],
    });
    if (!Order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return Order;
  }

  async findOrdersByCustomer(customerId: string) {
    return this.OrderRepo.find({
      where: {
        Customer: {
          CustomerID: customerId,
        },
      },
      relations: [
        'Customer',
        'Employee',
        'ShipVia',
        'OrderDetails',
        'OrderDetails.Product',
      ],
      order: {
        OrderDate: 'DESC',
      },
    });
  }

  async findOrdersByCustomer2(customerId: string) {
    return this.OrderRepo.createQueryBuilder('Orders')
      .leftJoinAndSelect('Orders.Customer', 'Customer')
      .leftJoinAndSelect('Orders.Employee', 'Employee')
      .leftJoinAndSelect('Orders.ShipVia', 'Shipper')
      .leftJoinAndSelect('Orders.OrderDetails', 'OrderDetail')
      .leftJoinAndSelect('OrderDetail.Product', 'Product')
      .where('Customer.CustomerID = :customerId', { customerId })
      .select([
        'Orders.OrderID',
        'Orders.OrderDate',
        'Customer.CustomerID',
        'Customer.CompanyName',
        'Employee.EmployeeID',
        'Employee.FirstName',
        'Employee.LastName',
        'Shipper.ShipperID',
        'Shipper.CompanyName',
        'OrderDetail.Quantity',
        'OrderDetail.UnitPrice',
        'Product.ProductName',
      ])
      .orderBy('Orders.OrderDate', 'DESC')
      .getMany();
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const Order = this.OrderRepo.create(dto);
    return this.OrderRepo.save(Order);
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const Order = await this.findOne(id);
    const updated = { ...Order, ...dto };
    return this.OrderRepo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const Order = await this.findOne(id);
    await this.OrderRepo.remove(Order);
  }
}
