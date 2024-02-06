import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class LocaleSpecificIndexBuild extends BaseJob<'LocaleSpecificIndexBuild'> {
  readonly name = 'LocaleSpecificIndexBuild';

  private readonly localeIndexBuildService;
  private localeIds: string[] | undefined;

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

    //Connect to the redis stream to read the messages with the locale ids

    this.logger.debug('Starting Rebuildng Specified Indexes...');
    if (this.localeIds && this.localeIds.length > 0) {
      await this.localeIndexBuildService.rebuildFoodIndexJob(this.localeIds);
    } else {
      this.logger.debug('No locales specified. No Rebuilding is necessary');
    }

    this.logger.debug('Job finished.');
  }
}
