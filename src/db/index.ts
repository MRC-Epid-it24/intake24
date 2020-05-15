import { Sequelize } from 'sequelize-typescript';
import appConfig from '@/config/app';
import dbConfig, { Database } from '@/config/database';
import foods from './models/foods';
import system from './models/system';

export type BaseDbInterface = Record<Database, Sequelize>;

export interface DbInterface extends BaseDbInterface {
  init(): Promise<void>;
}

const { env } = appConfig;

const db = {
  async init() {
    this.foods = new Sequelize({ ...dbConfig[env].foods, models: Object.values(foods) });
    this.system = new Sequelize({ ...dbConfig[env].system, models: Object.values(system) });
  },
} as DbInterface;

export default db;
