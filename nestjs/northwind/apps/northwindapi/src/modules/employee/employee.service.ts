import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '@bpm/data/models/employee.entity';
import { EmployeeDto } from '@bpm/data/dto/employee/employee.dto';
import { CreateEmployeeDto } from '@bpm/data/dto/employee/create-employee.dto';
import { UpdateEmployeeDto } from '@bpm/data/dto/employee/update-employee.dto';

import { plainToInstance, instanceToPlain } from 'class-transformer';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly EmployeeRepo: Repository<Employee>,
  ) {}

  async findAll(): Promise<any[]> {
    const rows = await this.EmployeeRepo.find({
      relations: ['ReportsTo'],
    });

    const dtos = plainToInstance(EmployeeDto, rows.map(row => ({
      ...row,
    })));

    // Convert to plain objects so @Transform is applied on output
    return dtos.map(dto => instanceToPlain(dto));
  }

  async findOne(id: number): Promise<any> {
    const row = await this.EmployeeRepo.findOne({
      where: { EmployeeID: id },
      relations: ['ReportsTo'],
    });
    if (!row) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    const dto = plainToInstance(EmployeeDto, {
      ...row,
    });
    return instanceToPlain(dto);
  }

  async create(dto: CreateEmployeeDto): Promise<any> {
    // Resolve the ReportsTo field if present
    const reportsToEmployee = await this.EmployeeRepo.findOne({
      where: { EmployeeID: typeof dto.ReportsTo === 'number' ? dto.ReportsTo : undefined },
    });

    // Create the employee entity with the DTO data
    const employee = this.EmployeeRepo.create({
      ...dto,  // Spread the DTO data
      ReportsTo: reportsToEmployee ?? undefined,  // Set the reportsTo to the resolved Employee entity (or undefined)
    });

    // Save the employee to the database
    const result = await  this.EmployeeRepo.save(employee);
    if (!result) {
      throw new NotFoundException(`Employee Insert failed`);
    }
    const dtoReturn = plainToInstance(EmployeeDto, {
      ...result,
    });
    return instanceToPlain(dtoReturn);
  }


  async update(id: number, dto: UpdateEmployeeDto): Promise<any> {
    const Employee = await this.EmployeeRepo.findOne({
      where: { EmployeeID: id},
    });

    // Resolve the ReportsTo field if present
    const reportsToId = typeof dto.ReportsTo === 'object' && dto.ReportsTo !== null
      ? (dto.ReportsTo as any).EmployeeID
      : dto.ReportsTo;
    const reportsToEmployee = await this.EmployeeRepo.findOne({
      where: { EmployeeID: typeof reportsToId === 'number' ? reportsToId : undefined },
    });

    const updated = { ...Employee, ...dto, ReportsTo: reportsToEmployee ?? undefined, updatedAt: new Date() };
    const result = await  this.EmployeeRepo.save(updated);
    if (!result) {
      throw new NotFoundException(`Employee ID ${id} update failed`);
    }
    const dtoReturn = plainToInstance(EmployeeDto, {
      ...result,
    });
    return instanceToPlain(dtoReturn);
  }

  async remove(id: number): Promise<void> {
    const Employee = await this.EmployeeRepo.findOne({
      where: { EmployeeID: id},
    });
    if (!Employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    await this.EmployeeRepo.remove(Employee);
  }
}
