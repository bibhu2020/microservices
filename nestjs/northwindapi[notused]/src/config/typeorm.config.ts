import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config(); // Ensure environment variables are loaded
import * as path from 'path';

const dbUrl = new URL(process.env.DATABASE_URL || '');
const appDirectory = process.cwd();
const isDev = process.env.NODE_ENV !== 'production';
const rootDir = isDev ? 'src' : 'dist';

// console.log('Current directory:', appDirectory);
// console.log('Root directory:', rootDir);
// console.log('isDev:', isDev);

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

// console.log('Entities path:', entitiesPath);
// console.log('Migrations path:', migrationsPath);

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
