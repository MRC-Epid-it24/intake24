import { Sequelize } from 'sequelize-typescript';
import appConfig from '@/config/app';
import dbConfig from '@/config/database';
import foods from './models/foods';
import system from './models/system';

interface DbInterface {
  system: Sequelize;
  foods: Sequelize;
  init(): Promise<void>;
}

const { env } = appConfig;

const models = {
  system: Object.values(system),
  foods: Object.values(foods),
};

const db = {
  async init() {
    Object.keys(dbConfig[env].databases).forEach((database: string) => {
      const dbConf = dbConfig[env].databases[database];
      this[database] = new Sequelize({
        ...dbConf,
        models: models[database],
      });
    });
  },
} as DbInterface;

export default db;
