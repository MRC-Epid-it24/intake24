import pg from 'pg';
import { Sequelize } from 'sequelize-typescript';
import appConfig from '@/config/app';
import dbConfig, { Database } from '@/config/database';
import { dbLogger } from '@/services/logger';
import * as foods from './models/foods';
import * as system from './models/system';

// Parse int8 as number
pg.defaults.parseInt8 = true;

export type BaseDbInterface = Record<Database, Sequelize>;

export interface DbInterface extends BaseDbInterface {
  init(): Promise<void>;
}

const { env } = appConfig;

const logging = env === 'development' ? dbLogger : false;

const db = {
  async init() {
    this.foods = new Sequelize({
      ...dbConfig[env].foods,
      models: Object.values(foods),
      logging,
    });
    this.system = new Sequelize({
      ...dbConfig[env].system,
      models: Object.values(system),
      logging,
    });
  },
} as DbInterface;

export default db;
