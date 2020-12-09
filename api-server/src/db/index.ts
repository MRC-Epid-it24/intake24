import pg from 'pg';
import { Sequelize } from 'sequelize-typescript';
import { Database, DatabaseConfig } from '@api-server/config/database';
import { Logger } from 'winston';
import { Environment } from '@api-server/config/app';
import * as foods from './models/foods';
import * as system from './models/system';

// Parse int8 as number
pg.defaults.parseInt8 = true;

const models = {
  foods: Object.values(foods),
  system: Object.values(system),
};

export type BaseDbInterface = Record<Database, Sequelize>;

export interface DbInterface extends BaseDbInterface {
  init(): Promise<void>;
}

export default class DB implements DbInterface {
  private readonly config: DatabaseConfig;

  private readonly env: Environment;

  private readonly logger: Logger;

  public foods!: Sequelize;

  public system!: Sequelize;

  constructor(opts: { environment: Environment; databaseConfig: DatabaseConfig; logger: Logger }) {
    this.env = opts.environment;
    this.config = opts.databaseConfig;
    this.logger = opts.logger;
  }

  async init(): Promise<void> {
    const isDev = this.env === 'development';

    (Object.keys(this.config[this.env]) as Database[]).forEach((database) => {
      const dbConf = this.config[this.env][database];

      this[database] = new Sequelize({
        ...dbConf,
        models: models[database],
        logging: isDev
          ? (sql: string, timing?: number): void => {
              this.logger.debug(sql);
            }
          : false,
      });
    });

    // Soft-sync for DEV environment
    // if (isDev) await this.system.sync();
  }
}
