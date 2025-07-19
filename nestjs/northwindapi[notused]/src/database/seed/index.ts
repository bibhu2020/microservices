import AppDataSource from '../../config/typeorm.config';
import { seedCategories } from './seed-categories';
import { seedShippers } from './seed-shippers';
import { seedCustomers } from './seed-customers';
import { seedEmployees } from './seed-employees';
import { seedSuppliers } from './seed-suppliers';
import { seedProducts } from './seed-products';
import { seedOrders } from './seed-orders';
import { orderDetailSeed } from './seed-order-details';

async function runSeeding() {
  try {
    await AppDataSource.initialize();
    console.log('🚀 DataSource initialized');

    // Debug: List the loaded entities
    console.log(AppDataSource.entityMetadatas);

    await seedCategories(AppDataSource);
    await seedShippers(AppDataSource);
    await seedCustomers(AppDataSource);
    await seedEmployees(AppDataSource);
    await seedSuppliers(AppDataSource);
    await seedProducts(AppDataSource);
    await seedOrders(AppDataSource);
    await orderDetailSeed(AppDataSource);

    await AppDataSource.destroy();
    console.log('✅ Seeding completed, connection closed');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

runSeeding();
