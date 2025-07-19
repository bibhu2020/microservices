import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
// import { Customer } from '../../models/customer.entity';
import { Customer } from '@bpm/data/models/customer.entity';
import { CustomerDto } from '@bpm/data/dto/customer/customer.dto';
import { UpdateCustomerDto } from '@bpm/data/dto/customer/update-customer.dto';
import { ApploggerService } from '@bpm/common';

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
      where: { CustomerID: id.toUpperCase() },
    });
    if (!Customer) {
      this.logger.error(`Customer with ID ${id} not found`);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return Customer;
  }

  async create(dto: CustomerDto): Promise<Customer> {
    const exists = await this.CustomerRepo.findOne({ where: { CustomerID: dto.CustomerID } });
    if (exists) {
      throw new ConflictException(`Customer with ID ${dto.CustomerID} already exists.`);
    }
    const customer = this.CustomerRepo.create(dto);
    return this.CustomerRepo.save(customer);
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
