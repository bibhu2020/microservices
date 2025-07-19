import { DataSource } from 'typeorm';
import * as Entities from '@bpm/data/models';
import { config } from 'dotenv';
config(); // Ensure environment variables are loaded
import * as path from 'path';

// console.log('Database URL:', process.env.DATABASE_URL);

const appRoot = path.resolve(__dirname, '..', '..');
console.log('App root:', appRoot);

const dbUrl = new URL(process.env.DATABASE_URL || '');
// const appDirectory = process.cwd();
const isDev = process.env.NODE_ENV !== 'production';
// const sourceDir = isDev ? 'src' : 'dist';

// console.log('Current directory:', appDirectory);
// console.log('Root directory:', rootDir);
// console.log('isDev:', isDev);


// const entitiesPath = path.join(
//   appRoot,
//   "src",
//   'models',
//   `*.entity.${isDev ? 'ts' : 'js'}`,
// );
// const migrationsPath = path.join(
//   appRoot,
//   "src",
//   'database',
//   'migrations',
//   `*-migration.${isDev ? 'ts' : 'js'}`,
// );


// const entities = path.join(
//   appRoot,
//   "src",
//   'models',
//   `*.entity.${isDev ? 'ts' : 'js'}`,
// );
const migrations = path.join(
  appRoot,
  "src",
  'database',
  'migrations',
  `*-migration.${isDev ? 'ts' : 'js'}`,
);

// console.log('Entities path:', entities);
// console.log('Migrations path:', migrations);



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
  // entities: [entities],
  // migrations: [migrations],
  entities: Object.values(Entities),
  migrations: [migrations],
  synchronize: false, // Set to false in production
  migrationsRun: false,
  logging: false,
});

export default AppDataSource;
