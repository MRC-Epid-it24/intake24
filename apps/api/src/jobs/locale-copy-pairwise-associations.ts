import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';
import type { JobParams } from '@intake24/common/types';

import BaseJob from './job';

export default class LocaleCopyPairwiseAssociations extends BaseJob<
  JobParams['LocaleCopyPairwiseAssociations']
> {
  readonly name = 'LocaleCopyPairwiseAssociations';

  private readonly localeService;

  constructor({ localeService, logger }: Pick<IoC, 'localeService' | 'logger'>) {
    super({ logger });

    this.localeService = localeService;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof LocaleCopyPairwiseAssociations
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.logger.debug('Job started.');

    await this.copyPairwiseAssociations();

    this.logger.debug('Job finished.');
  }

  private async copyPairwiseAssociations(): Promise<void> {
    await this.localeService.copyPairwiseAssociations(this.params);
  }
}
