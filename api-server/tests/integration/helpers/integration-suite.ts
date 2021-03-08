import { Express } from 'express';
import app from '@/app';
import ioc from '@/ioc';
import foodIndex from '@/food-index';
import { initDatabaseData, wipeRedis, MockData } from './setup';

export type Bearers = Record<'admin' | 'user' | 'respondent', string>;

const { config, logger, db, scheduler } = ioc.cradle;

class IntegrationSuite {
  public config;

  public logger;

  public db;

  public scheduler;

  public app!: Express;

  public data!: MockData;

  public bearer!: Bearers;

  constructor() {
    this.config = config;
    this.logger = logger;
    this.db = db;
    this.scheduler = scheduler;
  }

  /**
   * Initialize integration suite
   *
   * @memberof IntegrationSuite
   */
  public async init() {
    // Wipe Redis store data
    await wipeRedis();

    // Boot up application with all dependencies
    this.app = await app({ config: this.config, logger: this.logger });

    // Fill in database with initial data
    this.data = await initDatabaseData();
  }

  /**
   * Close all I/O connections
   * - databases
   * - redis
   * - worker threads
   *
   * @memberof IntegrationSuite
   */
  public async close() {
    await this.scheduler.close();
    await this.db.foods.close();
    await this.db.system.close();
    await foodIndex.close();
  }
}

export default new IntegrationSuite();
