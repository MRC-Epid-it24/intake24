import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class LocalePopularitySearchCopy extends BaseJob<'LocalePopularitySearchCopy'> {
  readonly name = 'LocalePopularitySearchCopy';

  private readonly pairwiseSearchService;

  constructor({ pairwiseSearchService, logger }: Pick<IoC, 'logger' | 'pairwiseSearchService'>) {
    super({ logger });

    this.pairwiseSearchService = pairwiseSearchService;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof LocalePopularitySearchCopy
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.logger.debug('Job started.');

    await this.copyAssociations();

    this.logger.debug('Job finished.');
  }

  private async copyAssociations(): Promise<void> {
    await this.pairwiseSearchService.copyAssociations(this.params);
  }
}
