import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../models/employee.entity';
import { CreateEmployeeDto } from '@bpm/common/models/dto/create-employee.dto';
import { UpdateEmployeeDto } from '@bpm/common/models/dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly EmployeeRepo: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.EmployeeRepo.find();
  }

  async findOne(id: number): Promise<Employee> {
    const Employee = await this.EmployeeRepo.findOne({
      where: { EmployeeID: id },
    });
    if (!Employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return Employee;
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const Employee = this.EmployeeRepo.create(dto);
    return this.EmployeeRepo.save(Employee);
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const Employee = await this.findOne(id);
    const updated = { ...Employee, ...dto };
    return this.EmployeeRepo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const Employee = await this.findOne(id);
    await this.EmployeeRepo.remove(Employee);
  }
}
