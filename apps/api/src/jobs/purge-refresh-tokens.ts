import { Job } from 'bullmq';
import { PurgeRefreshTokensParams } from '@common/types';
import type { IoC } from '@api/ioc';
import BaseJob from './job';

export default class PurgeRefreshTokens extends BaseJob<PurgeRefreshTokensParams> {
  readonly name = 'PurgeRefreshTokens';

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
   * @memberof PurgeRefreshTokens
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
   * @memberof PurgeRefreshTokens
   */
  private async purgeTokens(): Promise<void> {
    await this.jwtRotationService.purge();
  }
}
