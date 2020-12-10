import type { IoC } from '@/ioc';
import { Job, JobType } from './job';

export default class PurgeRefreshTokens implements Job {
  public readonly name: JobType = 'PurgeRefreshTokens';

  private readonly jwtRotationService;

  private readonly logger;

  constructor({ jwtRotationService, logger }: IoC) {
    this.jwtRotationService = jwtRotationService;
    this.logger = logger;
  }

  /**
   * Run the task
   *
   * @return Promise<void>
   */
  public async run(): Promise<void> {
    this.logger.debug(`Job ${this.name} started.`);

    await this.purgeTokens();

    this.logger.debug(`Job ${this.name} finished.`);
  }

  /**
   * Purge expired refresh tokens
   *
   * @private
   * @returns {Promise<void>}
   */
  private async purgeTokens(): Promise<void> {
    this.logger.debug(`Job ${this.name}: refresh tokens purge started.`);

    await this.jwtRotationService.purge();

    this.logger.debug(`Job ${this.name}: refresh tokens purge finished.`);
  }
}
