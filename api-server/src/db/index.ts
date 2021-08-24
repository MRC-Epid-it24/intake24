import { Sequelize } from 'sequelize-typescript';
import { Database } from '@api-server/config';
import * as foods from './models/foods';
import * as system from './models/system';
import type { IoC } from '@/ioc';

const models = {
  foods: Object.values(foods),
  system: Object.values(system),
};

export type BaseDbInterface = Record<Database, Sequelize>;

export interface DbInterface extends BaseDbInterface {
  init(): Promise<void>;
}

export default class DB implements DbInterface {
  private readonly config;

  private readonly env;

  private readonly logger;

  public foods!: Sequelize;

  public system!: Sequelize;

  constructor({
    environment,
    databaseConfig,
    logger,
  }: Pick<IoC, 'environment' | 'databaseConfig' | 'logger'>) {
    this.env = environment;
    this.config = databaseConfig;
    this.logger = logger;
  }

  async init(): Promise<void> {
    const isDev = this.env === 'development';

    for (const database of Object.keys(this.config[this.env]) as Database[]) {
      const dbConf = this.config[this.env][database];

      this[database] = new Sequelize({
        ...dbConf,
        models: models[database],
        logging: isDev
          ? (sql: string): void => {
              this.logger.debug(sql);
            }
          : false,
      });

      // Force sync for TEST environment
      if (this.env === 'test') await this[database].sync({ force: true });
    }
  }
}
