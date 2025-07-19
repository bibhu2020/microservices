import { DataSource } from 'typeorm';
import { Product } from '@bpm/data/models/product.entity';
import { Supplier } from '@bpm/data/models/supplier.entity';
import { Category } from '@bpm/data/models/category.entity';

export async function seedProducts(dataSource: DataSource) {
  const productRepo = dataSource.getRepository(Product);
  const supplierRepo = dataSource.getRepository(Supplier);
  const categoryRepo = dataSource.getRepository(Category);

  const suppliers = await supplierRepo.find();
  const categories = await categoryRepo.find();

  if (suppliers.length === 0 || categories.length === 0) {
    throw new Error('Suppliers or Categories must be seeded before Products');
  }

  //const repo = dataSource.getRepository(Supplier);
  const existing = await productRepo.count();
  if (existing > 0) {
    console.log('🛑 Product already exist. Skipping...');
    return;
  }

  const products = [
    {
      ProductName: 'Chai',
      Supplier: suppliers[0],
      Category: categories[0],
      QuantityPerUnit: '10 boxes x 20 bags',
      UnitPrice: 18.0,
      UnitsInStock: 39,
      UnitsOnOrder: 0,
      ReorderLevel: 10,
      Discontinued: false,
    },
    {
      ProductName: 'Chang',
      Supplier: suppliers[1 % suppliers.length],
      Category: categories[1 % categories.length],
      QuantityPerUnit: '24 - 12 oz bottles',
      UnitPrice: 19.0,
      UnitsInStock: 17,
      UnitsOnOrder: 40,
      ReorderLevel: 25,
      Discontinued: false,
    },
    {
      ProductName: 'Aniseed Syrup',
      Supplier: suppliers[2 % suppliers.length],
      Category: categories[2 % categories.length],
      QuantityPerUnit: '12 - 550 ml bottles',
      UnitPrice: 10.0,
      UnitsInStock: 13,
      UnitsOnOrder: 70,
      ReorderLevel: 25,
      Discontinued: false,
    },
    {
      ProductName: "Chef Anton's Cajun Seasoning",
      Supplier: suppliers[3 % suppliers.length],
      Category: categories[1 % categories.length],
      QuantityPerUnit: '48 - 6 oz jars',
      UnitPrice: 22.0,
      UnitsInStock: 53,
      UnitsOnOrder: 0,
      ReorderLevel: 0,
      Discontinued: false,
    },
    {
      ProductName: "Chef Anton's Gumbo Mix",
      Supplier: suppliers[0],
      Category: categories[0],
      QuantityPerUnit: '36 boxes',
      UnitPrice: 21.35,
      UnitsInStock: 0,
      UnitsOnOrder: 0,
      ReorderLevel: 0,
      Discontinued: true,
    },
    {
      ProductName: "Grandma's Boysenberry Spread",
      Supplier: suppliers[1 % suppliers.length],
      Category: categories[2 % categories.length],
      QuantityPerUnit: '12 - 8 oz jars',
      UnitPrice: 25.0,
      UnitsInStock: 120,
      UnitsOnOrder: 0,
      ReorderLevel: 25,
      Discontinued: false,
    },
    {
      ProductName: "Uncle Bob's Organic Dried Pears",
      Supplier: suppliers[2 % suppliers.length],
      Category: categories[0],
      QuantityPerUnit: '12 - 1 lb pkgs.',
      UnitPrice: 30.0,
      UnitsInStock: 15,
      UnitsOnOrder: 0,
      ReorderLevel: 10,
      Discontinued: false,
    },
    {
      ProductName: 'Northwoods Cranberry Sauce',
      Supplier: suppliers[3 % suppliers.length],
      Category: categories[1 % categories.length],
      QuantityPerUnit: '12 - 12 oz jars',
      UnitPrice: 40.0,
      UnitsInStock: 6,
      UnitsOnOrder: 0,
      ReorderLevel: 0,
      Discontinued: false,
    },
    {
      ProductName: 'Mishi Kobe Niku',
      Supplier: suppliers[1 % suppliers.length],
      Category: categories[2 % categories.length],
      QuantityPerUnit: '18 - 500 g pkgs.',
      UnitPrice: 97.0,
      UnitsInStock: 29,
      UnitsOnOrder: 0,
      ReorderLevel: 0,
      Discontinued: true,
    },
    {
      ProductName: 'Ikura',
      Supplier: suppliers[0],
      Category: categories[0],
      QuantityPerUnit: '12 - 200 ml jars',
      UnitPrice: 31.0,
      UnitsInStock: 31,
      UnitsOnOrder: 0,
      ReorderLevel: 0,
      Discontinued: false,
    },
  ].map((p) => productRepo.create(p));

  await productRepo.save(products);
  console.log('✅ Seeded Products');
}
