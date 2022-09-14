import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class PairwiseSearchCopyAssociations extends BaseJob<'PairwiseSearchCopyAssociations'> {
  readonly name = 'PairwiseSearchCopyAssociations';

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
   * @memberof PairwiseSearchCopyAssociations
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
