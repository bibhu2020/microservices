import { DataSource } from 'typeorm';
import { Order } from '../../models/order.entity';
import { Customer } from '../../models/customer.entity';
import { Employee } from '../../models/employee.entity';
import { Shipper } from '../../models/shipper.entity';

export async function seedOrders(dataSource: DataSource) {
  const repo = dataSource.getRepository(Order);
  const existing = await repo.count();
  if (existing > 0) {
    console.log('🛑 Order already exist. Skipping...');
    return;
  }

  // Get references to the entities
  const customerRepo = dataSource.getRepository(Customer);
  const employeeRepo = dataSource.getRepository(Employee);
  const shipperRepo = dataSource.getRepository(Shipper);

  // Fetch real records for seeding
  const customers = await customerRepo.find({ take: 10 }); // Get first 10 customers
  const employees = await employeeRepo.find({ take: 10 }); // Get first 10 employees
  const shippers = await shipperRepo.find({ take: 5 }); // Get first 5 shippers

  const orders = customers.map((customer, index) => {
    return {
      Customer: customer,
      Employee: employees[index % employees.length], // Ensure we loop through employees
      OrderDate: new Date(),
      RequiredDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days after OrderDate
      ShippedDate: new Date(new Date().setDate(new Date().getDate() + 10)), // 10 days after OrderDate
      ShipVia: shippers[index % shippers.length], // Loop through shippers
      Freight: parseFloat((Math.random() * 100).toFixed(2)), // Random freight value
      ShipName: `${customer.CompanyName} Shipping`,
      ShipAddress: `${customer.Address}`,
      ShipCity: customer.City,
      ShipRegion: customer.Region,
      ShipPostalCode: customer.PostalCode,
      ShipCountry: customer.Country,
    };
  });

  // Insert orders into the database
  await dataSource.getRepository(Order).save(orders);
  console.log('✅ Seeded orders');
}
