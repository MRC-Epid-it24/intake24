import { Sequelize } from 'sequelize-typescript';

import type { Environment } from '@intake24/common/types';
import type { Logger } from '@intake24/services';

import type { DatabaseConfig, DatabaseType } from './config';
import * as foods from './models/foods';
import * as system from './models/system';

export const models = { foods, system };

export type BaseDatabasesInterface = Record<DatabaseType, Sequelize>;

export interface DatabasesInterface extends BaseDatabasesInterface {
  init(): Promise<void>;
  close(): Promise<void>;
}

export type DatabaseOptions = {
  environment: Environment;
  databaseConfig: DatabaseConfig;
  logger: Logger;
};

export function databaseLogQuery(sql: string, logger: Logger, limit: number) {
  if (limit > 0 && sql.length > limit) {
    logger.debug(sql.substring(0, limit) + '...');
  } else {
    logger.debug(sql);
  }
}

export class Database implements DatabasesInterface {
  private readonly config;

  private readonly env;

  private readonly logger;

  public foods!: Sequelize;

  public system!: Sequelize;

  constructor({ environment, databaseConfig, logger }: DatabaseOptions) {
    this.env = environment;
    this.config = databaseConfig;
    this.logger = logger.child({ service: 'Database' });
  }

  async init(): Promise<void> {
    const isDev = this.env === 'development';

    for (const database of Object.keys(this.config[this.env]) as DatabaseType[]) {
      const dbConf = this.config[this.env][database];

      this[database] = new Sequelize({
        ...dbConf,
        models: Object.values(models[database]),
        logging: isDev
          ? (sql) => databaseLogQuery(sql, this.logger, dbConf.debugQueryLimit)
          : false,
      });

      // Force sync for TEST environment
      if (this.env === 'test') await this[database].sync({ force: true });
    }
  }

  async close(): Promise<void> {
    await Promise.all([this.foods.close(), this.system.close()]);
  }
}
