import { Dialect, Options } from 'sequelize';
import { Environment } from './app';

export type Database = 'foods' | 'system';

export type DBConnectionInfo = Record<Database, Options>;
export type DatabaseConfig = Record<Environment, DBConnectionInfo>;

const databaseConfig: DatabaseConfig = {
  development: {
    foods: {
      host: process.env.DB_FOODS_HOST || 'localhost',
      port: parseInt(process.env.DB_FOODS_PORT || '5432', 10),
      database: process.env.DB_FOODS_DATABASE || 'intake24_foods',
      username: process.env.DB_FOODS_USERNAME || 'intake24',
      password: process.env.DB_FOODS_PASSWORD ?? '',
      dialect: (process.env.DB_FOODS_DRIVER || 'postgres') as Dialect,
    },
    system: {
      host: process.env.DB_SYSTEM_HOST || 'localhost',
      port: parseInt(process.env.DB_SYSTEM_PORT || '5432', 10),
      database: process.env.DB_SYSTEM_DATABASE || 'intake24_system',
      username: process.env.DB_SYSTEM_USERNAME || 'intake24',
      password: process.env.DB_SYSTEM_PASSWORD ?? '',
      dialect: (process.env.DB_SYSTEM_DRIVER || 'postgres') as Dialect,
    },
  },
  test: {
    foods: {
      host: process.env.DB_FOODS_HOST || 'localhost',
      port: parseInt(process.env.DB_FOODS_PORT || '5432', 10),
      database: process.env.DB_FOODS_DATABASE || 'intake24_foods',
      username: process.env.DB_FOODS_USERNAME || 'intake24',
      password: process.env.DB_FOODS_PASSWORD ?? '',
      dialect: (process.env.DB_FOODS_DRIVER || 'postgres') as Dialect,
    },
    system: {
      host: process.env.DB_SYSTEM_HOST || 'localhost',
      port: parseInt(process.env.DB_SYSTEM_PORT || '5432', 10),
      database: process.env.DB_SYSTEM_DATABASE || 'intake24_system',
      username: process.env.DB_SYSTEM_USERNAME || 'intake24',
      password: process.env.DB_SYSTEM_PASSWORD ?? '',
      dialect: (process.env.DB_SYSTEM_DRIVER || 'postgres') as Dialect,
    },
  },
  production: {
    foods: {
      host: process.env.DB_FOODS_HOST || 'localhost',
      port: parseInt(process.env.DB_FOODS_PORT || '5432', 10),
      database: process.env.DB_FOODS_DATABASE || 'intake24_foods',
      username: process.env.DB_FOODS_USERNAME || 'intake24',
      password: process.env.DB_FOODS_PASSWORD ?? '',
      dialect: (process.env.DB_FOODS_DRIVER || 'postgres') as Dialect,
    },
    system: {
      host: process.env.DB_SYSTEM_HOST || 'localhost',
      port: parseInt(process.env.DB_SYSTEM_PORT || '5432', 10),
      database: process.env.DB_SYSTEM_DATABASE || 'intake24_system',
      username: process.env.DB_SYSTEM_USERNAME || 'intake24',
      password: process.env.DB_SYSTEM_PASSWORD ?? '',
      dialect: (process.env.DB_SYSTEM_DRIVER || 'postgres') as Dialect,
    },
  },
};

export default databaseConfig;
