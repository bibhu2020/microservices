import { DataSource } from 'typeorm';
import { Shipper } from '../../models/shipper.entity';

export async function seedShippers(dataSource: DataSource) {
  const repo = dataSource.getRepository(Shipper);
  const existing = await repo.count();
  if (existing > 0) {
    console.log('🛑 Shippers already exist. Skipping...');
    return;
  }

  const shippers = [
    { CompanyName: 'Speedy Express', Phone: '123-456-7890' },
    { CompanyName: 'United Package', Phone: '234-567-8901' },
    { CompanyName: 'Federal Shipping', Phone: '345-678-9012' },
    { CompanyName: 'Blue Dart', Phone: '456-789-0123' },
    { CompanyName: 'DHL Logistics', Phone: '567-890-1234' },
    { CompanyName: 'Express Cargo', Phone: '678-901-2345' },
    { CompanyName: 'Aramex', Phone: '789-012-3456' },
    { CompanyName: 'Courier Plus', Phone: '890-123-4567' },
    { CompanyName: 'Overnight Freight', Phone: '901-234-5678' },
    { CompanyName: 'Interstate Shippers', Phone: '012-345-6789' },
    { CompanyName: 'Same Day Express', Phone: '111-222-3333' },
    { CompanyName: 'EcoShip', Phone: '222-333-4444' },
  ].map((s) => repo.create(s));

  await repo.save(shippers);
  console.log('✅ Seeded Shippers');
}
