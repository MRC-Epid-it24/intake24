import pg from 'pg';
import { Sequelize } from 'sequelize-typescript';
import { Database } from '@/config/database';
import type { IoC } from '@/ioc';
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
  private config;

  private logger;

  public foods!: Sequelize;

  public system!: Sequelize;

  constructor({ config, logger }: IoC) {
    this.config = config;
    this.logger = logger;
  }

  async init(): Promise<void> {
    const { env } = this.config.app;
    const isDev = env === 'development';

    (Object.keys(this.config.database[env]) as Database[]).forEach((database) => {
      const dbConf = this.config.database[env][database];
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
