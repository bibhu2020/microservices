import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerDto } from '@bpm/data/dto/customer/customer.dto';
import { UpdateCustomerDto } from '@bpm/data/dto/customer/update-customer.dto';

@Controller(['customer', 'customers'])
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CustomerDto) {
    //console.log('Creating customer with data:', createCustomerDto);
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    //console.log('Fetching all customers');
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
