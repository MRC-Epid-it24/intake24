import type { Dialect, Options } from 'sequelize';

import type { Dictionary, Environment } from '@intake24/common/types';

export type DatabaseType = 'foods' | 'system';

export interface ExtraOptions {
  debugQueryLimit: number;
}

export type DBConnectionInfo = Record<DatabaseType, Options & ExtraOptions>;
export type DatabaseConfig = Record<Environment, DBConnectionInfo>;

export type OpsDialect = Extract<Dialect, 'mariadb' | 'mysql' | 'mssql' | 'postgres'>;

const dialectOptions: Record<OpsDialect, Dictionary> = {
  mariadb: {
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
  mysql: {
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
  mssql: {},
  postgres: {
    ssl: process.env.DB_CONNECTION_SSL === 'true' ? true : false,
  },
};

export const databaseConfig: DatabaseConfig = {
  development: {
    foods: {
      host: process.env.DB_DEV_FOODS_HOST || 'localhost',
      port: parseInt(process.env.DB_DEV_FOODS_PORT || '5432', 10),
      database: process.env.DB_DEV_FOODS_DATABASE || 'intake24_foods_dev',
      username: process.env.DB_DEV_FOODS_USERNAME || 'intake24',
      password: process.env.DB_DEV_FOODS_PASSWORD ?? '',
      dialect: (process.env.DB_DEV_FOODS_DRIVER || 'postgres') as Dialect,
      dialectOptions: dialectOptions[process.env.DB_DEV_FOODS_DRIVER as OpsDialect],
      debugQueryLimit: parseInt(process.env.DB_DEV_FOODS_DEBUG_QUERY_LIMIT || '0', 10),
    },
    system: {
      host: process.env.DB_DEV_SYSTEM_HOST || 'localhost',
      port: parseInt(process.env.DB_DEV_SYSTEM_PORT || '5432', 10),
      database: process.env.DB_DEV_SYSTEM_DATABASE || 'intake24_system_dev',
      username: process.env.DB_DEV_SYSTEM_USERNAME || 'intake24',
      password: process.env.DB_DEV_SYSTEM_PASSWORD ?? '',
      dialect: (process.env.DB_DEV_SYSTEM_DRIVER || 'postgres') as Dialect,
      dialectOptions: dialectOptions[process.env.DB_DEV_SYSTEM_DRIVER as OpsDialect],
      debugQueryLimit: parseInt(process.env.DB_DEV_SYSTEM_DEBUG_QUERY_LIMIT || '0', 10),
    },
  },
  test: {
    foods: {
      host: process.env.DB_TEST_FOODS_HOST || 'localhost',
      port: parseInt(process.env.DB_TEST_FOODS_PORT || '5432', 10),
      database: process.env.DB_TEST_FOODS_DATABASE || 'intake24_foods_test',
      username: process.env.DB_TEST_FOODS_USERNAME || 'intake24',
      password: process.env.DB_TEST_FOODS_PASSWORD ?? '',
      dialect: (process.env.DB_TEST_FOODS_DRIVER || 'postgres') as Dialect,
      dialectOptions: dialectOptions[process.env.DB_TEST_FOODS_DRIVER as OpsDialect],
      debugQueryLimit: parseInt(process.env.DB_TEST_FOODS_DEBUG_QUERY_LIMIT || '0', 10),
    },
    system: {
      host: process.env.DB_TEST_SYSTEM_HOST || 'localhost',
      port: parseInt(process.env.DB_TEST_SYSTEM_PORT || '5432', 10),
      database: process.env.DB_TEST_SYSTEM_DATABASE || 'intake24_system_test',
      username: process.env.DB_TEST_SYSTEM_USERNAME || 'intake24',
      password: process.env.DB_TEST_SYSTEM_PASSWORD ?? '',
      dialect: (process.env.DB_TEST_SYSTEM_DRIVER || 'postgres') as Dialect,
      dialectOptions: dialectOptions[process.env.DB_TEST_SYSTEM_DRIVER as OpsDialect],
      debugQueryLimit: parseInt(process.env.DB_TEST_SYSTEM_DEBUG_QUERY_LIMIT || '0', 10),
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
      dialectOptions: dialectOptions[process.env.DB_FOODS_DRIVER as OpsDialect],
      debugQueryLimit: parseInt(process.env.DB_FOODS_DEBUG_QUERY_LIMIT || '0', 10),
    },
    system: {
      host: process.env.DB_SYSTEM_HOST || 'localhost',
      port: parseInt(process.env.DB_SYSTEM_PORT || '5432', 10),
      database: process.env.DB_SYSTEM_DATABASE || 'intake24_system',
      username: process.env.DB_SYSTEM_USERNAME || 'intake24',
      password: process.env.DB_SYSTEM_PASSWORD ?? '',
      dialect: (process.env.DB_SYSTEM_DRIVER || 'postgres') as Dialect,
      dialectOptions: dialectOptions[process.env.DB_SYSTEM_DRIVER as OpsDialect],
      debugQueryLimit: parseInt(process.env.DB_SYSTEM_DEBUG_QUERY_LIMIT || '0', 10),
    },
  },
};
