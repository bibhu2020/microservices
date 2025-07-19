import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipper } from '../../models/shipper.entity';
import { CreateShipperDto } from '@bpm/common/models/dto/create-shipper.dto';
import { UpdateShipperDto } from '@bpm/common/models/dto/update-shipper.dto';

@Injectable()
export class ShipperService {
  constructor(
    @InjectRepository(Shipper)
    private readonly shipperRepo: Repository<Shipper>,
  ) {}

  async findAll(): Promise<Shipper[]> {
    return this.shipperRepo.find();
  }

  async findOne(id: number): Promise<Shipper> {
    const shipper = await this.shipperRepo.findOne({
      where: { ShipperID: id },
    });
    if (!shipper) {
      throw new NotFoundException(`Shipper with ID ${id} not found`);
    }
    return shipper;
  }

  async create(dto: CreateShipperDto): Promise<Shipper> {
    const shipper = this.shipperRepo.create(dto);
    return this.shipperRepo.save(shipper);
  }

  async update(id: number, dto: UpdateShipperDto): Promise<Shipper> {
    const shipper = await this.findOne(id);
    const updated = { ...shipper, ...dto };
    return this.shipperRepo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const shipper = await this.findOne(id);
    await this.shipperRepo.remove(shipper);
  }
}
