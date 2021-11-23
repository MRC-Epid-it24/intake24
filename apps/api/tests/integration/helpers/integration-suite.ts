import { Express } from 'express';
import fs from 'fs-extra';
import app from '@api/app';
import ioc from '@api/ioc';
import foodIndex from '@api/food-index';
import { initDatabase, initFiles, wipeRedis, MockData, MockFiles } from '.';

export type Bearers = Record<'superuser' | 'user' | 'respondent', string>;

const { config, logger, db, cache, scheduler, session } = ioc.cradle;

class IntegrationSuite {
  public config;

  public logger;

  public db;

  public cache;

  public scheduler;

  public session;

  public app!: Express;

  public data!: MockData;

  public files!: MockFiles;

  public bearer!: Bearers;

  constructor() {
    this.config = config;
    this.logger = logger;
    this.db = db;
    this.cache = cache;
    this.scheduler = scheduler;
    this.session = session;
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
    this.data = await initDatabase();

    // Grab mock files
    this.files = await initFiles();
  }

  /**
   * Close all I/O connections
   * - databases
   * - redis (cache & queue system)
   * - worker threads (food index)
   *
   * @memberof IntegrationSuite
   */
  public async close() {
    // Close redis store connections
    this.cache.close();
    this.session.close();

    // Close redis queue connections
    await this.scheduler.close();

    await this.scheduler.close();
    await this.db.foods.close();
    await this.db.system.close();
    await foodIndex.close();

    const { downloads, uploads, images } = this.config.filesystem.local;
    [downloads, uploads, images].forEach((folder) => {
      fs.rmdirSync(folder, { recursive: true });
    });
  }
}

export default new IntegrationSuite();
