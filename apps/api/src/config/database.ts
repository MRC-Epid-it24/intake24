import { Dictionary } from '@common/types';
import { Dialect, Options } from 'sequelize';
import { Environment } from './app';

export type Database = 'foods' | 'system';

export type DBConnectionInfo = Record<Database, Options>;
export type DatabaseConfig = Record<Environment, DBConnectionInfo>;

const dialectOptions: Record<Dialect, Dictionary> = {
  mariadb: {
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
  mysql: {
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
  mssql: {},
  postgres: {},
  sqlite: {},
};

const foods = {
  host: process.env.DB_FOODS_HOST || 'localhost',
  port: parseInt(process.env.DB_FOODS_PORT || '5432', 10),
  database: process.env.DB_FOODS_DATABASE || 'intake24_foods',
  username: process.env.DB_FOODS_USERNAME || 'intake24',
  password: process.env.DB_FOODS_PASSWORD ?? '',
  dialect: (process.env.DB_FOODS_DRIVER || 'postgres') as Dialect,
  dialectOptions: dialectOptions[process.env.DB_FOODS_DRIVER as Dialect],
};

const system = {
  host: process.env.DB_SYSTEM_HOST || 'localhost',
  port: parseInt(process.env.DB_SYSTEM_PORT || '5432', 10),
  database: process.env.DB_SYSTEM_DATABASE || 'intake24_system',
  username: process.env.DB_SYSTEM_USERNAME || 'intake24',
  password: process.env.DB_SYSTEM_PASSWORD ?? '',
  dialect: (process.env.DB_SYSTEM_DRIVER || 'postgres') as Dialect,
  dialectOptions: dialectOptions[process.env.DB_SYSTEM_DRIVER as Dialect],
};

const databaseConfig: DatabaseConfig = {
  development: { foods, system },
  test: { foods, system },
  production: { foods, system },
};

export default databaseConfig;
