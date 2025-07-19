import { PartialType } from '@nestjs/mapped-types';
import { EmployeeDto } from './employee.dto';  // Adjust the import path accordingly

export class UpdateEmployeeDto extends PartialType(EmployeeDto) {}
