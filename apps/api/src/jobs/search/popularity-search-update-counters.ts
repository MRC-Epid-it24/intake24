import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class PopularitySearchUpdateCounters extends BaseJob<'PopularitySearchUpdateCounters'> {
  readonly name = 'PopularitySearchUpdateCounters';

  private readonly popularityCountersService;

  constructor({
    logger,
    popularityCountersService,
  }: Pick<IoC, 'logger' | 'popularityCountersService'>) {
    super({ logger });

    this.popularityCountersService = popularityCountersService;
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

    const { localeCode, foodCodes } = this.params;

    await Promise.all([
      this.popularityCountersService.updateGlobalCounters(foodCodes),
      this.popularityCountersService.updateLocalCounters(localeCode, foodCodes),
    ]);

    this.logger.debug('Job finished.');
  }
}
