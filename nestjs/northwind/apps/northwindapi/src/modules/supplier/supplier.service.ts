import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '@bpm/data/models/supplier.entity';
import { CreateSupplierDto } from '@bpm/data/dto/supplier/create-supplier.dto';
import { UpdateSupplierDto } from '@bpm/data/dto/supplier/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly SupplierRepo: Repository<Supplier>,
  ) {}

  async findAll(): Promise<Supplier[]> {
    return this.SupplierRepo.find();
  }

  async findOne(id: number): Promise<Supplier> {
    const Supplier = await this.SupplierRepo.findOne({
      where: { SupplierID: id },
    });
    if (!Supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return Supplier;
  }

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    const Supplier = this.SupplierRepo.create(dto);
    return this.SupplierRepo.save(Supplier);
  }

  async update(id: number, dto: UpdateSupplierDto): Promise<Supplier> {
    const Supplier = await this.findOne(id);
    const updated = { ...Supplier, ...dto };
    return this.SupplierRepo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const Supplier = await this.findOne(id);
    await this.SupplierRepo.remove(Supplier);
  }
}
