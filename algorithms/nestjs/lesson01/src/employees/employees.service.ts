import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from '../db/db.service';

@Injectable()
export class EmployeesService {
  constructor(private readonly db: DbService) {}
  
  async create(createEmployeeDto: Prisma.EmployeeCreateInput) {
    return this.db.employee.create({
      data: createEmployeeDto,
    });
  }
  async findAll() {
    return this.db.employee.findMany();
  }
  async findOne(id: number) {
    return this.db.employee.findUnique({
      where: { id },
    });
  }
  async update(id: number, updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    return this.db.employee.update({
      where: { id },            
      data: updateEmployeeDto,
    });
  }
  async remove(id: number) {
    return this.db.employee.delete({
      where: { id },
    });
  }
  async findByRole(role: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    return this.db.employee.findMany({
      where: { role },
    });
  }
}
