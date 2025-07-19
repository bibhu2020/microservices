import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Category } from '../../models/category.entity';
import { Category } from '@bpm/data/models/category.entity';
import { CreateCategoryDto } from '@bpm/data/dto/category/create-category.dto';
import { UpdateCategoryDto } from '@bpm/data/dto/category/update-category.dto';
import { ApploggerService } from '@bpm/common';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly CategoryRepo: Repository<Category>,
    private readonly logger: ApploggerService,
  ) {}

  async findAll(): Promise<Category[]> {
    this.logger.log('Fetching all categories', CategoryService.name);
    return this.CategoryRepo.find();
  }

  async findOne(id: number): Promise<Category> {
    const Category = await this.CategoryRepo.findOne({
      where: { CategoryID: id },
    });
    if (!Category) {
      this.logger.error(
        `Category with ID ${id} not found`,
        CategoryService.name,
      );
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return Category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const Category = this.CategoryRepo.create(dto);
    return this.CategoryRepo.save(Category);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const Category = await this.findOne(id);
    const updated = { ...Category, ...dto };
    return this.CategoryRepo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const Category = await this.findOne(id);
    await this.CategoryRepo.remove(Category);
  }
}
