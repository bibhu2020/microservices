import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@bpm/data/models/order.entity';
import { CreateOrderDto } from '@bpm/data/dto/order/create-order.dto';
import { UpdateOrderDto } from '@bpm/data/dto/order/update-order.dto';

import { Customer } from '@bpm/data/models/customer.entity';
import { Employee } from '@bpm/data/models/employee.entity';
import { Shipper } from '@bpm/data/models/shipper.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly OrderRepo: Repository<Order>,

    // Inject the related repositories
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(Shipper)
    private readonly shipperRepository: Repository<Shipper>,
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

    // Fetch Customer, Employee, and Shipper entities based on provided IDs
    const customer = dto.CustomerID ? await this.customerRepository.findOne({ where: { CustomerID: dto.CustomerID } }) : null;
    const employee = dto.EmployeeID ? await this.employeeRepository.findOne({ where: { EmployeeID: dto.EmployeeID } }) : null;
    const shipper = dto.ShipVia ? await this.shipperRepository.findOne({ where: { ShipperID: dto.ShipVia } }) : null;

    // Create the employee entity with the DTO data
    const order = this.OrderRepo.create({
      ...dto,  // Spread the DTO data
      Customer: customer ?? undefined,  // Set the customer to the resolved Customer entity (or undefined)
      Employee: employee ?? undefined,  // Set the employee to the resolved Employee entity (or undefined)  
      ShipVia: shipper ?? undefined,  // Set the shipper to the resolved Shipper entity (or undefined)
    });

    const Order = this.OrderRepo.create(order);
    return this.OrderRepo.save(Order);
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const Order = await this.findOne(id);

    // Fetch Customer, Employee, and Shipper entities based on provided IDs
    const customer = dto.CustomerID ? await this.customerRepository.findOne({ where: { CustomerID: dto.CustomerID } }) : null;
    const employee = dto.EmployeeID ? await this.employeeRepository.findOne({ where: { EmployeeID: dto.EmployeeID } }) : null;
    const shipper = dto.ShipVia ? await this.shipperRepository.findOne({ where: { ShipperID: dto.ShipVia } }) : null;


    const updated = { ...Order, 
                      ...dto,
                      Customer: customer ?? undefined,  // Set the customer to the resolved Customer entity (or undefined)
                      Employee: employee ?? undefined,  // Set the employee to the resolved Employee entity (or undefined)  
                      ShipVia: shipper ?? undefined,  // Set the shipper to the resolved Shipper entity (or undefined)
                      updatedAt: new Date()
                    };
    return this.OrderRepo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const Order = await this.findOne(id);
    await this.OrderRepo.remove(Order);
  }
}
