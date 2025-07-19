// src/database/seed/seed-customers.ts
import { DataSource } from 'typeorm';
import { Customer } from '../../models/customer.entity';

export async function seedCustomers(dataSource: DataSource) {
  const repo = dataSource.getRepository(Customer);
  const existing = await repo.count();
  if (existing > 0) {
    console.log('🛑 Customers already exist. Skipping...');
    return;
  }

  const customers: Partial<Customer>[] = [
    {
      CustomerID: 'ALFKI',
      CompanyName: 'Alfreds Futterkiste',
      ContactName: 'Maria Anders',
      ContactTitle: 'Sales Representative',
      Address: 'Obere Str. 57',
      City: 'Berlin',
      PostalCode: '12209',
      Country: 'Germany',
      Phone: '030-0074321',
      Fax: '030-0076545',
    },
    {
      CustomerID: 'ANATR',
      CompanyName: 'Ana Trujillo Emparedados y helados',
      ContactName: 'Ana Trujillo',
      ContactTitle: 'Owner',
      Address: 'Avda. de la Constitución 2222',
      City: 'México D.F.',
      PostalCode: '05021',
      Country: 'Mexico',
      Phone: '(5) 555-4729',
      Fax: '(5) 555-3745',
    },
    {
      CustomerID: 'ANTON',
      CompanyName: 'Antonio Moreno Taquería',
      ContactName: 'Antonio Moreno',
      ContactTitle: 'Owner',
      Address: 'Mataderos 2312',
      City: 'México D.F.',
      PostalCode: '05023',
      Country: 'Mexico',
      Phone: '(5) 555-3932',
    },
    {
      CustomerID: 'AROUT',
      CompanyName: 'Around the Horn',
      ContactName: 'Thomas Hardy',
      ContactTitle: 'Sales Representative',
      Address: '120 Hanover Sq.',
      City: 'London',
      PostalCode: 'WA1 1DP',
      Country: 'UK',
      Phone: '(171) 555-7788',
      Fax: '(171) 555-6750',
    },
    {
      CustomerID: 'BERGS',
      CompanyName: 'Berglunds snabbköp',
      ContactName: 'Christina Berglund',
      ContactTitle: 'Order Administrator',
      Address: 'Berguvsvägen 8',
      City: 'Luleå',
      PostalCode: 'S-958 22',
      Country: 'Sweden',
      Phone: '0921-12 34 65',
      Fax: '0921-12 34 67',
    },
    {
      CustomerID: 'BLAUS',
      CompanyName: 'Blauer See Delikatessen',
      ContactName: 'Hanna Moos',
      ContactTitle: 'Sales Representative',
      Address: 'Forsterstr. 57',
      City: 'Mannheim',
      PostalCode: '68306',
      Country: 'Germany',
      Phone: '0621-08460',
      Fax: '0621-08924',
    },
    {
      CustomerID: 'BLONP',
      CompanyName: 'Blondel père et fils',
      ContactName: 'Frédérique Citeaux',
      ContactTitle: 'Marketing Manager',
      Address: '24, place Kléber',
      City: 'Strasbourg',
      PostalCode: '67000',
      Country: 'France',
      Phone: '88.60.15.31',
      Fax: '88.60.15.32',
    },
    {
      CustomerID: 'BOLID',
      CompanyName: 'Bólido Comidas preparadas',
      ContactName: 'Martín Sommer',
      ContactTitle: 'Owner',
      Address: 'C/ Araquil, 67',
      City: 'Madrid',
      PostalCode: '28023',
      Country: 'Spain',
      Phone: '(91) 555 22 82',
      Fax: '(91) 555 91 99',
    },
    {
      CustomerID: 'BONAP',
      CompanyName: "Bon app'",
      ContactName: 'Laurence Lebihan',
      ContactTitle: 'Owner',
      Address: '12, rue des Bouchers',
      City: 'Marseille',
      PostalCode: '13008',
      Country: 'France',
      Phone: '91.24.45.40',
      Fax: '91.24.45.41',
    },
    {
      CustomerID: 'BOTTM',
      CompanyName: 'Bottom-Dollar Markets',
      ContactName: 'Elizabeth Lincoln',
      ContactTitle: 'Accounting Manager',
      Address: '23 Tsawassen Blvd.',
      City: 'Tsawassen',
      Region: 'BC',
      PostalCode: 'T2F 8M4',
      Country: 'Canada',
      Phone: '(604) 555-4729',
      Fax: '(604) 555-3745',
    },
  ];

  await repo.save(customers);
  console.log('✅ Seeded customers');
}
