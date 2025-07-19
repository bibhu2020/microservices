import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../models/customer.entity';
import { CreateCustomerDto } from '@bpm/common/models/dto/create-customer.dto';
import { UpdateCustomerDto } from '@bpm/common/models/dto/update-customer.dto';
import { ApploggerService } from '../../libs/applogger/src';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly CustomerRepo: Repository<Customer>,
    private readonly logger: ApploggerService,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.CustomerRepo.find();
  }

  async findOne(id: string): Promise<Customer> {
    const Customer = await this.CustomerRepo.findOne({
      where: { CustomerID: id },
    });
    if (!Customer) {
      this.logger.error(`Customer with ID ${id} not found`);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return Customer;
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const Customer = this.CustomerRepo.create(dto);
    return this.CustomerRepo.save(Customer);
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const Customer = await this.findOne(id);
    const updated = { ...Customer, ...dto };
    return this.CustomerRepo.save(updated);
  }

  async remove(id: string): Promise<void> {
    const Customer = await this.findOne(id);
    await this.CustomerRepo.remove(Customer);
  }
}
