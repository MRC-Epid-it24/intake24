import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class PurgeExpiredTokens extends BaseJob<'PurgeExpiredTokens'> {
  readonly name = 'PurgeExpiredTokens';

  private readonly jwtRotationService;

  constructor({ jwtRotationService, logger }: Pick<IoC, 'jwtRotationService' | 'logger'>) {
    super({ logger });

    this.jwtRotationService = jwtRotationService;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof PurgeExpiredTokens
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.logger.debug('Job started.');

    await this.purgeTokens();

    this.logger.debug('Job finished.');
  }

  /**
   * Purge expired refresh tokens
   *
   * @private
   * @returns {Promise<void>}
   * @memberof PurgeExpiredTokens
   */
  private async purgeTokens(): Promise<void> {
    await Promise.all([
      this.jwtRotationService.purgeRefreshTokens(),
      this.jwtRotationService.purgePersonalAccessTokens(),
    ]);
  }
}
