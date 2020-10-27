import jwtRotationSvc from '@/services/jwt-rotation.service';
import logger from '@/services/logger';
import { Job } from './job';

export default class implements Job {
  public readonly name: string;

  constructor() {
    this.name = 'PurgeRefreshTokens';
  }

  /**
   * Run the task
   *
   * @return Promise<void>
   */
  public async run(): Promise<void> {
    logger.debug(`Job ${this.name} started.`);

    await this.purgeTokens();

    logger.debug(`Job ${this.name} finished.`);
  }

  /**
   * Purge expired refresh tokens
   *
   * @private
   * @returns {Promise<void>}
   */
  private async purgeTokens(): Promise<void> {
    logger.debug(`Job ${this.name}: refresh tokens purge started.`);

    await jwtRotationSvc.purge();

    logger.debug(`Job ${this.name}: refresh tokens purge finished.`);
  }
}
