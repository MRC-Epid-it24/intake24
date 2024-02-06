import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class LocaleAllIndexBuild extends BaseJob<'LocaleAllIndexBuild'> {
  readonly name = 'LocaleAllIndexBuild';

  private readonly localeIndexBuildService;

  constructor({ logger, foodSearchController }: Pick<IoC, 'logger' | 'foodSearchController'>) {
    super({ logger });

    this.localeIndexBuildService = foodSearchController;
  }

  /**
  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof SurveyRespondentsImport
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.logger.debug('Job started.');
    this.logger.debug('Starting Rebuildng Indexes...');

    await this.localeIndexBuildService.rebuildFoodIndexJob();

    this.logger.debug('Job finished.');
  }
}
