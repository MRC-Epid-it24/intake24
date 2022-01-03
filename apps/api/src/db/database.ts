import { Sequelize } from 'sequelize-typescript';
import { Database as DatabaseType } from '@api/config';
import type { IoC } from '@api/ioc';
import * as foods from './models/foods';
import * as system from './models/system';

const models = {
  foods: Object.values(foods),
  system: Object.values(system),
};

export type BaseDatabasesInterface = Record<DatabaseType, Sequelize>;

export interface DatabasesInterface extends BaseDatabasesInterface {
  init(): Promise<void>;
}

export default class Databases implements DatabasesInterface {
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
    this.logger = logger.child({ service: 'Database' });
  }

  async init(): Promise<void> {
    const isDev = this.env === 'development';

    for (const database of Object.keys(this.config[this.env]) as DatabaseType[]) {
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
