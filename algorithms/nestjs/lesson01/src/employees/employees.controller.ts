import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Ip } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Prisma } from '@prisma/client';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

@SkipThrottle()  // Skip throttling for all endpoints in this controller
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}
  private readonly logger = new MyLoggerService(EmployeesController.name);


  @Post()
  create(@Body() createEmployeeDto: Prisma.EmployeeCreateInput) {
    return this.employeesService.create(createEmployeeDto);
  }

  @SkipThrottle({default: false})  // Skip throttling for this endpoint
  @Get()
  findAll(@Ip() ip: string, @Query('role') role: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    this.logger.log(`Finding all employeesss from IP: ${ip}.`, EmployeesController.name);
    return this.employeesService.findAll();
  }

  @SkipThrottle({default: false})  // Skip throttling for this endpoint
  @Throttle({short: {ttl: 1000, limit: 1}})  // Apply short throttling for this endpoint
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}
