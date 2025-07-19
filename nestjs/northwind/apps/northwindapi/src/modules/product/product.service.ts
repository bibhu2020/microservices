import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@bpm/data/models/product.entity';
import { CreateProductDto } from '@bpm/data/dto/product/create-product.dto';
import { UpdateProductDto } from '@bpm/data/dto/product/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly ProductRepo: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.ProductRepo.find();
  }

  async findOne(id: number): Promise<Product> {
    const Product = await this.ProductRepo.findOne({
      where: { ProductID: id },
    });
    if (!Product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return Product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const Product = this.ProductRepo.create(dto);
    return this.ProductRepo.save(Product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const Product = await this.findOne(id);
    const updated = { ...Product, ...dto };
    return this.ProductRepo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const Product = await this.findOne(id);
    await this.ProductRepo.remove(Product);
  }
}
