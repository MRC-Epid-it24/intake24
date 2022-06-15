import type { Express } from 'express';
import app from '@intake24/portal/app';
import config from '@intake24/portal/config';
import { logger } from '@intake24/portal/services';

class IntegrationSuite {
  public config;

  public logger;

  public app!: Express;

  constructor() {
    this.config = config;
    this.logger = logger;
  }

  /**
   * Initialize integration suite
   *
   * @memberof IntegrationSuite
   */
  public async init() {
    // Boot up application with all dependencies
    this.app = await app({ config: this.config, logger: this.logger });
  }
}

export default new IntegrationSuite();
