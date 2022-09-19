import type { Dialect, Options } from 'sequelize';

import type { Dictionary, Environment } from '@intake24/common/types';

export type DatabaseType = 'foods' | 'system';

export type DBConnectionInfo = Record<DatabaseType, Options>;
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
  postgres: {},
};

const foods = {
  host: process.env.DB_FOODS_HOST || 'localhost',
  port: parseInt(process.env.DB_FOODS_PORT || '5432', 10),
  database: process.env.DB_FOODS_DATABASE || 'intake24_foods',
  username: process.env.DB_FOODS_USERNAME || 'intake24',
  password: process.env.DB_FOODS_PASSWORD ?? '',
  dialect: (process.env.DB_FOODS_DRIVER || 'postgres') as Dialect,
  dialectOptions: dialectOptions[process.env.DB_FOODS_DRIVER as OpsDialect],
};

const system = {
  host: process.env.DB_SYSTEM_HOST || 'localhost',
  port: parseInt(process.env.DB_SYSTEM_PORT || '5432', 10),
  database: process.env.DB_SYSTEM_DATABASE || 'intake24_system',
  username: process.env.DB_SYSTEM_USERNAME || 'intake24',
  password: process.env.DB_SYSTEM_PASSWORD ?? '',
  dialect: (process.env.DB_SYSTEM_DRIVER || 'postgres') as Dialect,
  dialectOptions: dialectOptions[process.env.DB_SYSTEM_DRIVER as OpsDialect],
};

export const databaseConfig: DatabaseConfig = {
  development: { foods, system },
  test: { foods, system },
  production: { foods, system },
};
