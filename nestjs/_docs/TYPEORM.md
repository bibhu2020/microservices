## Using ORM (TypeORM)

### Install TypeORM (that the db layer would use)
```bash
npm install @nestjs/typeorm typeorm pg
```

### Install required packages
```bash
//Neon postrgress needs SSL
npm install pg

//Package to read .env file
npm install @nestjs/config dotenv

//pacakges for dto needed
npm install @nestjs/mapped-types class-transformer class-validator
```

**Note**: Setup environment variable for postgress
DATABASE_URL=""

### Add TypeOrmModule and ConfigModule in app.module.ts or northwindapi.module.ts in the "northwindapi" root.
app.module.ts is in standalone app. 
northwindapi.module.ts is in case northwindapi is a sub-app in monorepo.
```ts
import { Module } from '@nestjs/common';
import { NorthwindapiController } from './northwindapi.controller';
import { NorthwindapiService } from './northwindapi.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import AppDataSource from './config/typeorm.config'; // Adjust path as needed

@Module({
  imports: [
    //Config module
    ConfigModule.forRoot({ isGlobal: true }),

    //Database connection
    TypeOrmModule.forRootAsync({
      useFactory: async () => AppDataSource.options,
    }),

  ],
  controllers: [NorthwindapiController],
  providers: [NorthwindapiService],
})
export class NorthwindapiModule {}
```

### TypeORM Configuration (src/config/typeorm.config.ts)
```ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config(); // Ensure environment variables are loaded
import * as path from 'path';

const dbUrl = new URL(process.env.DATABASE_URL || '');
const appDirectory = process.cwd();
const isDev = process.env.NODE_ENV !== 'production';
const rootDir = isDev ? 'src' : 'dist';

const entitiesPath = path.join(
  appDirectory,
  rootDir,
  'models',
  `*.entity.${isDev ? 'ts' : 'js'}`,
);
const migrationsPath = path.join(
  appDirectory,
  rootDir,
  'database',
  'migrations',
  `*-migration.${isDev ? 'ts' : 'js'}`,
);

const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 5432, // Default to 5432 if not set
  username: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1), // Remove the leading slash from the database name
  // ssl: dbUrl.protocol === 'postgresqls:',  // Use SSL if the protocol is postgresqls
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: false, // Set to false in production
  migrationsRun: false,
  logging: false,
});

export default AppDataSource;

```

### DTO (data transform object)
You call must deal with your service using dto, not with entity/model object. Entity object is the representation of your table, but not for data transfer in and out of the service.

Hence, it's important to transfer entity to dto while sending out.

#### Auto model-to-dto transformation.
```bash
npm install class-transformer

npm install date-fns

```

**Define the DTO with @Expose (and optionally @Exclude)**
```js
import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class CustomerDto {
  @Expose()
  CustomerID: string;

  @Expose()
  CompanyName: string;

  @Expose()
  BirthDate: string; // use string for formatted output
}
```

**Map Entity to DTO using plainToInstance (or instanceToInstance)**
```ts
// for single record
import { plainToInstance } from 'class-transformer';
import { format } from 'date-fns';

const customerDto = plainToInstance(CustomerDto, {
  ...customer,
  BirthDate: format(customer.BirthDate, 'yyyy-MM-dd'),
});

//for array of records
const customerDtos = plainToInstance(CustomerDto, customers.map(c => ({
  ...c,
  BirthDate: format(c.BirthDate, 'yyyy-MM-dd'),
})));

```