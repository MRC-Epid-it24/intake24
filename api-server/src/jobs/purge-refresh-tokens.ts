import { JobsOptions } from 'bullmq';
import type { IoC } from '@/ioc';
import { PurgeRefreshTokensParams } from '@common/types';
import Job from './job';

export default class PurgeRefreshTokens extends Job<PurgeRefreshTokensParams> {
  readonly name = 'PurgeRefreshTokens';

  private readonly jwtRotationService;

  constructor({ jwtRotationService, logger }: Pick<IoC, 'jwtRotationService' | 'logger'>) {
    super({ logger });

    this.jwtRotationService = jwtRotationService;
  }

  /**
   * Run the task
   *
   * @param {string} jobId
   * @param {PurgeRefreshTokensParams} params
   * @param {JobsOptions} ops
   * @returns {Promise<void>}
   * @memberof PurgeRefreshTokens
   */
  public async run(
    jobId: string,
    params: PurgeRefreshTokensParams,
    ops: JobsOptions
  ): Promise<void> {
    this.init(jobId, params, ops);

    this.logger.debug(`Job ${this.name} | ${jobId} started.`);

    await this.purgeTokens();

    this.logger.debug(`Job ${this.name} | ${jobId} finished.`);
  }

  /**
   * Purge expired refresh tokens
   *
   * @private
   * @returns {Promise<void>}
   * @memberof PurgeRefreshTokens
   */
  private async purgeTokens(): Promise<void> {
    this.logger.debug(`Job ${this.name}: refresh tokens purge started.`);

    await this.jwtRotationService.purge();

    this.logger.debug(`Job ${this.name}: refresh tokens purge finished.`);
  }
}
