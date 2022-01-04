import { Sequelize } from 'sequelize-typescript';
import { dbLogger, Logger } from '@intake24/services';
import { Environment } from '@common/types';
import { DatabaseType, DatabaseConfig } from './config';
import * as foods from './models/foods';
import * as system from './models/system';

export const models = {
  foods: Object.values(foods),
  system: Object.values(system),
};

export type BaseDatabasesInterface = Record<DatabaseType, Sequelize>;

export interface DatabasesInterface extends BaseDatabasesInterface {
  init(): Promise<void>;
}

export type DatabaseOptions = {
  environment: Environment;
  databaseConfig: DatabaseConfig;
  logger: Logger;
};

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
        models: models[database],
        logging: isDev ? dbLogger : false,
      });

      // Force sync for TEST environment
      if (this.env === 'test') await this[database].sync({ force: true });
    }
  }
}
