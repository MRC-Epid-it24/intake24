import { Express } from 'express';
import app from '@/app';
import { DbInterface } from '@/db';
import ioc from '@/ioc';
import { Scheduler } from '@/services';
import { initDatabaseData, wipeRedis, MockData } from './setup';

export type Bearers = {
  admin: string;
  user: string;
  respondent: string;
};

const { config, logger, db, scheduler } = ioc.cradle;

class IntegrationSuite {
  public config;

  public logger;

  public db!: DbInterface;

  public app!: Express;

  public scheduler!: Scheduler;

  public data!: MockData;

  public bearer!: Bearers;

  constructor() {
    this.config = config;
    this.logger = logger;
    this.db = db;
    this.scheduler = scheduler;
  }

  public async init() {
    await wipeRedis();

    this.app = await app({ config, logger });
    this.data = await initDatabaseData();
  }

  public async close() {
    await this.scheduler.close();
    await this.db.foods.close();
    await this.db.system.close();
  }
}

export default new IntegrationSuite();
