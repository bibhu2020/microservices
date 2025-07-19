import { OmitType } from '@nestjs/mapped-types';
import { EmployeeDto } from './employee.dto';

// Omit EmployeeID if it's auto-generated
export class CreateEmployeeDto extends OmitType(EmployeeDto, ['EmployeeID'] as const) {}