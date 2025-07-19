// ../../database/seed/seed-employees.ts
import { DataSource, DeepPartial } from 'typeorm';
import { Employee } from '../../models/employee.entity';

export async function seedEmployees(dataSource: DataSource) {
  const repo = dataSource.getRepository(Employee);
  const existing = await repo.count();
  if (existing > 0) {
    console.log('🛑 Employees already exist. Skipping...');
    return;
  }

  const now = new Date();
  const employees = repo.create([
    {
      FirstName: 'Nancy',
      LastName: 'Davolio',
      Title: 'Sales Representative',
      TitleOfCourtesy: 'Ms.',
      BirthDate: new Date('1948-12-08'),
      HireDate: new Date('1992-05-01'),
      Address: '507 - 20th Ave. E. Apt. 2A',
      City: 'Seattle',
      Region: 'WA',
      PostalCode: '98122',
      Country: 'USA',
      HomePhone: '(206) 555-9857',
      Extension: '5467',
      Notes: 'Education includes a BA in psychology.',
    },
    {
      FirstName: 'Andrew',
      LastName: 'Fuller',
      Title: 'Vice President, Sales',
      TitleOfCourtesy: 'Dr.',
      BirthDate: new Date('1952-02-19'),
      HireDate: new Date('1992-08-14'),
      Address: '908 W. Capital Way',
      City: 'Tacoma',
      Region: 'WA',
      PostalCode: '98401',
      Country: 'USA',
      HomePhone: '(206) 555-9482',
      Extension: '3457',
      Notes: 'Andrew received his BTS commercial in 1974.',
    },
    {
      FirstName: 'Janet',
      LastName: 'Leverling',
      Title: 'Sales Representative',
      TitleOfCourtesy: 'Ms.',
      BirthDate: new Date('1963-08-30'),
      HireDate: new Date('1992-04-01'),
      Address: '722 Moss Bay Blvd.',
      City: 'Kirkland',
      Region: 'WA',
      PostalCode: '98033',
      Country: 'USA',
      HomePhone: '(206) 555-3412',
      Extension: '3355',
      Notes: 'Janet has a BS degree in chemistry.',
    },
    {
      FirstName: 'Margaret',
      LastName: 'Peacock',
      Title: 'Sales Representative',
      TitleOfCourtesy: 'Mrs.',
      BirthDate: new Date('1937-09-19'),
      HireDate: new Date('1993-05-03'),
      Address: '4110 Old Redmond Rd.',
      City: 'Redmond',
      Region: 'WA',
      PostalCode: '98052',
      Country: 'USA',
      HomePhone: '(206) 555-8122',
      Extension: '5176',
      Notes: 'Margaret holds a BA in English literature.',
    },
    {
      FirstName: 'Steven',
      LastName: 'Buchanan',
      Title: 'Sales Manager',
      TitleOfCourtesy: 'Mr.',
      BirthDate: new Date('1955-03-04'),
      HireDate: new Date('1993-10-17'),
      Address: '14 Garrett Hill',
      City: 'London',
      Region: null,
      PostalCode: 'SW1 8JR',
      Country: 'UK',
      HomePhone: '(71) 555-4848',
      Extension: '3453',
      Notes: 'Steven was a Navy officer before his sales career.',
    },
    {
      FirstName: 'Michael',
      LastName: 'Suyama',
      Title: 'Sales Representative',
      TitleOfCourtesy: 'Mr.',
      BirthDate: new Date('1963-07-02'),
      HireDate: new Date('1993-10-17'),
      Address: 'Coventry House Miner Rd.',
      City: 'London',
      Region: null,
      PostalCode: 'EC2 7JR',
      Country: 'UK',
      HomePhone: '(71) 555-7773',
      Extension: '428',
      Notes: 'Michael enjoys tennis and classical music.',
    },
    {
      FirstName: 'Robert',
      LastName: 'King',
      Title: 'Sales Representative',
      TitleOfCourtesy: 'Mr.',
      BirthDate: new Date('1960-05-29'),
      HireDate: new Date('1994-01-02'),
      Address: 'Edgeham Hollow Winchester Way',
      City: 'London',
      Region: null,
      PostalCode: 'RG1 9SP',
      Country: 'UK',
      HomePhone: '(71) 555-5598',
      Extension: '465',
      Notes: 'Robert is a certified Salesforce administrator.',
    },
    {
      FirstName: 'Laura',
      LastName: 'Callahan',
      Title: 'Inside Sales Coordinator',
      TitleOfCourtesy: 'Ms.',
      BirthDate: new Date('1958-01-09'),
      HireDate: new Date('1994-03-05'),
      Address: '4726 - 11th Ave. N.E.',
      City: 'Seattle',
      Region: 'WA',
      PostalCode: '98105',
      Country: 'USA',
      HomePhone: '(206) 555-1189',
      Extension: '2344',
      Notes: 'Laura is passionate about volunteer work.',
    },
    {
      FirstName: 'Anne',
      LastName: 'Dodsworth',
      Title: 'Sales Representative',
      TitleOfCourtesy: 'Ms.',
      BirthDate: new Date('1966-01-27'),
      HireDate: new Date('1994-11-15'),
      Address: '7 Houndstooth Rd.',
      City: 'London',
      Region: null,
      PostalCode: 'WG2 7LT',
      Country: 'UK',
      HomePhone: '(71) 555-4444',
      Extension: '452',
      Notes: 'Anne enjoys travel and gourmet cooking.',
    },
  ] as DeepPartial<Employee>[]);

  const savedEmployees = await repo.save(employees);

  // Add ReportsTo relationships
  await repo.save([
    { ...savedEmployees[0], ReportsTo: savedEmployees[1] }, // Nancy -> Andrew
    { ...savedEmployees[2], ReportsTo: savedEmployees[1] }, // Janet -> Andrew
    { ...savedEmployees[3], ReportsTo: savedEmployees[4] }, // Margaret -> Steven
    { ...savedEmployees[5], ReportsTo: savedEmployees[4] }, // Michael -> Steven
    { ...savedEmployees[6], ReportsTo: savedEmployees[4] }, // Robert -> Steven
    { ...savedEmployees[8], ReportsTo: savedEmployees[4] }, // Anne -> Steven
  ]);
  console.log('✅ Seeded employees');
}
