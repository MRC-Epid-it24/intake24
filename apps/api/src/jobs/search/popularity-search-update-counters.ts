import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class PopularitySearchUpdateCounters extends BaseJob<'PopularitySearchUpdateCounters'> {
  readonly name = 'PopularitySearchUpdateCounters';

  private readonly popularitySearchService;

  constructor({
    logger,
    popularitySearchService,
  }: Pick<IoC, 'logger' | 'popularitySearchService'>) {
    super({ logger });

    this.popularitySearchService = popularitySearchService;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof SurveySubmission
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.logger.debug('Job started.');

    const { foodCodes } = this.params;

    await this.popularitySearchService.updateCounters(foodCodes);

    this.logger.debug('Job finished.');
  }
}
