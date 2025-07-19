# Build REST API using NestJS and TypeORM
Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with and fully supports TypeScript (yet still enables developers to code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).


## install nestjs cli

npm i -g @nestjs/cli

## create nest restapi app

nest new oauthapinestjs

## Install typeorm
npm install @nestjs/typeorm typeorm pg

## Neon requires SSL, so make sure Node supports it. Usually you're good by default, but if issues arise, you can add:
npm install pg


## Have db URL in .env
npm install @nestjs/config

DATABASE_URL=""

## Update app.module.ts in the root
```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApploggerModule } from './utility/applogger/applogger.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ApploggerModule, 

    //Throttling settings
    ThrottlerModule.forRoot([{  
      name: 'short',
      ttl: 1000,   // 3 requests per 1 seconds (short limit)
      limit: 3,
    },{
      name: 'long',
      ttl: 60000,   // 100 requests per 1 minute (long limit)
      limit: 100,
    }]),

    //Config module
    ConfigModule.forRoot({ isGlobal: true }),

    //Database connection
    TypeOrmModule.forRootAsync({
      useFactory: async () => AppDataSource.options,
    }),

],

  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }],
})
export class AppModule {}

```

### Code first approach

**Create the entities / models (src/models)** e.g. category.entity.ts
```ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Categories')
export class Category {
  @PrimaryGeneratedColumn()
  CategoryID: number;

  @Column({ length: 15 })
  CategoryName: string;

  @Column({ type: 'text', nullable: true })
  Description: string;

  @Column({ type: 'bytea', nullable: true }) // Use `blob` for MySQL
  Picture: Buffer;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

```

**Create REST API Resources**
```bash
$npm g resource modules/category

Notes: 
this creates the following resources
- modules/category/dto/create-category.dto.ts
- modules/category/dto/update-category.dto.ts
- modules/category/entity/category.entity.ts (delete this one since you have the models aleady created manually above)
- modules/category/category.module.ts
- modules/category/category.controller.ts
- modules/category/category.service.ts
```


### Code-first db migration approach
Step1: create src/config/typeorm.config.ts

```ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();  // Ensure environment variables are loaded
import * as path from 'path';


const dbUrl = new URL(process.env.DATABASE_URL || '');
const appDirectory = process.cwd();
const isDev = process.env.NODE_ENV !== 'production';
const rootDir = isDev ? 'src' : 'dist';

console.log('Current directory:', appDirectory);
console.log('Root directory:', rootDir);
console.log('isDev:', isDev);

const entitiesPath = path.join(appDirectory, rootDir, 'models', `*.entity.${isDev ? 'ts' : 'js'}`);
const migrationsPath = path.join(appDirectory, rootDir, 'database', 'migrations', `*-migration.${isDev ? 'ts' : 'js'}`);

console.log('Entities path:', entitiesPath);
console.log('Migrations path:', migrationsPath);

const AppDataSource = new DataSource({
  type: 'postgres',
    host: dbUrl.hostname,
    port: Number(dbUrl.port) || 5432,  // Default to 5432 if not set
    username: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),  // Remove the leading slash from the database name
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
    synchronize: false,  // Set to false in production
    migrationsRun: false,
  logging: false,
});

export default AppDataSource;
```


Step2: Add the followings to package.json
```json
"scripts": {
    ........................................
    "migration:generate": "npx ts-node -P ./tsconfig.json -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -d ./src/config/typeorm.config.ts ./src/database/migrations/migration",
    "migration:create": "npx ts-node -P ./tsconfig.json -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create -d ./src/config/typeorm.config.ts ./src/database/migrations/migration",
    "migration:run": "npx ts-node -P ./tsconfig.json -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/config/typeorm.config.ts",
    "migration:revert": "npx ts-node -P ./tsconfig.json -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert -d ./src/config/typeorm.config.ts",
    "seed": "ts-node -r tsconfig-paths/register src/database/seed/index.ts"
    ..........................................
  },
  ```

Step3: create migration script folder 
 mkdir src/database/migrations/migration

Step4: Generate migration scripts
npm run migration:generate

Step5: Run the migration scripts to update db
npm run migration:run

### Running code in DEVELOPMENT (run ts files)
```json
    "start:dev": "npx ts-node-dev -r tsconfig-paths/register src/main.ts",

    "start:debug": "npx ts-node-dev -r tsconfig-paths/register src/main.ts --debug",
```

### Running code in PRODUCTION (run js file)
```
Step1: compile code first
Step2: run the code
```

```json
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "NODE_ENV=production nest start",

```