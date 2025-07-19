import { DataSource } from 'typeorm';
import { Category } from '../../models/category.entity';

export async function seedCategories(dataSource: DataSource) {
  const repo = dataSource.getRepository(Category);
  const existing = await repo.count();
  if (existing > 0) {
    console.log('🛑 Categories already exist. Skipping...');
    return;
  }

  const categories = [
    { CategoryName: 'Beverages', Description: 'Soft drinks, tea, coffee' },
    { CategoryName: 'Condiments', Description: 'Sauces and seasonings' },
    { CategoryName: 'Confections', Description: 'Desserts and sweet breads' },
    { CategoryName: 'Dairy Products', Description: 'Cheeses and other dairy' },
    { CategoryName: 'Grains/Cereals', Description: 'Breads, crackers, pasta' },
    { CategoryName: 'Meat/Poultry', Description: 'Prepared meats' },
    {
      CategoryName: 'Produce',
      Description: 'Dried and fresh fruit/vegetables',
    },
    { CategoryName: 'Seafood', Description: 'Seaweed, fish' },
    { CategoryName: 'Snacks', Description: 'Chips and small packs' },
    { CategoryName: 'Health', Description: 'Supplements and vitamins' },
  ];

  await repo.save(categories);
  console.log('✅ Seeded categories');
}
